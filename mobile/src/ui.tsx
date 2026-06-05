import { type ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';

export const colors = {
  bg: '#ffffff',
  text: '#111111',
  muted: '#777777',
  border: '#e0e0e0',
  primary: '#000000',
  primaryText: '#ffffff',
  disabled: '#cccccc',
  danger: '#b00020',
  card: '#fafafa',
};

export function Button({
  title,
  onPress,
  disabled,
  variant = 'primary',
}: {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'outline';
}) {
  const isOutline = variant === 'outline';
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        isOutline && styles.buttonOutline,
        disabled && styles.buttonDisabled,
        pressed && !disabled && styles.buttonPressed,
      ]}
    >
      <Text style={[styles.buttonText, isOutline && styles.buttonTextOutline]}>{title}</Text>
    </Pressable>
  );
}

export function TextField({ label, ...props }: { label: string } & TextInputProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput placeholderTextColor={colors.muted} style={styles.input} {...props} />
    </View>
  );
}

export function Card({ children, style }: { children: ReactNode; style?: ViewStyle }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Loading() {
  return (
    <View style={styles.center}>
      <ActivityIndicator color={colors.primary} />
    </View>
  );
}

export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 20 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg },
  title: { fontSize: 26, fontWeight: '700', color: colors.text },
  subtitle: { fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 12 },
  muted: { color: colors.muted },
  field: { marginBottom: 14 },
  label: { fontSize: 13, color: colors.muted, marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.bg,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonOutline: { backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.primary },
  buttonDisabled: { backgroundColor: colors.disabled },
  buttonPressed: { opacity: 0.7 },
  buttonText: { color: colors.primaryText, fontWeight: '600', fontSize: 16 },
  buttonTextOutline: { color: colors.primary },
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 16,
    backgroundColor: colors.card,
    marginBottom: 12,
  },
  errorText: { color: colors.danger, marginBottom: 10 },
});
