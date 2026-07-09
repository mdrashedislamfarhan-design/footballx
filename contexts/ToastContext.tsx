'use client';
import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const remove = (id: string) => setToasts(prev => prev.filter(t => t.id !== id));

  const icons: Record<ToastType, ReactNode> = {
    success: <CheckCircle className="w-4 h-4 text-[#00E676]" />,
    error:   <AlertCircle  className="w-4 h-4 text-[#FF5252]" />,
    warning: <AlertCircle  className="w-4 h-4 text-[#FFC107]" />,
    info:    <Info         className="w-4 h-4 text-[#29B6F6]" />,
  };

  const borders: Record<ToastType, string> = {
    success: 'border-[#00E676]/30',
    error:   'border-[#FF5252]/30',
    warning: 'border-[#FFC107]/30',
    info:    'border-[#29B6F6]/30',
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-24 md:bottom-8 right-4 z-[100] flex flex-col gap-2 items-end">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 bg-[#181818]/90 backdrop-blur-xl border ${borders[toast.type]} rounded-2xl px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.4)] max-w-xs animate-in slide-in-from-right-4 duration-300`}
          >
            {icons[toast.type]}
            <span className="text-sm font-semibold text-white flex-grow">{toast.message}</span>
            <button onClick={() => remove(toast.id)} className="text-[#777777] hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
}
