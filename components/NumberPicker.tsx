import { Colors } from "@/theme/colors";
import React, { useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface NumberPickerProps {
  value: number | null;
  onChange: (num: number) => void;
  max?: number; // por defecto 15
}

export const NumberPicker: React.FC<NumberPickerProps> = ({ value, onChange, max = 15 }) => {
  const [open, setOpen] = useState(false);

  const numbers = Array.from({ length: max + 1 }, (_, i) => i);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.selector}
        onPress={() => setOpen(!open)}
      >
        <Text style={{ color: value !== null ? Colors.primary : "#333" }}>
          {value !== null ? value : "Seleccione un número"}
        </Text>
      </TouchableOpacity>

      {open && (
        <View style={styles.dropdown}>
          <FlatList
            data={numbers}
            keyExtractor={(item) => item.toString()}
            style={{ maxHeight: 200 }}
            nestedScrollEnabled // importante para scroll dentro de otro scroll
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.numberItem, item === value && { backgroundColor: Colors.primary }]}
                onPress={() => {
                  onChange(item);
                  setOpen(false);
                }}
              >
                <Text style={[styles.numberText, item === value && { color: "white" }]}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  selector: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fff",
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginTop: 5,
    maxHeight: 200,
    backgroundColor: "#fff",
  },
  numberItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  numberText: {
    textAlign: "center",
  },
});