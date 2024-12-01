'use client';

import { AxiosError } from 'axios';
import React, { DependencyList, useEffect, useState } from 'react';

import { kratos } from './sdk/client';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export const HandleError = (
    getFlow:
        | ((flowId: string) => Promise<void | AxiosError>)
        | undefined = undefined,
    setFlow: React.Dispatch<React.SetStateAction<any>> | undefined = undefined,
    defaultNav: string | undefined = undefined,
    fatalToError = false,
    router: AppRouterInstance,
) => {
    return async (
        error: AxiosError<any, unknown>,
    ): Promise<AxiosError | void> => {
        if (!error.response || error.response?.status === 0) {
            window.location.href = `/flow/error?error=${encodeURIComponent(
                JSON.stringify(error.response),
            )}`;
            return Promise.resolve();
        }

        const responseData = error.response?.data || {};

        switch (error.response?.status) {
            case 400: {
                if (responseData.error?.id == 'session_already_available') {
                    router.push('/');
                    return Promise.resolve();
                }

                // the request could contain invalid parameters which would set error messages in the flow
                if (setFlow !== undefined) {
                    console.warn('sdkError 400: update flow data');
                    setFlow(responseData);
                    return Promise.resolve();
                }
                break;
            }
            // we have no session or the session is invalid
            case 401: {
                console.warn('handleError hook 401: Navigate to /login');
                router.push('/flow/login');
                return Promise.resolve();
            }
            case 403: {
                // the user might have a session, but would require 2FA (Two-Factor Authentication)
                if (responseData.error?.id === 'session_aal2_required') {
                    router.push('/flow/login?aal2=true');
                    router.refresh();
                    return Promise.resolve();
                }

                if (
                    responseData.error?.id === 'session_refresh_required' &&
                    responseData.redirect_browser_to
                ) {
                    console.warn(
                        'sdkError 403: Redirect browser to',
                        responseData.redirect_browser_to,
                    );
                    window.location = responseData.redirect_browser_to;
                    return Promise.resolve();
                }
                break;
            }
            case 404: {
                console.warn('sdkError 404: Navigate to Error');
                const errorMsg = {
                    data: error.response?.data || error,
                    status: error.response?.status,
                    statusText: error.response?.statusText,
                    url: window.location.href,
                };

                router.push(
                    `/flow/error?error=${encodeURIComponent(JSON.stringify(errorMsg))}`,
                );
                return Promise.resolve();
            }
            // error.id handling
            //    "self_service_flow_expired"
            case 410: {
                if (getFlow !== undefined && responseData.use_flow_id !== undefined) {
                    console.warn('sdkError 410: Update flow');
                    return getFlow(responseData.use_flow_id).catch((error) => {
                        // Something went seriously wrong - log and redirect to defaultNav if possible
                        console.error(error);

                        if (defaultNav !== undefined) {
                            router.push(defaultNav);
                        } else {
                            // Rethrow error when can't navigate and let caller handle
                            throw error;
                        }
                    });
                } else if (defaultNav !== undefined) {
                    console.warn('sdkError 410: Navigate to', defaultNav);
                    router.push(defaultNav);
                    return Promise.resolve();
                }
                break;
            }
            // we need to parse the response and follow the `redirect_browser_to` URL
            // this could be when the user needs to perform a 2FA challenge
            // or passwordless login
            case 422: {
                if (responseData.redirect_browser_to !== undefined) {
                    const currentUrl = new URL(window.location.href);
                    const redirect = new URL(responseData.redirect_browser_to);

                    // host name has changed, then change location
                    if (currentUrl.host !== redirect.host) {
                        console.warn('sdkError 422: Host changed redirect');
                        window.location = responseData.redirect_browser_to;
                        return Promise.resolve();
                    }

                    // Path has changed
                    if (currentUrl.pathname !== redirect.pathname) {
                        console.warn('sdkError 422: Update path');
                        router.push(redirect.pathname + redirect.search);
                        return Promise.resolve();
                    }

                    // for webauthn we need to reload the flow
                    const flowId = redirect.searchParams.get('flow');

                    if (flowId != null && getFlow !== undefined) {
                        // get new flow data based on the flow id in the redirect url
                        console.warn('sdkError 422: Update flow');
                        return getFlow(flowId).catch((error) => {
                            // Something went seriously wrong - log and redirect to defaultNav if possible
                            console.error(error);

                            if (defaultNav !== undefined) {
                                router.push(defaultNav);
                            } else {
                                // Rethrow error when can't navigate and let caller handle
                                throw error;
                            }
                        });
                    } else {
                        console.warn('sdkError 422: Redirect browser to');
                        window.location = responseData.redirect_browser_to;
                        return Promise.resolve();
                    }
                }
            }
        }

        console.error(error);

        if (fatalToError) {
            console.warn('sdkError: fatal error redirect to /error');
            router.push('/flow/error?id=' + encodeURI(error.response?.data.error?.id));
            return Promise.resolve();
        }

        throw error;
    };
};

// Returns a function which will log the user out
export function LogoutLink(deps?: DependencyList) {

    const [logoutToken, setLogoutToken] = useState<string>('');

    useEffect(() => {
        kratos
            .createBrowserLogoutFlow()
            .then(({ data }) => {
                setLogoutToken(data.logout_token);
            })
            .catch((err: AxiosError) => {
                switch (err.response?.status) {
                    case 401:
                        // do nothing, the user is not logged in
                        return;
                }

                // Something else happened!
                return Promise.reject(err);
            });
    }, deps);

    return () => {
        if (logoutToken) {
            kratos
                .updateLogoutFlow({ token: logoutToken })
                .then(() => window.location.href = '/flow/login');
        }
    };
}
