import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertTriangle, X, CheckCircle, XCircle, Info } from 'lucide-react';

interface AdminAlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  buttonText?: string;
}

export default function AdminAlertDialog({
  isOpen,
  onClose,
  title,
  message,
  type = 'info',
  buttonText = 'OK'
}: AdminAlertDialogProps) {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-8 h-8 text-green-500" />;
      case 'error':
        return <XCircle className="w-8 h-8 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-8 h-8 text-yellow-500" />;
      default:
        return <Info className="w-8 h-8 text-blue-500" />;
    }
  };

  const getIconBg = () => {
    switch (type) {
      case 'success':
        return 'bg-green-100';
      case 'error':
        return 'bg-red-100';
      case 'warning':
        return 'bg-yellow-100';
      default:
        return 'bg-blue-100';
    }
  };

  const getTitleBarColor = () => {
    switch (type) {
      case 'error':
        return 'from-red-600 to-red-700';
      case 'success':
        return 'from-green-600 to-green-700';
      case 'warning':
        return 'from-yellow-600 to-yellow-700';
      default:
        return 'from-blue-600 to-blue-700';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white border-2 border-gray-300 shadow-2xl">
        {/* Windows-style title bar */}
        <div className={`flex items-center justify-between px-4 py-2 bg-gradient-to-r ${getTitleBarColor()} text-white text-sm font-medium -m-6 mb-4`}>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-white/20 rounded-full"></div>
            <span>System Administrator</span>
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

        <DialogFooter className="flex justify-center pt-4 border-t border-gray-200">
          <Button
            onClick={onClose}
            className={`px-8 py-2 text-sm text-white ${
              type === 'error' 
                ? 'bg-red-600 hover:bg-red-700' 
                : type === 'success'
                ? 'bg-green-600 hover:bg-green-700'
                : type === 'warning'
                ? 'bg-yellow-600 hover:bg-yellow-700'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {buttonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
