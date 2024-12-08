import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

interface DataTableFallbackProps {
    columnCount: number,
    rowCount: number,
}

export async function DataTableFallback({ columnCount, rowCount }: DataTableFallbackProps) {

    const columns: string[] = [];
    for (let i = 0; i < columnCount; i++) {
        columns.push('');
    }

    const rows: string[] = [];
    for (let i = 0; i < rowCount; i++) {
        rows.push('');
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    {
                        columns.map((_, index) => {
                            return (
                                <TableHead key={index}>
                                    <Skeleton className="w-20 h-6"/>
                                </TableHead>
                            );
                        })
                    }
                </TableHeader>
                <TableBody>
                    {
                        rows.map((_, index) =>
                            <TableRow key={index} className="h-4">
                                {
                                    columns.map((_, index) =>
                                        <TableCell key={index} className="h-4">
                                            <Skeleton className="w-full h-4"/>
                                        </TableCell>,
                                    )
                                }
                            </TableRow>,
                        )
                    }
                </TableBody>
            </Table>
        </div>
    );
}
