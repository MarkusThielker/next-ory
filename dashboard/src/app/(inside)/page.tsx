import { getHydraMetadataApi, getKetoMetadataApi, getKratosMetadataApi } from '@/ory/sdk/server';
import { MetadataApiReady, StatusCard } from '@/components/status-card';

export default async function RootPage() {

    const kratosMetadataApi = await getKratosMetadataApi();
    const kratosVersion = await kratosMetadataApi.getVersion()
        .then(res => res.data.version)
        .catch(() => undefined);
    const kratosStatus = await fetch(process.env.ORY_KRATOS_ADMIN_URL + '/health/ready')
        .then((response) => response.json() as MetadataApiReady)
        .catch(() => {
            return { errors: ['No instance running'] } as MetadataApiReady;
        });


    const hydraMetadataApi = await getHydraMetadataApi();
    const hydraVersion = await hydraMetadataApi.getVersion()
        .then(res => res.data.version)
        .catch(() => undefined);
    const hydraStatus = await fetch(process.env.ORY_HYDRA_ADMIN_URL + '/health/ready')
        .then((response) => response.json() as MetadataApiReady)
        .catch(() => {
            return { errors: ['No instance running'] } as MetadataApiReady;
        });


    const ketoMetadataApi = await getKetoMetadataApi();
    const ketoVersion = await ketoMetadataApi.getVersion()
        .then(res => res.data.version)
        .catch(() => undefined);
    const ketoStatus = await fetch(process.env.ORY_KETO_ADMIN_URL + '/health/ready')
        .then((response) => response.json() as MetadataApiReady)
        .catch(() => {
            return { errors: ['No instance running'] } as MetadataApiReady;
        });


    return (
        <div className="flex flex-col space-y-4">
            <div>
                <p className="text-3xl font-bold leading-tight tracking-tight">Software Stack</p>
                <p className="text-lg font-light">See the list of all applications in your stack</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatusCard
                    title="Ory Kratos"
                    version={kratosVersion}
                    name="Kratos"
                    status={kratosStatus}
                    className="flex-1"/>
                <StatusCard
                    title="Ory Hydra"
                    version={hydraVersion}
                    name="Hydra"
                    status={hydraStatus}
                    className="flex-1"/>
                <StatusCard
                    title="Ory Keto"
                    version={ketoVersion}
                    name="Keto"
                    status={ketoStatus}
                    className="flex-1"/>
                <div className="flex-1"/>
            </div>
        </div>
    );
}
