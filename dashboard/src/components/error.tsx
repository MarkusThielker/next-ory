interface ErrorDisplayProps {
    title: string;
    message: string;
}

export async function ErrorDisplay({ title, message }: ErrorDisplayProps) {
    return (
        <div className="space-y-4">
            <p className="text-3xl font-bold leading-tight tracking-tight">{title}</p>
            <p className="text-lg font-light">{message}</p>
        </div>
    );
}