'use client';

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { usePathname, useSearchParams } from 'next/navigation';

interface IdentityPaginationProps {
    page: number;
    pageCount: number;
    pageParamKey: string;
    paginationRange: number;
}

export function IdentityPagination(
    {
        page,
        pageCount,
        pageParamKey,
        paginationRange,
    }: IdentityPaginationProps,
) {

    const pathname = usePathname();
    const searchParams = useSearchParams();

    function updatePage(page: number): string {
        const newParams = new URLSearchParams(searchParams.toString());

        if (page <= 1) {
            newParams.delete(pageParamKey);
        } else {
            newParams.set(pageParamKey, page.toString());
        }

        return pathname + '?' + newParams.toString();
    }

    return (
        <Pagination>
            <PaginationContent>
                {
                    page > 1 && (
                        <PaginationItem key={'previous'}>
                            <PaginationPrevious

                                href={updatePage(page - 1)}/>
                        </PaginationItem>
                    )
                }
                {
                    page - (paginationRange / 2) > 1 &&
                    <PaginationItem key={'ellipsis-previous'}>
                        <PaginationEllipsis/>
                    </PaginationItem>
                }
                {
                    Array.from({ length: paginationRange }, (_, i) => {

                        const difference = (i + 1) - Math.round(paginationRange / 2);
                        const nextPage = page + difference;

                        if (nextPage < 1 || nextPage > pageCount) {
                            return;
                        }

                        return (
                            <PaginationItem key={nextPage}>
                                <PaginationLink
                                    href={updatePage(nextPage)}
                                    isActive={page === nextPage}
                                >
                                    {nextPage}
                                </PaginationLink>
                            </PaginationItem>
                        );
                    })
                }
                {
                    page + (paginationRange / 2) < pageCount &&
                    <PaginationItem key={'ellipsis-next'}>
                        <PaginationEllipsis/>
                    </PaginationItem>
                }
                {
                    page < pageCount && (
                        <PaginationItem key={'next'}>
                            <PaginationNext href={updatePage(page + 1)}/>
                        </PaginationItem>
                    )
                }
            </PaginationContent>
        </Pagination>
    );
}