'use client';

import { AxiosError } from 'axios';
import { DependencyList, useEffect, useState } from 'react';

import { kratos } from './sdk/client';

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

            const url = process.env.NEXT_PUBLIC_AUTHENTICATION_NODE_URL +
                '/flow/login?return_to=' +
                process.env.NEXT_PUBLIC_DASHBOARD_NODE_URL;

            kratos
                .updateLogoutFlow({ token: logoutToken })
                .then(() => window.location.href = url);
        }
    };
}
