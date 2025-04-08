import { CreateClientForm } from '@/components/forms/client-form';
import { createClient } from '@/lib/action/client';
import { checkPermission, requireSession } from '@/lib/action/authentication';
import { permission, relation } from '@/lib/permission';
import { redirect } from 'next/navigation';

export default async function CreateClientPage() {

    const session = await requireSession();
    const identityId = session.identity!.id;

    const pmCreateClient = await checkPermission(permission.client.it, relation.create, identityId);
    if (!pmCreateClient) {
        return redirect('/client');
    }

    return (
        <div className="space-y-4">
            <div>
                <p className="text-3xl font-bold leading-tight tracking-tight">Create OAuth2 Client</p>
                <p className="text-lg font-light">
                    Configure your new OAuth2 Client.
                </p>
            </div>
            <CreateClientForm action={createClient}/>
        </div>
    );
}