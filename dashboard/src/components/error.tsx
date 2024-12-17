interface ErrorDisplayProps {
    title: string;
    message: string;
}

export function ErrorDisplay({ title, message }: ErrorDisplayProps) {
    return (
        <>
            <p className="text-3xl font-bold leading-tight tracking-tight">{title}</p>
            <p className="text-lg font-light">{message}</p>
        </>
    );
}