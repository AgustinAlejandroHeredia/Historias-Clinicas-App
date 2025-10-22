import React from "react";
import { TextInputProps } from "react-native";
import { CustomInput } from "./CustomInput";

interface DateInputProps extends TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
}

export const DateInput: React.FC<DateInputProps> = ({ value, onChangeText, ...props }) => {

  const handleChange = (text: string) => {
    // Quitamos cualquier carácter que no sea número
    let cleaned = text.replace(/\D/g, "");

    let formatted = "";

    if (cleaned.length <= 2) {
      // Día
      formatted = cleaned;
    } else if (cleaned.length <= 4) {
      // Día y mes
      formatted = cleaned.slice(0,2) + "/" + cleaned.slice(2);
    } else {
      // Día, mes y año
      formatted = cleaned.slice(0,2) + "/" + cleaned.slice(2,4) + "/" + cleaned.slice(4,8);
    }

    // Limitamos a 10 caracteres
    if (formatted.length > 10) formatted = formatted.slice(0,10);

    onChangeText(formatted);
  };

  return (
    <CustomInput
      {...props}
      value={value}
      onChangeText={handleChange}
      keyboardType="numeric"
      placeholder="dd/mm/yyyy"
    />
  );
};
