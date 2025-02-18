import { CreateClientForm } from '@/components/forms/client-form';
import { createClient } from '@/lib/action/client';

export default async function CreateClientPage() {
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