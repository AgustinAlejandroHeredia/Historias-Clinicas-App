import BuscadorHistorias from "@/components/BuscadorHistorias";
import { eliminarHistoriaClinica, obtenerHistoriasClinicas } from "@/db/historia_clinica_service";
import { HistoriaClinicaListadoModel } from "@/models/historia_clinica_model";
import { Colors } from "@/theme/colors";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

//import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function Index() {

  const router = useRouter()

  const [listadoHistorias, setListadoHistorias] = useState<HistoriaClinicaListadoModel[]>([])
  const [historiasFiltradas, setHistoriasFiltradas] = useState<HistoriaClinicaListadoModel[]>([])
  const [busqueda, setBusqueda] = useState('');
  const [isNavigating, setIsNavigating] = useState(false)





  useEffect(() => {
    const initialize = async () => {
      try {
        await cargarListado()
      }catch (error) {
        console.error("index : Error inicializando las tablas ❌: ", error)
      }
    }
    initialize()
  }, []);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const fetchData = async () => {
        try {
          await cargarListado()
        } catch (error) {
          console.error("Error recargando historias ❌: ", error)
        }
      };
      if (isActive) {
        fetchData();
      }
      return () => {
        isActive = false;
      };
    }, [])
  )

  const cargarListado = async (): Promise<void> => {
    try {
      const respuesta = await obtenerHistoriasClinicas()
      if (respuesta.success && respuesta.data) {
        const ordenadas = respuesta.data
          .filter((h) => !!h.fecha_creacion)
          .sort((a, b) => (b.fecha_creacion ?? '').localeCompare(a.fecha_creacion ?? ''))
        setListadoHistorias(ordenadas)
        setHistoriasFiltradas(ordenadas)
      } else {
        console.error("index : ❌ respuesta invalida al cargar listado.")
      }
    } catch (error) {
      console.error("index : ❌ Error al cargar listado de historias clinicas.")
    }
  }

  const seleccionDeHistoria = (id: number) => {
    router.push({ pathname: "/view", params: { id: id.toString() } })
  }

  const editarHistoria = (id: number, edit: string) => {
    router.push({ pathname: "/create", params: { id: id.toString(), edit: edit } })
  }

  const eliminar = (id: number) => {
    Alert.alert(
      "Confirmar",
      "¿Seguro que quieres eliminar esta historia editada?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Sí",
          onPress: async () => {
            try {
              const res = await eliminarHistoriaClinica(id)
              if (res.success) {
                await cargarListado()
              } else {
                console.error("Error al eliminar historia ❌")
              }
            } catch (error) {
              console.error("❌ Error eliminando historia:", error)
            }
          },
        },
      ]
    )
  }

  const handleNueva = () => {
    if(isNavigating) return
    setIsNavigating(true)
    router.push({ pathname: "/create", params: { id: -1, edit: "false" } })
    //router.push("/create")
    setTimeout(() => setIsNavigating(false), 1000);
  };





  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <TouchableOpacity disabled={isNavigating} style={styles.botonNueva} onPress={handleNueva}>
          <Text style={styles.botonText}>+ Nueva</Text>
        </TouchableOpacity>

        <BuscadorHistorias historias={listadoHistorias} onFiltrar={setHistoriasFiltradas} />
      </View>

      <FlatList
        data={historiasFiltradas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => seleccionDeHistoria(item.id)}>
            <View style={styles.cardHeader}>
              <Text style={styles.fecha}>{item.fecha_creacion}</Text>
              <Text style={styles.nombre}>{item.nombre}</Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'flex-start'}}>

              <Text style={[styles.descripcion, { flex: 1 }]}>{item.motivo_consulta}</Text>
              
              <View style={{ flexDirection: 'column', alignItems: 'center', marginLeft: 8 }}>

                <TouchableOpacity onPress={() => editarHistoria(item.id, "true")} style={{ paddingBottom: 8, marginTop: 6 }}>
                  <FontAwesome name="pencil-square-o" size={18} color={Colors.primary} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => eliminar(item.id)}>
                  <MaterialIcons name="delete-outline" size={23} color={Colors.eliminate} />
                </TouchableOpacity>

              </View>

            </View>

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
    marginLeft: 10,
  },
  descripcion: {
    marginTop: 1,
    color: '#555',
  },
});

