import { StatusCard } from '@/components/status-card';
import { hydraMetadata, ketoMetadata, kratosMetadata } from '@/lib/action/metadata';
import { checkPermission, requirePermission, requireSession } from '@/lib/action/authentication';
import InsufficientPermission from '@/components/insufficient-permission';
import { permission, relation } from '@/lib/permission';

export default async function RootPage() {

    const session = await requireSession();
    const identityId = session.identity!.id;

    await requirePermission(permission.stack.dashboard, relation.access, identityId);

    const pmAccessStackStatus = await checkPermission(permission.stack.status, relation.access, identityId);

    const kratos = pmAccessStackStatus && await kratosMetadata();
    const hydra = pmAccessStackStatus && await hydraMetadata();
    const keto = pmAccessStackStatus && await ketoMetadata();

    return (
        <div className="flex flex-col space-y-4">
            <div>
                <p className="text-3xl font-bold leading-tight tracking-tight">Software Stack</p>
                <p className="text-lg font-light">See the list of all applications in your stack</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {
                    !pmAccessStackStatus && (
                        <InsufficientPermission
                            permission={permission.stack.status}
                            relation="access"
                            identityId={identityId}
                            classNames="col-span-1 md:col-span-4"
                        />
                    )
                }
                {
                    kratos && (
                        <StatusCard
                            title="Ory Kratos"
                            version={kratos.version}
                            name="Kratos"
                            status={kratos.status}
                            className="flex-1"/>
                    )
                }
                {
                    hydra && (
                        <StatusCard
                            title="Ory Hydra"
                            version={hydra.version}
                            name="Hydra"
                            status={hydra.status}
                            className="flex-1"/>
                    )
                }
                {
                    keto && (
                        <StatusCard
                            title="Ory Keto"
                            version={keto.version}
                            name="Keto"
                            status={keto.status}
                            className="flex-1"/>
                    )
                }
            </div>
        </div>
    );
}
