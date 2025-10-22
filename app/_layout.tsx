import { resetDatabase } from "@/db/database";
import { initDatabases } from "@/db/init_databases";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function RootLayout() {
  const [dbReady, setDbReady] = useState(false);

  const debugging_tasks = {
    // habilitar las tareas de debugging con 1 / desactivar con 0
    resetDatabase : 0,
  }

  // se pasa el initDatabases() a _layout para que se ejecute solo la primera vez que se abre la app
  useEffect(() => {
    const initializeDB = async () => {
      try {

        if(debugging_tasks.resetDatabase == 1){
          await resetDatabase() // debug only
        }
        
        await initDatabases();
        console.log("_layout : Bases de datos inicializadas correctamente. ✅");
        setDbReady(true);
      } catch (error) {
        console.error("_layout : Error inicializando la base de datos ❌:", error);
      }
    };

    initializeDB();
  }, []);

  if (!dbReady) {
    // se va a mostrar el loader mientras _layout termina sus operaciones (entre ellas inicializar la DB)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Home", headerLeft: () => null }} />
      <Stack.Screen name="create" options={{ title: "Nueva Historia Clínica", headerLeft: () => null }} />
      <Stack.Screen name="view" options={{ title: "Ver Historia Clínica", headerLeft: () => null }} />
    </Stack>
  );
}
