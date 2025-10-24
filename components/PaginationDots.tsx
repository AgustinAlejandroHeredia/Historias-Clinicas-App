import { Colors } from "@/theme/colors";
import React from "react";
import { View } from "react-native";

interface PaginationDotsProps {
  secciones: any[];        // array de secciones
  activeIndex: number;     // indice activo
  marginTop?: number;      // espacio superior
  marginBottom?: number;   // espacio inferior
}

const PaginationDots: React.FC<PaginationDotsProps> = ({
  secciones,
  activeIndex,
  marginTop = 27,
  marginBottom = 4,
}) => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        marginTop,
        marginBottom,
      }}
    >
      {secciones.map((_, index) => (
        <View
          key={`dot_${index}`}
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            marginHorizontal: 4,
            backgroundColor: index === activeIndex ? Colors.primary : "#ccc",
          }}
        />
      ))}
    </View>
  );
};

export default PaginationDots;
