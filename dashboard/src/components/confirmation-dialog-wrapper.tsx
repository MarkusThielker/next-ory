'use client';

import { Button, ButtonProps } from '@/components/ui/button';
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

interface ButtonWithConfirmDialogProps {
    buttonProps?: ButtonProps,
    onCancel?: () => any
    onSubmit: () => any
    tooltipContent?: string
    dialogTitle: string
    dialogDescription: string
    dialogButtonCancel?: string
    dialogButtonCancelProps?: ButtonProps
    dialogButtonSubmit?: string
    dialogButtonSubmitProps?: ButtonProps
    children: ReactNode
}

export function ConfirmationDialogWrapper(
    {
        onCancel,
        onSubmit,
        tooltipContent,
        dialogTitle,
        dialogDescription,
        dialogButtonCancel,
        dialogButtonCancelProps,
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
                        <AlertDialogCancel asChild>
                            <Button
                                onClick={onCancel}
                                {...dialogButtonCancelProps}>
                                {dialogButtonCancel ?? 'Cancel'}
                            </Button>
                        </AlertDialogCancel>
                        <AlertDialogAction asChild>
                            <Button
                                onClick={onSubmit}
                                {...dialogButtonSubmitProps}>
                                {dialogButtonSubmit ?? 'Confirm'}
                            </Button>
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Tooltip>
    );
}