import { siguienteId } from "@/db/historia_clinica_service";
import { ItemModel } from "@/models/lt_item_model";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function CreateScreen() {
  
  const router = useRouter()

  const [formData, setFormData] = useState({

    nombre: "",
    dni: "",
    edad: "",
    sexo: "",
    estado_civil: "",
    l_nacimiento: "",
    l_residencia: "",
    ocupacion: "",

    motivo_consulta: "",

    narracion: "",

    antecedentes_enfermedad: "",
    antecedentes_fisiologicos: "",
    antecedentes_patologicos: "",
    antecedentes_quirurgicos: "",
    antecedentes_farmacologicos: "",

    madre_vive: "",
    madre_causa_fallecimiento: "",
    madre_enfermedad: "",

    padre_vive: "",
    padre_causa_fallecimiento: "",
    padre_enfermedad: "",

    hijos: "",
    hermanos: "",

    h_alimentacion: "",
    h_diuresis: "",
    h_catarsis: "",
    h_sueño: "",
    h_alcohol_tabaco: "",
    h_infusiones: "",
    h_farmacos: "",

    obra_social: "",
    material_casa: "",
    electricidad: "",
    agua: "",
    toilet_privado: "",
    calefaccion: "",
    mascotas: "",
    otro: "",





    diagnostico: "",
  });

  const [listaItems, setListaItems] = useState<ItemModel[]>([])
  const [modalVisible, setModalVisible] = useState(false)
  const [nuevoItem, setNuevoItem] = useState({fecha: "", descripcion: ""})
  const [ultimoId, setUltimoId] = useState<number>(0) // si se lee 0 es que hubo un error
  const [itemIdAux, setItemIdAux] = useState<number>(0)



  // FUNCIONES

  useEffect(() => {
  const initialize = async () => {
    try {
      await obtenerUltimoId();
    } catch (error) {
      console.error("create: ❌ Error al obtener el último ID", error);
      // Opcional: mostrar un mensaje al usuario
    }
  };
  initialize();
}, []);

  const obtenerUltimoId = async () => {
    try {
      const res = await siguienteId();
      if (res >= 0) {
        setUltimoId(res);
        console.log("create: ultimo ID es", res);
      } else {
        console.error("create: ❌ Error al obtener el siguiente id de historia clinica.");
        // No redirigir automáticamente, mejor mostrar un mensaje
        alert("Error al inicializar la base de datos. Por favor, reinicie la aplicación.");
      }
    } catch (error) {
      console.error("create: ❌ Error en obtenerUltimoId:", error);
      throw error; // Propaga el error para manejarlo en el useEffect
    }
  };

  const handleChange = (campo: keyof typeof formData, valor: string) => {
    setFormData({ ...formData, [campo]: valor });
  };

  const agregarItem = () => {
    setItemIdAux(itemIdAux+1)
    console.log(itemIdAux)
    setNuevoItem({ fecha:"", descripcion:"" })
    setModalVisible(true)
  }

  const aceptarNuevoItem = () => {
    if(nuevoItem.fecha && nuevoItem.descripcion) {
      const item: ItemModel = {
        id: itemIdAux,
        fecha: nuevoItem.fecha,
        descripcion: nuevoItem.descripcion,
        historia_clinica_comun_id: ultimoId
      };
      setListaItems([item, ...listaItems])
      setModalVisible(false)
    } else {
      alert("Para guardarlo debe haber completado ambos campos.")
    }
  }

  const cancelarNuevoItem = () => {
    setNuevoItem({ fecha:"", descripcion:"" }) // limpia inputs
    setModalVisible(false)
  }

  const renderListaItems = ({ item }: { item: ItemModel }) => (
    <View style={styles.itemCard}>
      <Text style={styles.itemFecha}>{item.fecha}</Text>
      <Text style={styles.itemDescripcion}>{item.descripcion}</Text>
    </View>
  )



  // VISTA

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Datos personales */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Datos del Paciente</Text>

        <TextInput
            style={styles.input}
            placeholder="Nombre completo"
            value={formData.nombre}
            onChangeText={(text) => handleChange("nombre", text)}
        />

        <TextInput
            style={styles.input}
            placeholder="Edad"
            keyboardType="numeric"
            value={formData.edad}
            onChangeText={(text) => handleChange("edad", text)}
        />

        <TextInput
            style={styles.input}
            placeholder="DNI"
            keyboardType="numeric"
            value={formData.dni}
            onChangeText={(text) => handleChange("dni", text)}
        />

        <TextInput
            style={styles.input}
            placeholder="Sexo"
            value={formData.sexo}
            onChangeText={(text) => handleChange("sexo", text)}
        />

        <TextInput
            style={styles.input}
            placeholder="Estado civil"
            value={formData.estado_civil}
            onChangeText={(text) => handleChange("estado_civil", text)}
        />

        <TextInput
            style={styles.input}
            placeholder="Lugar de nacimiento"
            value={formData.l_nacimiento}
            onChangeText={(text) => handleChange("l_nacimiento", text)}
        />

        <TextInput
            style={styles.input}
            placeholder="Lugar de residencia"
            value={formData.l_residencia}
            onChangeText={(text) => handleChange("l_residencia", text)}
        />

        <TextInput
            style={styles.input}
            placeholder="Ocupacion"
            value={formData.ocupacion}
            onChangeText={(text) => handleChange("ocupacion", text)}
        />
      </View>

      {/* Motivo de consulta */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Motivo de Consulta</Text>

        <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describa brevemente el motivo de la consulta..."
            multiline
            numberOfLines={4}
            value={formData.motivo_consulta}
            onChangeText={(text) => handleChange("motivo_consulta", text)}
        />
      </View>

      {/* Linea de tiempo */}
      <View style={styles.card}>
        <View style={styles.itemHeader}>
          <Text style={styles.cardTitle}>Línea de tiempo</Text>
          <TouchableOpacity style={styles.addButton} onPress={agregarItem}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>

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

      {/* Modal para agregar item de línea de tiempo */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={cancelarNuevoItem}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Nuevo evento</Text>
            <TextInput
              style={styles.input}
              placeholder="Fecha (dd/mm/yyyy)"
              value={nuevoItem.fecha}
              onChangeText={(text) => setNuevoItem({ ...nuevoItem, fecha: text })}
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Descripción"
              multiline
              numberOfLines={3}
              value={nuevoItem.descripcion}
              onChangeText={(text) => setNuevoItem({ ...nuevoItem, descripcion: text })}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalButton, { backgroundColor: "#ccc" }]} onPress={cancelarNuevoItem}>
                <Text>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, { backgroundColor: "#4CAF50" }]} onPress={aceptarNuevoItem}>
                <Text style={{ color: "white" }}>Aceptar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Narracion */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Narración</Text>

        <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Haga una narración acorde a la linea de tiempo establecida previamente..."
            multiline
            numberOfLines={4}
            value={formData.narracion}
            onChangeText={(text) => handleChange("narracion", text)}
        />
      </View>

      {/* Antecedentes de enfermedad actual */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Antecedentes de enfermedad</Text>

        <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Haga una descripción de los antecedentes de la enfermedad actual del paciente..."
            multiline
            numberOfLines={4}
            value={formData.antecedentes_enfermedad}
            onChangeText={(text) => handleChange("antecedentes_enfermedad", text)}
        />
      </View>

      {/* Antecedentes personales */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Antecedentes personales</Text>

        <Text style={styles.inputLabel}>Antecedentes fisiológicos</Text>
        <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Antecedentes fisiológicos..."
            multiline
            numberOfLines={4}
            value={formData.antecedentes_fisiologicos}
            onChangeText={(text) => handleChange("antecedentes_fisiologicos", text)}
        />

        <Text style={styles.inputLabel}>Antecedentes patológicos</Text>
        <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Antecedentes patológicos..."
            multiline
            numberOfLines={4}
            value={formData.antecedentes_patologicos}
            onChangeText={(text) => handleChange("antecedentes_patologicos", text)}
        />

        <Text style={styles.inputLabel}>Antecedentes quirúrgicos</Text>
        <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Antecedentes quirúrgicos..."
            multiline
            numberOfLines={4}
            value={formData.antecedentes_quirurgicos}
            onChangeText={(text) => handleChange("antecedentes_quirurgicos", text)}
        />

        <Text style={styles.inputLabel}>Antecedentes farmacológicos</Text>
        <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Antecedentes farmacológicos..."
            multiline
            numberOfLines={4}
            value={formData.antecedentes_farmacologicos}
            onChangeText={(text) => handleChange("antecedentes_farmacologicos", text)}
        />
      </View>

      {/* Antecedentes familiares */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Antecedentes familiares</Text>

        

      </View>

      {/* Habitos */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Hábitos</Text>

        <Text style={styles.inputLabel}>Alimentacion</Text>
        <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="H. de alimentación..."
            multiline
            numberOfLines={4}
            value={formData.h_alimentacion}
            onChangeText={(text) => handleChange("h_alimentacion", text)}
        />

        <Text style={styles.inputLabel}>Diuresis</Text>
        <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="H. de diuresis..."
            multiline
            numberOfLines={4}
            value={formData.h_diuresis}
            onChangeText={(text) => handleChange("h_diuresis", text)}
        />

        <Text style={styles.inputLabel}>Catarsis</Text>
        <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="H. de catarsis..."
            multiline
            numberOfLines={4}
            value={formData.h_catarsis}
            onChangeText={(text) => handleChange("h_catarsis", text)}
        />

        <Text style={styles.inputLabel}>Sueño</Text>
        <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="H. de sueño..."
            multiline
            numberOfLines={4}
            value={formData.h_sueño}
            onChangeText={(text) => handleChange("h_sueño", text)}
        />

        <Text style={styles.inputLabel}>Alcohol/tabaco</Text>
        <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="H. de alcohol/tabaco..."
            multiline
            numberOfLines={4}
            value={formData.h_alcohol_tabaco}
            onChangeText={(text) => handleChange("h_alcohol_tabaco", text)}
        />

        <Text style={styles.inputLabel}>Infusiones</Text>
        <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="H. de infusiones..."
            multiline
            numberOfLines={4}
            value={formData.h_infusiones}
            onChangeText={(text) => handleChange("h_infusiones", text)}
        />

        <Text style={styles.inputLabel}>Fármacos</Text>
        <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="H. de fármacos..."
            multiline
            numberOfLines={4}
            value={formData.h_farmacos}
            onChangeText={(text) => handleChange("h_farmacos", text)}
        />
      </View>

      {/* Caracteristicas socioeconomicas */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Características socioeconómicas</Text>

        <Text style={styles.inputLabel}>Obra social</Text>

        <Text style={styles.inputLabel}>Material de la casa</Text>
        <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Material del que este hecha la vivienda..."
            multiline
            numberOfLines={4}
            value={formData.material_casa}
            onChangeText={(text) => handleChange("material_casa", text)}
        />

        <Text style={styles.inputLabel}>Electricidad</Text>

        <Text style={styles.inputLabel}>Agua corriente</Text>

        <Text style={styles.inputLabel}>Baño privado</Text>

        <Text style={styles.inputLabel}>Calefacción</Text>
        <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Calefacción..."
            multiline
            numberOfLines={4}
            value={formData.calefaccion}
            onChangeText={(text) => handleChange("calefaccion", text)}
        />

        <Text style={styles.inputLabel}>Mascotas</Text>
        <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Mascotas que tenga el paciente..."
            multiline
            numberOfLines={4}
            value={formData.mascotas}
            onChangeText={(text) => handleChange("mascotas", text)}
        />

        <Text style={styles.inputLabel}>Otros</Text>
        <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Otras caracteristicas extras a agregar..."
            multiline
            numberOfLines={4}
            value={formData.otro}
            onChangeText={(text) => handleChange("otro", text)}
        />

      </View>
      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
    backgroundColor: "#4CAF50",
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
});
