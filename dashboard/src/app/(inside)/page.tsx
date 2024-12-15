import { getHydraMetadataApi, getKetoMetadataApi, getKratosMetadataApi } from '@/ory/sdk/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default async function RootPage() {

    const kratosMetadataApi = await getKratosMetadataApi();

    const kratosVersion = await kratosMetadataApi
        .getVersion()
        .then(res => res.data.version)
        .catch(() => '');

    const kratosStatusData = await fetch(process.env.ORY_KRATOS_ADMIN_URL + '/health/alive');
    const kratosStatus = await kratosStatusData.json() as { status: string };

    const kratosDBStatusData = await fetch(process.env.ORY_KRATOS_ADMIN_URL + '/health/ready');
    const kratosDBStatus = await kratosDBStatusData.json() as { status: string };


    const hydraMetadataApi = await getHydraMetadataApi();

    const hydraVersion = await hydraMetadataApi
        .getVersion()
        .then(res => res.data.version)
        .catch(() => '');

    const hydraStatusData = await fetch(process.env.ORY_KRATOS_ADMIN_URL + '/health/alive');
    const hydraStatus = await hydraStatusData.json() as { status: string };

    const hydraDBStatusData = await fetch(process.env.ORY_KRATOS_ADMIN_URL + '/health/ready');
    const hydraDBStatus = await hydraDBStatusData.json() as { status: string };


    const ketoMetadataApi = await getKetoMetadataApi();

    const ketoVersion = await ketoMetadataApi
        .getVersion()
        .then(res => res.data.version)
        .catch(() => '');

    const ketoStatusData = await fetch(process.env.ORY_KETO_ADMIN_URL + '/health/alive');
    const ketoStatus = await ketoStatusData.json() as { status: string };

    const ketoDBStatusData = await fetch(process.env.ORY_KETO_ADMIN_URL + '/health/ready');
    const ketoDBStatus = await ketoDBStatusData.json() as { status: string };

    return (
        <div className="flex flex-col space-y-4">
            <div>
                <p className="text-3xl font-bold leading-tight tracking-tight">Software Stack</p>
                <p className="text-lg font-light">See the list of all applications in your stack</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="flex-1">
                    <CardHeader>
                        <CardTitle>
                            Ory Kratos
                        </CardTitle>
                        <CardDescription>
                            Version {kratosVersion}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-x-1">
                        <Badge variant={kratosStatus.status === 'ok' ? 'success' : 'destructive'}>
                            Kratos {kratosStatus.status.toUpperCase()}
                        </Badge>
                        <Badge variant={kratosStatus.status === 'ok' ? 'success' : 'destructive'}>
                            Database {kratosDBStatus.status.toUpperCase()}
                        </Badge>
                    </CardContent>
                </Card>
                <Card className="flex-1">
                    <CardHeader>
                        <CardTitle>
                            Ory Hydra
                        </CardTitle>
                        <CardDescription>
                            Version {hydraVersion}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-x-1">
                        <Badge variant={kratosStatus.status === 'ok' ? 'success' : 'destructive'}>
                            Hydra {hydraStatus.status.toUpperCase()}
                        </Badge>
                        <Badge variant={kratosStatus.status === 'ok' ? 'success' : 'destructive'}>
                            Database {hydraDBStatus.status.toUpperCase()}
                        </Badge>
                    </CardContent>
                </Card>
                <Card className="flex-1">
                    <CardHeader>
                        <CardTitle>
                            Ory Keto
                        </CardTitle>
                        <CardDescription>
                            Version {ketoVersion}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-x-1">
                        <Badge variant={kratosStatus.status === 'ok' ? 'success' : 'destructive'}>
                            Keto {ketoStatus.status.toUpperCase()}
                        </Badge>
                        <Badge variant={kratosStatus.status === 'ok' ? 'success' : 'destructive'}>
                            Database {ketoDBStatus.status.toUpperCase()}
                        </Badge>
                    </CardContent>
                </Card>
                <div className="flex-1"></div>
            </div>
        </div>
    );
}
