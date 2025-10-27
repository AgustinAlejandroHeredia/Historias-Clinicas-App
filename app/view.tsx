import InfoField from "@/components/InfoField";
import PaginationDots from "@/components/PaginationDots";
import { eliminarHistoriaClinica, obtenerHistoriaClinicaCompletaPorId } from "@/db/historia_clinica_service";
import { obtenerItemsPorHistoriaId } from "@/db/linea_tiempo_item_service";
import { obtenerParientesPorHistoria } from "@/db/pariente_service";
import { HistoriaClinicaComunModel, HistoriaClinicaComunResult } from "@/models/historia_clinica_model";
import { ItemListaResult, ItemModel } from "@/models/lt_item_model";
import { ParienteListaResult, ParienteModel } from "@/models/pariente_model";
import { Colors } from "@/theme/colors";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Alert, Dimensions, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ViewScreen() {

    const router = useRouter()

    const { id } = useLocalSearchParams<{ id: string }>();
    const idNum = Number(id)

    const [historiaClinica, setHistoriaClinica] = useState<HistoriaClinicaComunModel>()
    const [listaItems, setListaItems] = useState<ItemModel[]>([])
    const [listaParientes, setListaParientes] = useState<ParienteModel[]>([])
    const [listaHijos, setListaHijos] = useState<ParienteModel[]>([])
    const [listaHermanos, setListaHermanos] = useState<ParienteModel[]>([])

    useEffect(() => {
        const obtenerDatos = async () => {
        try {
            await obtenerDatosHistoria()
            await obtenerDatosItems()
            await obtenerDatosParientes()
            console.log("view : Datos cargados exitosamente ✅")
        }catch (error) {
            console.error("view : Error al obtener la informacion a presentar ❌: ", error)
        }
        }
        obtenerDatos()
    }, []);

    const obtenerDatosHistoria = async () => {
        const response : HistoriaClinicaComunResult = await obtenerHistoriaClinicaCompletaPorId(idNum)
        if(!response.success) {
            throw new Error("create : Error obteniendo historia clinica ❌ ")
        }
        setHistoriaClinica(response.data as HistoriaClinicaComunModel)
    }

    const obtenerDatosItems = async () => {
        const response : ItemListaResult = await obtenerItemsPorHistoriaId(idNum)
        if(!response.success) {
            throw new Error("create : Error obteniendo items ❌ ")
        }
        // ordena la lista por fechas
        const itemsOrdenados = (response.data as ItemModel[]).sort((a, b) => {
            const [diaA, mesA, anioA] = a.fecha.split("/").map(Number);
            const [diaB, mesB, anioB] = b.fecha.split("/").map(Number);

            const dateA = new Date(anioA, mesA - 1, diaA);
            const dateB = new Date(anioB, mesB - 1, diaB);

            return dateA.getTime() - dateB.getTime();
        });
        setListaItems(itemsOrdenados)
    }

    const obtenerDatosParientes = async () => {
      try {
        const response: ParienteListaResult = await obtenerParientesPorHistoria(idNum)

        if (!response.success) {
          throw new Error("create: Error obteniendo parientes ❌")
        }

        const parientes: ParienteModel[] = response.data as ParienteModel[] || []

        const hijos = parientes.filter(p => p.tipo === "hijo")
        const hermanos = parientes.filter(p => p.tipo === "hermano")

        setListaHijos(hijos)
        setListaHermanos(hermanos)
      } catch (error) {
        console.error("Error en obtenerDatosParientes:", error)
      }
    };

    const retroceder = () => {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace("/");
      }
    }

    const eliminarHistoriaClinicaView = async () => {
        try {
          const response : HistoriaClinicaComunResult = await eliminarHistoriaClinica(idNum)
          if(!response.success){
            throw new Error("view : Error al eliminar la historia clinica ❌")
          }
          console.log("view : Historia eliminada exitosamente ✅")
          retroceder()
        } catch (error) {
          console.log("view : Error eliminando la historia clinica ❌")
          alert("")
        }
    }

    // simplemente hace que la primera letra sea mayuscula para los resultados de las elecciones binarias
    const capitalizar = (texto?: string | null) => {
      if (!texto || texto.trim() === "") return ""
      const lower = texto.toLowerCase()
      if (lower === "si") return "Si"
      if (lower === "no") return "No"
      return texto
    };



    const SCREEN_WIDTH = Dimensions.get("window").width
    const [activeIndex, setActiveIndex] = useState(0)
    const flatListRef = useRef<FlatList>(null)

    // captura cuanto se movio en el scroll lateral en relacion al ancho de la pantalla para saber en que seccion esta el user
    const onScroll = (event: any) => {
      const x = event.nativeEvent.contentOffset.x
      const newIndex = Math.round(x / SCREEN_WIDTH)
      setActiveIndex(newIndex)
    };

    const secciones = [

            // datos de paciente y motivo de consulta
            <ScrollView style={{ width: SCREEN_WIDTH, padding: 20 }} key="datos-paciente">
              <View style={styles.card}>
                  <Text style={styles.cardTitle}>Datos del Paciente</Text>
                  <InfoField label="Nombre" value={historiaClinica?.nombre}/>
                  <InfoField label="Edad" value={historiaClinica?.edad}/>
                  <InfoField label="DNI" value={historiaClinica?.dni}/>
                  <InfoField label="Sexo" value={historiaClinica?.sexo}/>
                  <InfoField label="Estado civil" value={historiaClinica?.estado_civil}/>
                  <InfoField label="Lugar de nacimiento" value={historiaClinica?.l_nacimiento}/>
                  <InfoField label="Ligar de residencia" value={historiaClinica?.l_residencia}/>
                  <InfoField label="Ocupacion" value={historiaClinica?.ocupacion}/>
              </View>

              <View style={styles.card}>
                  <Text style={styles.cardTitle}>Motivo de consulta</Text>
                  <InfoField value={historiaClinica?.motivo_consulta}/>
              </View>
            </ScrollView>,

            // linea de tiempo y narracion
            <ScrollView style={{ width: SCREEN_WIDTH, padding: 20 }} key="linea-de-tiempo">
              <View style={styles.card}>
                  <Text style={styles.cardTitle}>Linea de tiempo</Text>
                  {listaItems.length === 0 ? (
                      <Text style={{ color: "#777", marginTop: 10 }}>No hay eventos agregados.</Text>
                      ) : (
                      listaItems.map((item) => (
                          <View key={item.id} style={styles.itemCard}>
                          <Text style={styles.itemFecha}>{item.fecha}</Text>
                          <Text style={styles.itemDescripcion}>{item.descripcion}</Text>
                          </View>
                      ))
                  )}
              </View>

              <View style={styles.card}>
                <Text style={styles.cardTitle}>Narracion</Text>
                <InfoField value={historiaClinica?.narracion}/>
              </View>
            </ScrollView>,

            // antecedentes de enfermedad actual, peronales y alergias
            <ScrollView style={{ width: SCREEN_WIDTH, padding: 20 }} key="linea-de-tiempo">
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Antecedentes de enfermedad actual</Text>
                <InfoField value={historiaClinica?.antecedentes_enfermedad}/>
              </View>

              <View style={styles.card}>
                <Text style={styles.cardTitle}>Alergias</Text>
                <InfoField value={historiaClinica?.alergias}/>
              </View>

              <View style={styles.card}>
                <Text style={styles.cardTitle}>Antecedentes personales</Text>
                <InfoField label="Antecedentes fisiológicos" value={historiaClinica?.antecedentes_fisiologicos}/>
                <InfoField label="Antecedentes patológicos" value={historiaClinica?.antecedentes_patologicos}/>
                <InfoField label="Antecedentes quirúrgicos" value={historiaClinica?.antecedentes_quirurgicos}/>
                <InfoField label="Antecedentes farmacológicos" value={historiaClinica?.antecedentes_farmacologicos}/>
              </View>
            </ScrollView>,

            // antecedentes familiares
            <ScrollView style={{ width: SCREEN_WIDTH, padding: 20 }} key="linea-de-tiempo">
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Antecedentes familiares</Text>

                {/* Padres */}

                <InfoField label="Madre vive" value={capitalizar(historiaClinica?.madre_vive)}/>
                {historiaClinica?.madre_vive === "no" && (
                  <InfoField label="Causa de fallecimiento" value={historiaClinica?.madre_causa_fallecimiento}/>
                )}
                <InfoField label="Enfermedad (madre)" value={historiaClinica?.madre_enfermedad}/>

                <InfoField label="Padre vive" value={capitalizar(historiaClinica?.padre_vive)}/>
                {historiaClinica?.padre_vive === "no" && (
                  <InfoField label="Causa de fallecimiento" value={historiaClinica?.padre_causa_fallecimiento}/>
                )}
                <InfoField label="Enfermedad (padre)" value={historiaClinica?.padre_enfermedad}/>

                {/* Hijos */}

                {listaHijos.length > 0 ? (
                  listaHijos.map((hijo, i) => (
                    <InfoField key={`hijo_${i}`} label={`Hijo ${i+1}`} value={hijo.nota}/>
                  ))
                ) : (
                  <Text style={styles.infoText}>Sin hijos registrados</Text>
                )}

                {/* Hermanos */}

                {listaHermanos.length > 0 ? (
                  listaHermanos.map((hermano, i) => (
                    <InfoField key={`hermano_${i}`} label={`Hermano ${i+1}`} value={hermano.nota}/>
                  ))
                ) : (
                  <Text style={styles.infoText}>Sin hermanos registrados</Text>
                )}
                
              </View>
            </ScrollView>,

            // habitos
            <ScrollView style={{ width: SCREEN_WIDTH, padding: 20 }} key="habitos">
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Hábitos</Text>

                {(
                  historiaClinica?.h_alimentacion ||
                  historiaClinica?.h_diuresis ||
                  historiaClinica?.h_catarsis ||
                  historiaClinica?.h_sueño ||
                  historiaClinica?.h_alcohol_tabaco ||
                  historiaClinica?.h_infusiones ||
                  historiaClinica?.h_farmacos
                ) ? (
                  <>
                    <InfoField label="Hábitos de alimentación" value={historiaClinica?.h_alimentacion} />
                    <InfoField label="Hábitos de diuresis" value={historiaClinica?.h_diuresis} />
                    <InfoField label="Hábitos de catarsis" value={historiaClinica?.h_catarsis} />
                    <InfoField label="Hábitos de sueño" value={historiaClinica?.h_sueño} />
                    <InfoField label="Hábitos de alcohol / tabaco" value={historiaClinica?.h_alcohol_tabaco} />
                    <InfoField label="Hábitos de infusiones" value={historiaClinica?.h_infusiones} />
                    <InfoField label="Hábitos de fármacos" value={historiaClinica?.h_farmacos} />
                  </>
                ) : (
                  <Text style={styles.infoText}>No se registró nungún hábito del paciente.</Text>
                )}
              </View>
            </ScrollView>,

            // caracteristicas socioeconomicas y fin
            <ScrollView style={{ width: SCREEN_WIDTH, padding: 20 }} key="caracteristicas-socioeconomicas-y-fin">
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Características socioeconómicas</Text>

                {(
                  historiaClinica?.obra_social ||
                  historiaClinica?.material_casa ||
                  historiaClinica?.electricidad ||
                  historiaClinica?.agua ||
                  historiaClinica?.toilet_privado ||
                  historiaClinica?.calefaccion ||
                  historiaClinica?.mascotas ||
                  historiaClinica?.otro
                ) ? (
                  <>
                    <InfoField label="Obra social" value={historiaClinica?.obra_social} />
                    <InfoField label="Material de la casa" value={historiaClinica?.material_casa} />
                    <InfoField label="Electricidad" value={capitalizar(historiaClinica?.electricidad)} />
                    <InfoField label="Agua corriente" value={capitalizar(historiaClinica?.agua)} />
                    <InfoField label="Baño privado" value={capitalizar(historiaClinica?.toilet_privado)} />
                    <InfoField label="Calefacción" value={historiaClinica?.calefaccion} />
                    <InfoField label="Mascotas" value={historiaClinica?.mascotas} />
                    <InfoField label="Otro" value={historiaClinica?.otro} />
                  </>
                ) : (
                  <Text style={styles.infoText}>No se registró nunguna caracteristica socioeconomica.</Text>
                )}
              </View>

              <View style={styles.buttonContainerRight}>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: Colors.eliminate, width: 150 }]}
                  onPress={() => {
                    Alert.alert(
                      "Confirmar",
                      "¿Seguro que quieres eliminar esta historia?",
                      [
                        { text: "No", style: "cancel" },
                        { text: "Sí", onPress: () => eliminarHistoriaClinicaView() }
                      ]
                    );
                  }}
                >
                  <Text style={[styles.actionButtonText, { color: "white" }]}>
                    Eliminar
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
    ]






    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} edges={['left', 'right', 'bottom']}>
        <Stack.Screen
          options={{
            title: "Ver Historia Clínica",
            headerBackVisible: false,
            headerShown: true,
          }}
        />

        <View style={{ flex: 1, justifyContent: "flex-start" }}>

          {/* Componente de puntos de paginacion */}
          <PaginationDots secciones={secciones} activeIndex={activeIndex}/>

          {/* FlatList horizontal */}
          <FlatList
            ref={flatListRef}
            data={secciones}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => item}
            onScroll={onScroll}
            scrollEventThrottle={16} // para actualizar smooth el activeIndex
          />
        </View>
      </SafeAreaView>     
  );
}



const styles = StyleSheet.create({
  buttonContainerRight: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
    marginBottom: 40,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 40,
  },
  floatingButton: {
    position: "absolute",
    bottom: 25,
    right: 25,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6, // sombra en Android
    shadowColor: "#000", // sombra en iOS
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  floatingButtonText: {
    color: "white",
    fontSize: 30,
    lineHeight: 30,
    fontWeight: "bold",
  },
  infoText: {
    fontSize: 14,
    color: "#444",
    marginBottom: 8,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
    textAlignVertical: "top",
  },
  textArea: {
    minHeight: 100,
  },
  itemCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },
  itemFecha: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  itemDescripcion: {
    color: "#555",
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
    lineHeight: 20,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 15,
  },
  modalButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginLeft: 10,
  },
  inputLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  inputLabelBigger: {
    fontSize: 17,
    color: "#333333ff",
    marginBottom: 4,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 5, // separa los botones
  },

  actionButtonText: {
    fontWeight: "bold",
    fontSize: 16,
  },
});