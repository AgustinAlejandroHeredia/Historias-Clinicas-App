import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface InfoFieldProps {
  label?: string; // ahora opcional
  value: string | number | null | undefined;
  big?: boolean; // para textos largos como narración
}

const InfoField = ({ label, value, big = false }: InfoFieldProps) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <Text style={[styles.value, big && styles.bigValue]}>
        {value !== null && value !== undefined && value !== "" ? value : "-"}
      </Text>
    </View>
  );
};

export default InfoField;

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: "#000",
  },
  bigValue: {
    minHeight: 100,
    textAlignVertical: "top",
  },
});