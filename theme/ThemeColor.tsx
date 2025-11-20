import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = {
  primary: string;
  eliminate: string;
};

// "interfaz"
type ThemeContextType = {
  theme: Theme;
  setPrimaryColor: (color: string) => void;
  resetTheme: () => void;
};

const defaultTheme: Theme = {
  primary: "#901C9C",
  eliminate: "#da1616ff",
};

const ThemeContext = createContext<ThemeContextType>({
  theme: defaultTheme,
  setPrimaryColor: () => {},
  resetTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState(defaultTheme);

  useEffect(() => {
    const loadTheme = async () => {
        const saved = await AsyncStorage.getItem("theme")
        if(saved){
            // recupera los colores guardados
            setTheme(JSON.parse(saved))
        }else{
            // si no existe carga el default
            await AsyncStorage.setItem("theme", JSON.stringify(defaultTheme))
        }
    }
    loadTheme()
  }, [])

  const guardarTheme = async (newTheme: Theme) => {
    try {
        await AsyncStorage.setItem("theme", JSON.stringify(newTheme))
    } catch (error) {
        console.log("Error guardando color.")
    }
  }

  const setPrimaryColor = (color: string) => {
    console.log("Cambiando color a:", color);
    const nuevo = {...theme, primary: color}
    setTheme(nuevo);
    guardarTheme(nuevo) // guarda en AsyncStorage
  };

  const resetTheme = async () => {
    try {
        await AsyncStorage.setItem("theme", JSON.stringify(defaultTheme))
        setTheme(defaultTheme)
        guardarTheme(defaultTheme)
    } catch (error) {
        console.log("Error guardando color default.")
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setPrimaryColor, resetTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
