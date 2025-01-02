'use client';

import { Identity } from '@ory/client';
import { Button } from '@/components/ui/button';
import { Key, Link, Trash, UserCheck, UserMinus, UserX } from 'lucide-react';
import { ConfirmationDialogWrapper } from '@/components/confirmation-dialog-wrapper';
import {
    blockIdentity,
    createRecoveryCode,
    createRecoveryLink,
    deleteIdentity,
    deleteIdentitySessions,
    unblockIdentity,
} from '@/app/(inside)/user/action';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface IdentityActionProps {
    identity: Identity;
}

export function IdentityActions({ identity }: IdentityActionProps,
) {

    const router = useRouter();

    return (
        <>
            <ConfirmationDialogWrapper
                onSubmit={async () => {
                    await createRecoveryCode(identity.id)
                        .then((response) => {
                            console.log('recovery code created', response);
                            toast.success(response.recovery_code);
                        })
                        .catch(() => toast.error('Creating recovery code failed'));
                }}
                tooltipContent="Create recovery code"
                dialogTitle="Create recovery code"
                dialogDescription="Are you sure you want to create a recovery code for this identity?"
                dialogButtonSubmit="Create code"
            >
                <Button className="mr-2" size="icon">
                    <Key className="h-4"/>
                </Button>
            </ConfirmationDialogWrapper>

            <ConfirmationDialogWrapper
                onSubmit={async () => {
                    await createRecoveryLink(identity.id)
                        .then((response) => {
                            console.log('recovery link created', response);
                            toast.success(response.recovery_link);
                        })
                        .catch(() => toast.error('Creating recovery link failed. It is likely magic-links are disabled on your Ory Kratos instance.'));
                }}
                tooltipContent="Create recovery link"
                dialogTitle="Create recovery link"
                dialogDescription="Are you sure you want to create a recovery link for this identity?"
                dialogButtonSubmit="Create link"
            >
                <Button className="mr-2" size="icon">
                    <Link className="h-4"/>
                </Button>
            </ConfirmationDialogWrapper>

            {
                identity.state === 'active' ?
                    <ConfirmationDialogWrapper
                        onSubmit={async () => {
                            await blockIdentity(identity.id)
                                .then(() => toast.success('Identity deactivated'))
                                .catch(() => toast.error('Deactivating identity failed'));
                        }}
                        tooltipContent="Deactivate identity"
                        dialogTitle="Deactivate identity"
                        dialogDescription="Are you sure you want to deactivate this identity? The user will not be able to sign-in or use any active session until re-activation!"
                        dialogButtonSubmit="Deactivate"
                    >
                        <Button className="mr-2" size="icon">
                            <UserX className="h-4"/>
                        </Button>
                    </ConfirmationDialogWrapper>
                    :
                    <ConfirmationDialogWrapper
                        onSubmit={async () => {
                            await unblockIdentity(identity.id)
                                .then(() => toast.success('Identity activated'))
                                .catch(() => toast.error('Activating identity failed'));
                        }}
                        tooltipContent="Activate identity"
                        dialogTitle="Activate identity"
                        dialogDescription="Are you sure you want to activate this identity?"
                        dialogButtonSubmit="Activate"
                    >
                        <Button className="mr-2" size="icon">
                            <UserCheck className="h-4"/>
                        </Button>
                    </ConfirmationDialogWrapper>
            }

            <ConfirmationDialogWrapper
                onSubmit={async () => {
                    await deleteIdentitySessions(identity.id)
                        .then(() => toast.success('All sessions invalidated'))
                        .catch(() => toast.error('Invalidating all sessions failed'));
                }}
                tooltipContent="Invalidate all sessions"
                dialogTitle="Invalidate all sessions"
                dialogDescription="Are you sure you want to invalidate and delete ALL session of this identity? This action is irreversible!"
                dialogButtonSubmit="Invalidate sessions"
                dialogButtonSubmitProps={{ variant: 'destructive' }}
            >
                <Button className="mr-2" size="icon">
                    <UserMinus className="h-4"/>
                </Button>
            </ConfirmationDialogWrapper>

            <ConfirmationDialogWrapper
                onSubmit={async () => {
                    await deleteIdentity(identity.id)
                        .then(() => {
                            toast.success('Identity deleted');
                            router.push('/user');
                        })
                        .catch(() => toast.error('Deleting identity failed'));
                }}
                tooltipContent="Delete identity"
                dialogTitle="Delete identity"
                dialogDescription="Are you sure you want to delete this identity? This action is irreversible!"
                dialogButtonSubmit="Delete identity"
                dialogButtonSubmitProps={{ variant: 'destructive' }}
            >
                <Button className="mr-2" size="icon">
                    <Trash className="h-4"/>
                </Button>
            </ConfirmationDialogWrapper>

        </>
    );
}