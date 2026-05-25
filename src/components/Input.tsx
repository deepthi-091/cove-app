import React from 'react';
import {
  TextInput,
  View,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import { COLORS, SIZES } from '../constants';

interface InputProps extends TextInputProps {
  placeholder?: string;
  label?: string;
}

export const Input: React.FC<InputProps> = ({
  placeholder,
  label,
  ...props
}) => {
  return (
    <View style={styles.container}>
      <TextInput
        {...props}
        placeholder={placeholder}
        placeholderTextColor={COLORS.lightText}
        style={styles.input}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SIZES.lg,
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
});
