import { UiText } from '@ory/client';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { JSX } from 'react';
import { AlertCircle, AlertOctagon, Check } from 'lucide-react';

interface MessageProps {
    message: UiText,
}

export const Message = ({ message }: MessageProps) => {

    let icon: JSX.Element = <></>;
    switch (message.type) {
        case 'error':
            icon = <AlertOctagon className="h-4 w-4"/>;
            break;
        case 'success':
            icon = <Check className="h-4 w-4"/>;
            break;
        case 'info':
            icon = <AlertCircle className="h-4 w-4"/>;
            break;
    }

    return (
        <Alert>
            {icon}
            <AlertTitle>{message.type.charAt(0).toUpperCase() + message.type.substring(1)}</AlertTitle>
            <AlertDescription>
                {message.text}
            </AlertDescription>
        </Alert>
    );
};

interface MessagesProps {
    messages?: Array<UiText>
    classNames?: string,
}

export const Messages = ({ messages, classNames }: MessagesProps) => {
    if (!messages) {
        // No messages? Do nothing.
        return null;
    }

    return (
        <div className={classNames}>
            {messages.map((message) => (
                <Message key={message.id} message={message}/>
            ))}
        </div>
    );
};
