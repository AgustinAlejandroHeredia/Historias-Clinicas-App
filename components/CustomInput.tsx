import { Colors } from "@/theme/colors";
import React, { useState } from "react";
import { StyleSheet, TextInput, TextInputProps } from "react-native";

interface CustomInputProps extends TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  small?: boolean;
  mid?: boolean;
  big?: boolean;
}

export const CustomInput: React.FC<CustomInputProps> = ({
  value,
  onChangeText,
  style,
  small,
  mid,
  big,
  ...props
}) => {
  const [focused, setFocused] = useState(false);

  const getSizeConfig = () => {
    if (big) return { lines: 4, minHeight: 100 };
    if (mid) return { lines: 3, minHeight: 80 };
    if (small) return { lines: 2, minHeight: 60 };
    return { lines: 1, minHeight: undefined };
  };

  const { lines, minHeight } = getSizeConfig();

  return (
    <TextInput
      {...props}
      style={[
        styles.input,
        minHeight ? { minHeight } : null,
        focused && styles.inputFocused,
        style,
      ]}
      value={value}
      onChangeText={onChangeText}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      multiline={!!(small || mid || big)}
      numberOfLines={lines}
      textAlignVertical={small || mid || big ? "top" : "center"}
      placeholderTextColor='#666'
    />
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  inputFocused: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },
});