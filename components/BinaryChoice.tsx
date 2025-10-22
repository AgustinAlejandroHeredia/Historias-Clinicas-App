// BinaryChoice.tsx
import { Colors } from "@/theme/colors";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface BinaryChoiceProps {
  value: "si" | "no" | "";
  onChange: (val: "si" | "no") => void;
  label?: string;
}

export const BinaryChoice: React.FC<BinaryChoiceProps> = ({ value, onChange, label }) => {
  return (
    <View style={{ marginBottom: 10 }}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.container}>
        <TouchableOpacity
          style={[styles.button, value === "si" && styles.selected]}
          onPress={() => onChange("si")}
        >
          <Text style={[styles.buttonText, value === "si" && styles.selectedText]}>Sí</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, value === "no" && styles.selected]}
          onPress={() => onChange("no")}
        >
          <Text style={[styles.buttonText, value === "no" && styles.selectedText]}>No</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  container: {
    flexDirection: "row",
    gap: 10,
  },
  button: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  selected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  buttonText: {
    color: "#333",
    fontWeight: "bold",
  },
  selectedText: {
    color: "#fff",
  },
});
