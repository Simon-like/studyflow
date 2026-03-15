import React, { createContext, useContext, useCallback, useState, type ReactNode } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal as RNModal,
  TouchableWithoutFeedback,
} from 'react-native';
import { colors, radius, spacing, shadows, fontWeight } from '../theme';

// ==================== Types ====================

type DialogVariant = 'warning' | 'success' | 'info' | 'danger';

interface DialogConfig {
  variant?: DialogVariant;
  title: string;
  message: string;
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

const VARIANT_ICONS: Record<DialogVariant, string> = {
  warning: '⚠️',
  success: '✓',
  info: 'ℹ',
  danger: '✕',
};

const VARIANT_COLORS: Record<DialogVariant, { icon: string; iconBg: string; btn: string }> = {
  warning: { icon: colors.warning, iconBg: colors.warning + '15', btn: colors.primary },
  success: { icon: colors.success, iconBg: colors.success + '15', btn: colors.success },
  info: { icon: '#3B82F6', iconBg: '#3B82F615', btn: colors.primary },
  danger: { icon: colors.error, iconBg: colors.error + '15', btn: colors.error },
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
  const variantColor = VARIANT_COLORS[variant];

  return (
    <DialogContext.Provider value={{ confirm, close }}>
      {children}

      <RNModal
        visible={!!dialog}
        transparent
        animationType="fade"
        onRequestClose={handleCancel}
      >
        <TouchableWithoutFeedback onPress={handleCancel}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <View style={styles.content}>
                <View style={[styles.iconCircle, { backgroundColor: variantColor.iconBg }]}>
                  <Text style={[styles.iconText, { color: variantColor.icon }]}>
                    {VARIANT_ICONS[variant]}
                  </Text>
                </View>
                <Text style={styles.title}>{dialog?.title}</Text>
                <Text style={styles.message}>{dialog?.message}</Text>
                <View style={styles.buttons}>
                  <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                    <Text style={styles.cancelButtonText}>
                      {dialog?.cancelText || '取消'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.confirmButton, { backgroundColor: variantColor.btn }]}
                    onPress={handleConfirm}
                  >
                    <Text style={styles.confirmButtonText}>
                      {dialog?.confirmText || '确认'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </RNModal>
    </DialogContext.Provider>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  content: {
    backgroundColor: colors.white,
    borderRadius: radius['2xl'],
    padding: spacing.xl,
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
    ...shadows.lg,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  iconText: {
    fontSize: 24,
    fontWeight: fontWeight.bold,
  },
  title: {
    fontSize: 17,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 20,
  },
  buttons: {
    flexDirection: 'row',
    gap: spacing.md,
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    alignItems: 'center',
    backgroundColor: colors.warm,
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: fontWeight.medium,
    color: colors.textSecondary,
  },
  confirmButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 15,
    fontWeight: fontWeight.semibold,
    color: colors.white,
  },
});
