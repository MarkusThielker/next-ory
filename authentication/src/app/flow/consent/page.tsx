'use server';

import React from 'react';
import { Card } from '@/components/ui/card';
import getHydra from '@/ory/sdk/hydra';
import { OAuth2ConsentRequest, OAuth2RedirectTo } from '@ory/client';
import ConsentForm from '@/components/consentForm';
import { redirect } from 'next/navigation';
import { toast } from 'sonner';

export default async function Consent({ searchParams }: { searchParams: { consent_challenge: string } }) {

    const consentChallenge = searchParams.consent_challenge ?? undefined;
    let consentRequest: OAuth2ConsentRequest | undefined = undefined;

    const onAccept = async (challenge: string, scopes: string[], remember: boolean) => {
        'use server';

        const hydra = await getHydra();
        const response = await hydra
            .acceptOAuth2ConsentRequest({
                consentChallenge: challenge,
                acceptOAuth2ConsentRequest: {
                    grant_scope: scopes,
                    remember: remember,
                    remember_for: 3600,
                },
            })
            .then(({ data }) => data)
            .catch((_) => {
                toast.error('Something unexpected went wrong.');
            });

        if (!response) {
            return redirect('/');
        }

        return redirect(response.redirect_to);
    };

    const onReject = async (challenge: string) => {
        'use server';

        const hydra = await getHydra();
        const response: OAuth2RedirectTo | void = await hydra
            .rejectOAuth2ConsentRequest({
                consentChallenge: challenge,
            })
            .then(({ data }) => data)
            .catch((_) => {
                toast.error('Something unexpected went wrong.');
            });

        if (!response) {
            return redirect('/');
        }

        return redirect(response.redirect_to);
    };

    if (!consentChallenge) {
        return;
    }

    const hydra = await getHydra();
    await hydra
        .getOAuth2ConsentRequest({ consentChallenge })
        .then(({ data }) => {
            if (data.skip) {
                onAccept(consentChallenge, data.requested_scope!, false);
                return;
            }
            consentRequest = data;
        });

    if (!consentRequest) {
        return;
    }

    return (
        <Card className="flex flex-col items-center w-full max-w-sm p-4">
            <ConsentForm
                request={consentRequest}
                onAccept={onAccept}
                onReject={onReject}/>
        </Card>
    );
}
