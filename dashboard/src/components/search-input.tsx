'use client';

import { Input } from '@/components/ui/input';
import { useRouter, useSearchParams } from 'next/navigation';
import { HTMLInputTypeAttribute, useState } from 'react';

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

    const [searchInput, setSearchInput] = useState(value);

    const onSearchChange = (value: string) => {

        const newParams = new URLSearchParams(params.toString());

        if (value.length < 1) {
            newParams.delete(queryParamKey);
        } else {
            newParams.set(queryParamKey, value);
        }

        newParams.delete(pageParamKey);

        router.replace('?' + newParams.toString());
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            onSearchChange(searchInput);
        }
    };

    return (
        <Input
            value={searchInput}
            type={type ?? 'text'}
            placeholder={placeholder}
            className={className}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleKeyDown}/>
    );
}
