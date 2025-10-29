import { resetDatabase } from "@/db/database";
import { initDatabases } from "@/db/init_databases";
import Octicons from '@expo/vector-icons/Octicons';
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";

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

  const router = useRouter()

  const abrirOpciones = () => {
    const activado = false
    if(activado){
      router.push("/options")
    } else {
      alert("Función desactivada temporalmente. :(")
    }
  }

  /* 
  
  Por ahora se va comentado hasta que funcione
  
  <Stack
      screenOptions={{
        headerLeft: () => null ,
        headerRight: () => (
          <TouchableOpacity onPress={() => abrirOpciones()} style={{ marginRight: 15 }}>
            <Octicons name="gear" size={20} color="black" />
          </TouchableOpacity>
        ),
      }}
    >
  
  */

  return (
    
    <Stack
      screenOptions={{
        headerLeft: () => null ,
        headerRight: () => (
          <TouchableOpacity onPress={() => abrirOpciones()} style={{ marginRight: 15 }}>
            <Octicons name="gear" size={20} color="black" />
          </TouchableOpacity>
        ),
      }}
    >

      <Stack.Screen 
        name="index" 
        options={{ 
          title: "Home"
        }} 
      />

      <Stack.Screen 
        name="create" 
        options={{ 
          title: "Nueva Historia Clínica"
        }} 
      />
      
      <Stack.Screen 
        name="view" 
        options={{ 
          title: "Ver Historia Clínica"
        }} 
      />

      <Stack.Screen 
        name="options" 
        options={{ 
          title: "Opciones"
        }} 
      />
    </Stack>
    
    /*
    <Stack
      screenOptions={{
        headerLeft: () => null,
        headerRight: () => (
          <TouchableOpacity onPress={abrirOpciones} style={{ marginRight: 15 }}>
            <Octicons name="gear" size={20} color="black" />
          </TouchableOpacity>
        ),
      }}
    />
    */
  );
}
