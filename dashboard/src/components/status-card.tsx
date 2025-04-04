import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export type MetadataApiReady = {
    status?: 'ok',
    errors?: string[]
}

interface StatusCardProps {
    title: string;
    version?: string;
    name: string;
    status: MetadataApiReady;
    className?: string;
}

export function StatusCard({ title, version, name, status, className }: StatusCardProps) {

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle>
                    {title}
                </CardTitle>
                <CardDescription>
                    {
                        version ?
                            <span>Version {version}</span>
                            :
                            <span>OFFLINE</span>
                    }
                </CardDescription>
            </CardHeader>
            <CardFooter className="space-x-1">
                {
                    status.status && (
                        <Badge variant="success">
                            {name} {status.status.toUpperCase()}
                        </Badge>
                    )
                }
                {
                    status.errors && (
                        <Tooltip>
                            <TooltipTrigger>
                                <Badge variant="destructive">
                                    {name} Error
                                </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                                {
                                    status.errors.map((error) => <span key={error}>{error}</span>)
                                }
                            </TooltipContent>
                        </Tooltip>
                    )
                }
            </CardFooter>
        </Card>
    );
}
