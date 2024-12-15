import { ErrorDisplay } from '@/components/error';

export default async function UnauthorizedPage() {
    return (
        <div className="bg-background min-h-screen p-16">
            <ErrorDisplay
                title="Unauthorised"
                message="You are unauthorised to access this application!"/>
        </div>
    );
}
