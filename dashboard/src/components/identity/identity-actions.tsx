'use client';

import { Identity } from '@ory/client';
import { Button, buttonVariants } from '@/components/ui/button';
import { Copy, Key, Link, Trash, UserCheck, UserMinus, UserX } from 'lucide-react';
import { ConfirmationDialogWrapper } from '@/components/confirmation-dialog-wrapper';
import {
    blockIdentity,
    createRecoveryCode,
    createRecoveryLink,
    deleteIdentity,
    deleteIdentitySessions,
    unblockIdentity,
} from '@/lib/action/identity';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface IdentityActionProps {
    identity: Identity,
    permissions: {
        pmDeleteUser: boolean;
        pmEditUserState: boolean;
        pmDeleteUserSession: boolean;
        pmCreateUserCode: boolean;
        pmCreateUserLink: boolean;
    }
}

export function IdentityActions({ identity, permissions }: IdentityActionProps,
) {

    console.log('IdentityActions', 'Permissions', permissions);

    const router = useRouter();

    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogLink, setDialogLink] = useState<string>('');
    const [dialogCode, setDialogCode] = useState<string | undefined>(undefined);

    return (
        <>
            <AlertDialog open={dialogVisible} onOpenChange={(value) => setDialogVisible(value)}>
                <AlertDialogContent className="space-y-1">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Recovery account</AlertDialogTitle>
                        <AlertDialogDescription>
                            You created a recovery flow. Provide the user with the following information so they can
                            access their account again.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div>
                        <Label>Link</Label>
                        <div className="flex relative">
                            <Input value={dialogLink} readOnly/>
                            <Button
                                className="absolute right-0"
                                variant="outline"
                                onClick={() => {
                                    toast.info('Link copied to clipboard');
                                    navigator.clipboard.writeText(dialogLink);
                                }}
                            >
                                <Copy/>
                            </Button>
                        </div>
                        <p className="mt-1 text-xs text-neutral-500">
                            {
                                dialogCode ?
                                    'The user will need this link to access the recovery flow.'
                                    :
                                    'This magic link will authenticate the user automatically'
                            }
                        </p>
                    </div>
                    {
                        dialogCode ?
                            <div>
                                <Label>Code</Label>
                                <div className="flex relative">
                                    <Input value={dialogCode} readOnly/>
                                    <Button
                                        className="absolute right-0"
                                        variant="outline"
                                        onClick={() => {
                                            toast.info('Code copied to clipboard');
                                            navigator.clipboard.writeText(dialogCode);
                                        }}
                                    >
                                        <Copy/>
                                    </Button>
                                </div>
                                <p className="mt-1 text-xs text-neutral-500">
                                    The user will need to enter this code on the recovery page.
                                </p>
                            </div>
                            :
                            <></>
                    }
                    <AlertDialogFooter>
                        <AlertDialogAction className={buttonVariants({ variant: 'destructive' })}>
                            Close
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <ConfirmationDialogWrapper
                onSubmit={async () => {
                    await createRecoveryCode(identity.id)
                        .then((response) => {
                            setDialogLink(response.recovery_link);
                            setDialogCode(response.recovery_code);
                            setDialogVisible(true);
                        })
                        .catch(() => toast.error('Creating recovery code failed'));
                }}
                tooltipContent="Create recovery code"
                dialogTitle="Create recovery code"
                dialogDescription="Are you sure you want to create a recovery code for this identity?"
                dialogButtonSubmit="Create code"
            >
                <Button
                    disabled={!permissions.pmCreateUserCode}
                    className="mr-2"
                    size="icon">
                    <Key className="h-4"/>
                </Button>
            </ConfirmationDialogWrapper>

            <ConfirmationDialogWrapper
                onSubmit={async () => {
                    await createRecoveryLink(identity.id)
                        .then((response) => {
                            setDialogLink(response.recovery_link);
                            setDialogCode(undefined);
                            setDialogVisible(true);
                        })
                        .catch(() => toast.error('Creating recovery link failed. It is likely magic-links are disabled on your Ory Kratos instance.'));
                }}
                tooltipContent="Create recovery link"
                dialogTitle="Create recovery link"
                dialogDescription="Are you sure you want to create a recovery link for this identity?"
                dialogButtonSubmit="Create link"
            >
                <Button
                    disabled={!permissions.pmCreateUserLink}
                    className="mr-2"
                    size="icon">
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
                        <Button
                            disabled={!permissions.pmEditUserState}
                            className="mr-2"
                            size="icon">
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
                        <Button
                            disabled={!permissions.pmEditUserState}
                            className="mr-2"
                            size="icon">
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
                <Button
                    disabled={!permissions.pmDeleteUserSession}
                    className="mr-2"
                    size="icon">
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
                <Button
                    disabled={!permissions.pmDeleteUser}
                    className="mr-2"
                    size="icon">
                    <Trash className="h-4"/>
                </Button>
            </ConfirmationDialogWrapper>
        </>
    );
}