import { obtenerHistoriasClinicas } from "@/db/historia_clinica_service";
import { HistoriaClinicaListadoModel } from "@/models/historia_clinica_model";
import { Colors } from "@/theme/colors";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Index() {

  const router = useRouter()

  const [listadoHistorias, setListadoHistorias] = useState<HistoriaClinicaListadoModel[]>([])
  const [busqueda, setBusqueda] = useState('');
  const [isNavigating, setIsNavigating] = useState(false)





  useEffect(() => {
    const initialize = async () => {
      try {
        //await resetDatabase() // debug only
        //await initDatabases() // paso al _layout.tsx
        await cargarListado()
      }catch (error) {
        console.error("index : Error inicializando las tablas. ❌")
      }
    }
    initialize()
  }, []);

  const cargarListado = async (): Promise<void> => {
    try {

      const respuesta = await obtenerHistoriasClinicas();
      if(respuesta.success && respuesta.data){
        setListadoHistorias(respuesta.data)
        console.log("index : ✅ historias cargadas con exito.")
      }else{
        console.error("index : ❌ respuesta invalida al cargar listado.")
      }

    } catch (error) {
      console.error("index : ❌ Error al cargar listado de historias clinicas.")
    }
  }

  const seleccionDeHistoria = (id: number) => {
    router.push(`/view?id=${id}`)
  }

  const handleNueva = () => {
    if(isNavigating) return
    setIsNavigating(true)
    router.push("/create")
    setTimeout(() => setIsNavigating(false), 1000);
  };





  return (
    <View style={styles.container}>

      <View style={styles.row}>
        <TouchableOpacity disabled={isNavigating} style={styles.botonNueva} onPress={handleNueva}>
          <Text style={styles.botonText}>+ Nueva</Text>
        </TouchableOpacity>

        <TextInput
          style={styles.busqueda}
          placeholder="Buscar..."
          value={busqueda}
          onChangeText={setBusqueda}
        />
      </View>

      <FlatList
        data={listadoHistorias}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => seleccionDeHistoria(item.id)}>
            <View style={styles.cardHeader}>
              <Text style={styles.fecha}>{item.fecha_creacion}</Text>
              <Text style={styles.nombre}>{item.nombre}</Text>
            </View>
            <Text style={styles.descripcion}>{item.motivo_consulta}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay historias clínicas cargadas.</Text>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}





const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  emptyContainer: {
    marginTop: 50,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#777',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'center',
  },
  botonNueva: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginRight: 10,
  },
  botonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  busqueda: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 40,
    backgroundColor: 'white',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 2, // sombra en Android
    shadowColor: '#000', // sombra iOS
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  fecha: {
    fontWeight: 'bold',
  },
  nombre: {
    fontWeight: 'bold',
  },
  descripcion: {
    color: '#555',
  },
});

