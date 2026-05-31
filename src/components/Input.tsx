import React, { useState } from 'react';
import { TextInput, View, Text, StyleSheet, type TextInputProps } from 'react-native';
import { COLORS, SIZES } from '../constants';

interface InputProps extends TextInputProps {
  placeholder?: string;
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ placeholder, label, error, style, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        {...props}
        placeholder={placeholder}
        placeholderTextColor={COLORS.lightText}
        style={[
          styles.input,
          isFocused && styles.inputFocused,
          !!error && styles.inputError,
          style,
        ]}
        onFocus={(e) => {
          setIsFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          props.onBlur?.(e);
        }}
      />
      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SIZES.lg,
  },
  label: {
    fontSize: SIZES.fontSize.sm,
    fontWeight: '600',
    color: COLORS.darkGray,
    marginBottom: SIZES.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.borderRadius.md,
    paddingVertical: SIZES.md,
    paddingHorizontal: SIZES.lg,
    fontSize: SIZES.fontSize.base,
    color: COLORS.text,
    backgroundColor: COLORS.white,
  },
  inputFocused: {
    borderColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  inputError: {
    borderColor: '#e53e3e',
  },
  errorText: {
    fontSize: SIZES.fontSize.xs,
    color: '#e53e3e',
    marginTop: SIZES.xs,
  },
});
