'use client';

import { Input } from '@/components/ui/input';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChangeEvent, HTMLInputTypeAttribute } from 'react';

interface SearchInputProps {
    value: string;
    placeholder: string;
    pageParamKey: string;
    queryParamKey: string;
    type?: HTMLInputTypeAttribute;
    className?: string;
}

export function SearchInput({ value, placeholder, pageParamKey, queryParamKey, type, className }: SearchInputProps) {

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

        newParams.delete(pageParamKey);

        router.replace('?' + newParams.toString());
    };

    return (
        <Input
            value={value}
            type={type ?? 'text'}
            placeholder={placeholder}
            className={className}
            onChange={onSearchChange}/>
    );
}
