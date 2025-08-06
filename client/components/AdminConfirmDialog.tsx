import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertTriangle, X, Shield } from 'lucide-react';

interface AdminConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  type?: 'warning' | 'danger' | 'info';
  confirmText?: string;
  cancelText?: string;
}

export default function AdminConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = 'warning',
  confirmText = 'Yes',
  cancelText = 'Cancel'
}: AdminConfirmDialogProps) {
  const getIcon = () => {
    switch (type) {
      case 'danger':
        return <X className="w-8 h-8 text-red-500" />;
      case 'info':
        return <Shield className="w-8 h-8 text-blue-500" />;
      default:
        return <AlertTriangle className="w-8 h-8 text-yellow-500" />;
    }
  };

  const getIconBg = () => {
    switch (type) {
      case 'danger':
        return 'bg-red-100';
      case 'info':
        return 'bg-blue-100';
      default:
        return 'bg-yellow-100';
    }
  };

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white border-2 border-gray-300 shadow-2xl">
        {/* Windows-style title bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium -m-6 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-white/20 rounded-full"></div>
            <span>Administrator</span>
          </div>
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center hover:bg-white/20 rounded-sm transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <DialogHeader className="space-y-4">
          <div className="flex items-start gap-4">
            <div className={`p-2 rounded-full ${getIconBg()}`}>
              {getIcon()}
            </div>
            <div className="flex-1 space-y-2">
              <DialogTitle className="text-base font-semibold text-gray-900 text-left">
                {title}
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-700 text-left leading-relaxed">
                {message}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <DialogFooter className="flex justify-end gap-2 pt-4 border-t border-gray-200">
          <Button
            onClick={onClose}
            variant="outline"
            className="px-6 py-2 text-sm border-gray-300 hover:bg-gray-50"
          >
            {cancelText}
          </Button>
          <Button
            onClick={handleConfirm}
            className={`px-6 py-2 text-sm text-white ${
              type === 'danger' 
                ? 'bg-red-600 hover:bg-red-700' 
                : type === 'info'
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-yellow-600 hover:bg-yellow-700'
            }`}
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
