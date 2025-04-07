'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ConfirmationDialogWrapper } from '@/components/confirmation-dialog-wrapper';
import { deleteIdentityCredential } from '@/lib/action/identity';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import { DeleteIdentityCredentialsTypeEnum, Identity } from '@ory/client';
import { toast } from 'sonner';

interface IdentityCredentialsProps {
    identity: Identity;
}

export function IdentityCredentials({ identity }: IdentityCredentialsProps) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    Object.entries(identity.credentials!).map(([key, value]) => {
                        return (
                            <TableRow key={key}>
                                <TableCell>{key}</TableCell>
                                <TableCell>{value.identifiers![0]}</TableCell>
                                <TableCell>
                                    {
                                        Object.values(DeleteIdentityCredentialsTypeEnum).includes(key as DeleteIdentityCredentialsTypeEnum) &&
                                        key !== 'password' && key !== 'code' &&
                                        (
                                            <ConfirmationDialogWrapper
                                                onSubmit={async () => {
                                                    deleteIdentityCredential(identity.id, key as never)
                                                        .then(() => toast.success(`Credential ${key} deleted`))
                                                        .catch(() => toast.error(`Deleting credential ${key} failed`));
                                                }}
                                                dialogTitle="Delete credential"
                                                dialogDescription={`Are you sure you want to remove the credential of type ${key} from this identity?`}
                                                dialogButtonSubmit={`Delete ${key}`}
                                                dialogButtonSubmitProps={{ variant: 'destructive' }}>
                                                <Button size="icon" variant="outline">
                                                    <Trash className="h-4"/>
                                                </Button>
                                            </ConfirmationDialogWrapper>
                                        )
                                    }
                                </TableCell>
                            </TableRow>
                        );
                    })
                }
            </TableBody>
        </Table>
    );
}