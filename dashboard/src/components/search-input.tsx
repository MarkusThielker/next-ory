'use client';

import { Input } from '@/components/ui/input';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChangeEvent, HTMLInputTypeAttribute } from 'react';

interface SearchInputProps {
    placeholder: string;
    queryParamKey: string;
    type?: HTMLInputTypeAttribute;
    className?: string;
}

export function SearchInput({ placeholder, queryParamKey, type, className }: SearchInputProps) {

    const router = useRouter();
    const params = useSearchParams();

    const onSearchChange = (event: ChangeEvent<HTMLInputElement>) => {

        const value = event.target.value;
        const newParams = new URLSearchParams(params.toString());

        if (value.length < 1) {
            newParams.delete(queryParamKey);
        } else {
            newParams.set(queryParamKey, value);
        }

        router.replace('?' + newParams.toString());
    };

    return (
        <Input
            type={type ?? 'text'}
            placeholder={placeholder}
            className={className}
            onChange={onSearchChange}/>
    );
}
