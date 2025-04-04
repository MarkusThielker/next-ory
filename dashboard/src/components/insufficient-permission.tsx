import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface InsufficientPermissionProps {
    permission: string;
    relation: string;
    identityId: string;
    classNames?: string;
}

export default async function InsufficientPermission(
    {
        permission,
        relation,
        identityId,
        classNames,
    }: InsufficientPermissionProps,
) {
    return (
        <Card className={classNames}>
            <CardHeader>
                <CardTitle>Insufficient Permission</CardTitle>
                <CardDescription>
                    You are missing the permission to see this content.<br/>
                    If you think this is an error, please contact your system administrator
                </CardDescription>
            </CardHeader>
            <CardFooter>
                <CardDescription className="text-xs">
                    Permission: {permission}<br/>
                    Relation: {relation}<br/>
                    Identity: {identityId}
                </CardDescription>
            </CardFooter>
        </Card>
    );
}
