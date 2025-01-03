'use client';

import { ButtonProps, buttonVariants } from '@/components/ui/button';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { ReactNode } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import type { VariantProps } from 'class-variance-authority';

interface ButtonWithConfirmDialogProps {
    buttonProps?: ButtonProps;
    onCancel?: () => any;
    onSubmit: () => any;
    tooltipContent?: string;
    dialogTitle: string;
    dialogDescription: string;
    dialogButtonCancel?: string;
    dialogButtonSubmit?: string;
    dialogButtonSubmitProps?: VariantProps<typeof buttonVariants>;
    children: ReactNode;
}

export function ConfirmationDialogWrapper(
    {
        onCancel,
        onSubmit,
        tooltipContent,
        dialogTitle,
        dialogDescription,
        dialogButtonCancel,
        dialogButtonSubmit,
        dialogButtonSubmitProps,
        children,
    }: ButtonWithConfirmDialogProps) {
    return (
        <Tooltip>
            <TooltipContent className={tooltipContent ? '' : 'hidden'}>
                {tooltipContent}
            </TooltipContent>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <TooltipTrigger asChild>
                        {children}
                    </TooltipTrigger>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{dialogTitle}</AlertDialogTitle>
                        <AlertDialogDescription>{dialogDescription}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={onCancel}>
                            {dialogButtonCancel ?? 'Cancel'}
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={onSubmit}
                            className={buttonVariants({ ...dialogButtonSubmitProps })}>
                            {dialogButtonSubmit ?? 'Confirm'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Tooltip>
    );
}