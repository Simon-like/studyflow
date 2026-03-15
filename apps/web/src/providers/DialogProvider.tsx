import { createContext, useContext, useCallback, useState, type ReactNode } from 'react';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';

// ==================== Types ====================

type DialogVariant = 'warning' | 'success' | 'info' | 'danger';

interface DialogConfig {
  variant?: DialogVariant;
  title: string;
  message: string | ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
}

interface DialogState extends DialogConfig {
  id: string;
}

interface DialogContextValue {
  confirm: (config: DialogConfig) => void;
  close: () => void;
}

// ==================== Context ====================

const DialogContext = createContext<DialogContextValue | null>(null);

export function useDialog() {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error('useDialog must be used within DialogProvider');
  return ctx;
}

// ==================== Variant Config ====================

const VARIANT_CONFIG: Record<DialogVariant, { icon: typeof AlertCircle; iconColor: string; bgColor: string; btnColor: string; btnHover: string }> = {
  warning: { icon: AlertCircle, iconColor: 'text-amber-500', bgColor: 'bg-amber-50', btnColor: 'bg-coral hover:bg-coral-700', btnHover: '' },
  success: { icon: CheckCircle, iconColor: 'text-sage', bgColor: 'bg-sage/10', btnColor: 'bg-sage hover:bg-sage/90', btnHover: '' },
  info: { icon: Info, iconColor: 'text-blue-500', bgColor: 'bg-blue-50', btnColor: 'bg-coral hover:bg-coral-700', btnHover: '' },
  danger: { icon: XCircle, iconColor: 'text-red-500', bgColor: 'bg-red-50', btnColor: 'bg-red-500 hover:bg-red-600', btnHover: '' },
};

// ==================== Provider ====================

export function DialogProvider({ children }: { children: ReactNode }) {
  const [dialog, setDialog] = useState<DialogState | null>(null);

  const confirm = useCallback((config: DialogConfig) => {
    setDialog({ ...config, id: Date.now().toString() });
  }, []);

  const close = useCallback(() => {
    setDialog(null);
  }, []);

  const handleConfirm = useCallback(async () => {
    if (dialog?.onConfirm) {
      await dialog.onConfirm();
    }
    setDialog(null);
  }, [dialog]);

  const handleCancel = useCallback(() => {
    dialog?.onCancel?.();
    setDialog(null);
  }, [dialog]);

  const variant = dialog?.variant || 'warning';
  const config = VARIANT_CONFIG[variant];
  const Icon = config.icon;

  return (
    <DialogContext.Provider value={{ confirm, close }}>
      {children}

      {dialog && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="text-center">
              <div className={`w-14 h-14 ${config.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <Icon className={`w-7 h-7 ${config.iconColor}`} />
              </div>
              <h3 className="text-lg font-semibold text-charcoal mb-2">{dialog.title}</h3>
              <div className="text-sm text-stone mb-6 leading-relaxed">
                {typeof dialog.message === 'string' ? <p>{dialog.message}</p> : dialog.message}
              </div>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={handleCancel}
                  className="px-5 py-2.5 text-sm font-medium text-stone bg-warm hover:bg-warm/80 rounded-xl transition-colors"
                >
                  {dialog.cancelText || '取消'}
                </button>
                <button
                  onClick={handleConfirm}
                  className={`px-5 py-2.5 text-sm font-medium text-white ${config.btnColor} rounded-xl transition-colors`}
                >
                  {dialog.confirmText || '确认'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DialogContext.Provider>
  );
}
