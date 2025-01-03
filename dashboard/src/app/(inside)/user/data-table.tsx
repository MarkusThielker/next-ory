'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Identity } from '@ory/client';
import { DataTable } from '@/components/ui/data-table';
import { CircleCheck, CircleX, Copy, MoreHorizontal, Trash, UserCheck, UserMinus, UserPen, UserX } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { FetchIdentityPageProps } from '@/app/(inside)/user/page';
import { Spinner } from '@/components/ui/spinner';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button, buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import { toast } from 'sonner';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { blockIdentity, deleteIdentity, deleteIdentitySessions, unblockIdentity } from '@/lib/action/identity';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface IdentityDataTableProps {
    data: Identity[];
    pageSize: number;
    pageToken: string | undefined;
    query: string;
    fetchIdentityPage: (props: FetchIdentityPageProps) => Promise<{ data: Identity[], tokens: Map<string, string> }>;
}

export function IdentityDataTable({ data, pageSize, pageToken, query, fetchIdentityPage }: IdentityDataTableProps) {

    const columns: ColumnDef<Identity>[] = [
        {
            id: 'id',
            accessorKey: 'id',
            header: 'ID',
        },
        {
            id: 'active',
            header: 'Active',
            cell: ({ row }) => {

                const identity = row.original;

                if (identity.state === 'active') {
                    return <CircleCheck/>;
                } else {
                    return <CircleX/>;
                }
            },
        },
        {
            id: 'name',
            accessorKey: 'traits.name',
            header: 'Name',
        },
        {
            id: 'email',
            header: 'Email',
            cell: ({ row }) => {

                const identity = row.original;
                const email = identity.verifiable_addresses ?
                    identity.verifiable_addresses[0] : undefined;

                if (!email) {
                    return <p>Something went wrong</p>;
                } else {
                    return (
                        <div className="flex flex-row space-x-2 items-center">
                            <span>{email.value}</span>
                            {
                                email.verified ?
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <CircleCheck/>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <span>This email was confirmed at </span>
                                            {new Date(email.verified_at!!).toLocaleString()}
                                        </TooltipContent>
                                    </Tooltip>
                                    :
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <CircleX/>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            This email is not confirmed yet
                                        </TooltipContent>
                                    </Tooltip>
                            }
                        </div>
                    );
                }
            },
        },
        {
            id: 'actions',
            cell: ({ row }) => {
                const identity = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4"/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                                className="flex items-center space-x-2"
                                onClick={() => {
                                    navigator.clipboard.writeText(identity.id);
                                    toast.success('Copied to clipboard');
                                }}
                            >
                                <Copy className="h-4 w-4"/>
                                <span>Copy identity ID</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator/>
                            <Link href={`/user/${identity.id}`}>
                                <DropdownMenuItem className="flex items-center space-x-2">
                                    <UserPen className="h-4 w-4"/>
                                    <span>View identity</span>
                                </DropdownMenuItem>
                            </Link>
                            <DropdownMenuSeparator/>
                            <DropdownMenuItem
                                onClick={() => {
                                    setCurrentIdentity(identity);
                                    setIdentitySessionVisible(true);
                                }}
                                className="flex items-center space-x-2 text-red-500">
                                <UserMinus className="h-4 w-4"/>
                                <span>Delete sessions</span>
                            </DropdownMenuItem>
                            {
                                identity.state === 'active' &&
                                <DropdownMenuItem
                                    onClick={() => {
                                        setCurrentIdentity(identity);
                                        setBlockIdentityVisible(true);
                                    }}
                                    className="flex items-center space-x-2 text-red-500">
                                    <UserX className="h-4 w-4"/>
                                    <span>Block identity</span>
                                </DropdownMenuItem>
                            }
                            {
                                identity.state === 'inactive' &&
                                <DropdownMenuItem
                                    onClick={() => {
                                        setCurrentIdentity(identity);
                                        setUnblockIdentityVisible(true);
                                    }}
                                    className="flex items-center space-x-2 text-red-500">
                                    <UserCheck className="h-4 w-4"/>
                                    <span>Unblock identity</span>
                                </DropdownMenuItem>
                            }
                            <DropdownMenuItem
                                onClick={() => {
                                    setCurrentIdentity(identity);
                                    setDeleteIdentityVisible(true);
                                }}
                                className="flex items-center space-x-2 text-red-500">
                                <Trash className="h-4 w-4"/>
                                <span>Delete identity</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    const [items, setItems] = useState<Identity[]>(data);
    const [nextToken, setNextToken] = useState<string | undefined>(pageToken);

    // react on changes from ssr (query params)
    useEffect(() => {
        setItems(data);
        setNextToken(pageToken);
    }, [data, pageSize, pageToken, query]);

    // infinite scroll handling
    const infiniteScrollSensor = useRef(null);
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    fetchMore();
                }
            },
            { threshold: 0.5 }, // Adjust threshold as needed
        );

        if (infiniteScrollSensor.current) {
            observer.observe(infiniteScrollSensor.current);
        }

        return () => {
            if (infiniteScrollSensor.current) {
                observer.unobserve(infiniteScrollSensor.current);
            }
        };
    }, [items]);

    const fetchMore = async () => {
        if (!nextToken) return;

        const response = await fetchIdentityPage({
            pageSize: pageSize,
            pageToken: nextToken,
            query: query,
        });

        setItems([...items, ...response.data]);
        setNextToken(response.tokens.get('next') ?? undefined);
    };

    // quick actions
    const [currentIdentity, setCurrentIdentity] = useState<Identity | undefined>(undefined);
    const [identitySessionVisible, setIdentitySessionVisible] = useState(false);
    const [blockIdentityVisible, setBlockIdentityVisible] = useState(false);
    const [unblockIdentityVisible, setUnblockIdentityVisible] = useState(false);
    const [deleteIdentityVisible, setDeleteIdentityVisible] = useState(false);

    return (
        <>
            <DataTable columns={columns} data={items}/>
            {
                currentIdentity && (
                    <>
                        {/* delete sessions dialog */}
                        <AlertDialog
                            open={identitySessionVisible}
                            onOpenChange={(open) => setIdentitySessionVisible(open)}>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Delete sessions</AlertDialogTitle>
                                    <AlertDialogDescription className="grid grid-cols-1 gap-3">
                                        <span>Are you sure you want to delete this identity's sessions?</span>
                                        <span>{JSON.stringify(currentIdentity.traits, null, 4)}</span>
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        className={buttonVariants({ variant: 'destructive' })}
                                        onClick={() => deleteIdentitySessions(currentIdentity.id)}>
                                        Invalidate sessions
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                        {/* block identity dialog */}
                        <AlertDialog open={blockIdentityVisible} onOpenChange={(open) => setBlockIdentityVisible(open)}>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Block identity</AlertDialogTitle>
                                    <AlertDialogDescription className="grid grid-cols-1 gap-3">
                                        <span>Are you sure you want to block this identity?</span>
                                        <span>{JSON.stringify(currentIdentity.traits, null, 4)}</span>
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() => blockIdentity(currentIdentity.id)}>
                                        Block identity
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                        {/* unblock identity dialog */}
                        <AlertDialog open={unblockIdentityVisible} onOpenChange={(open) => setUnblockIdentityVisible(open)}>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Unblock identity</AlertDialogTitle>
                                    <AlertDialogDescription className="grid grid-cols-1 gap-3">
                                        <span>Are you sure you want to unblock this identity?</span>
                                        <span>{JSON.stringify(currentIdentity.traits, null, 4)}</span>
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() => unblockIdentity(currentIdentity.id)}>
                                        Unblock identity
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                        {/* delete identity dialog */}
                        <AlertDialog open={deleteIdentityVisible} onOpenChange={(open) => setDeleteIdentityVisible(open)}>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Delete identity</AlertDialogTitle>
                                    <AlertDialogDescription className="grid grid-cols-1 gap-3">
                                        <span>Are you sure you want to delete this identity?</span>
                                        <strong className="text-yellow-500">This action can not be undone!</strong>
                                        <span>{JSON.stringify(currentIdentity.traits, null, 4)}</span>
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        className={buttonVariants({ variant: 'destructive' })}
                                        onClick={() => deleteIdentity(currentIdentity.id)}>
                                        Delete identity
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </>
                )
            }
            {
                nextToken && (
                    <div className="flex w-full justify-center">
                        <Spinner ref={infiniteScrollSensor} className="h-10"/>
                    </div>
                )
            }
        </>
    );
}
