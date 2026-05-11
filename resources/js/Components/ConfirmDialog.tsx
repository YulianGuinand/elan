import { Button } from "@/Components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { AlertCircle, InfoIcon } from "lucide-react";
import { ReactElement } from "react";

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "danger" | "warning" | "default";
    isLoading?: boolean;
    icon?: ReactElement;
}

export default function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirmation",
    message,
    confirmText = "Confirmer",
    cancelText = "Annuler",
    variant = "default",
    isLoading = false,
    icon,
}: ConfirmDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent showCloseButton={false}>
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        {variant === "danger" ? (
                            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                        ) : variant === "warning" ? (
                            <InfoIcon className="w-6 h-6 text-elan-orange flex-shrink-0 mt-0.5"/>
                        ) : (
                            icon
                        )}
                        <DialogTitle>{title}</DialogTitle>
                    </div>
                </DialogHeader>
                <div className="text-sm text-gray-600 py-4">{message}</div>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isLoading}
                        size={"lg"}
                    >
                        {cancelText}
                    </Button>
                    <Button
                        variant={
                            variant === "danger" ? "destructive" : "default"
                        }
                        onClick={onConfirm}
                        disabled={isLoading}
                        size={"lg"}
                    >
                        {isLoading ? "Chargement..." : confirmText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
