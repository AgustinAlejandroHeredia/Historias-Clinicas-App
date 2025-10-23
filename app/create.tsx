import { BinaryChoice } from "@/components/BinaryChoice";
import { CustomInput } from "@/components/CustomInput";
import { DateInput } from "@/components/DateInput";
import { NumberPicker } from "@/components/NumberPicker";
import { agregarHistoriaClinica, eliminarHistoriaClinica } from "@/db/historia_clinica_service";
import { agregarLineaTiempoItem, eliminarItemPorId } from "@/db/linea_tiempo_item_service";
import { agregarPariente, eliminarParientePorId } from "@/db/pariente_service";
import { HistoriaClinicaComunModel, HistoriaClinicaComunResult } from "@/models/historia_clinica_model";
import { ItemModel, ItemResult } from "@/models/lt_item_model";
import { ParienteModel, ParienteResult } from "@/models/pariente_model";
import { Colors } from "@/theme/colors";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

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

    alergias: "",

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

    hijos: "0",
    hermanos: "0",

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
  });

  const nombresLegibles: Partial<Record<keyof HistoriaClinicaComunModel, string>> = {
    nombre: "Nombre",
    dni: "DNI",
    edad: "Edad",
    sexo: "Sexo",
    estado_civil: "Estado civil",
    l_nacimiento: "Lugar de nacimiento",
    l_residencia: "Lugar de residencia",
    ocupacion: "Ocupación",
    motivo_consulta: "Motivo de consulta",
    narracion: "Narración",
    antecedentes_enfermedad: "Antecedentes de enfermedad",
    alergias: "Alergias",
    antecedentes_fisiologicos: "Antecedentes fisiológicos",
    antecedentes_patologicos: "Antecedentes patológicos",
    antecedentes_quirurgicos: "Antecedentes quirúrgicos",
    antecedentes_farmacologicos: "Antecedentes farmacológicos",
    hijos: "Cantidad de hijos",
    hermanos: "Cantidad de hermanos",
  };

  const camposObligatorios: (keyof HistoriaClinicaComunModel)[] = [
    "nombre",
    "edad",
    "sexo",
    "l_nacimiento",
    "l_residencia",
    "ocupacion",
    "motivo_consulta",
    "narracion",
    "antecedentes_enfermedad",
    "alergias",
    "antecedentes_fisiologicos",
    "antecedentes_patologicos",
    "antecedentes_quirurgicos",
    "antecedentes_farmacologicos",
    "hijos",
    "hermanos",
  ];

  const [listaItems, setListaItems] = useState<ItemModel[]>([])
  const [modalVisible, setModalVisible] = useState(false)
  const [nuevoItem, setNuevoItem] = useState({fecha: "", descripcion: ""})
  const [itemIdAux, setItemIdAux] = useState<number>(0)

  const [listaHijos, setListaHijos] = useState<ParienteModel[]>([])
  const [cantHijos, setCantHijos] = useState<number>(0)

  const [listaHermanos, setListaHermanos] = useState<ParienteModel[]>([])
  const [cantHermanos, setCantHermanos] = useState<number>(0)



  // FUNCIONES

  const handleChange = (campo: keyof typeof formData, valor: string) => {
    setFormData({ ...formData, [campo]: valor });
  };

  const handleCantidadHijos = (cant: number) => {
    setCantHijos(cant);
    const nuevaLista = Array.from({ length: cant }, (_, i) => ({
      id: i + 1,
      nota: listaHijos[i]?.nota || "",
      tipo: "hijo",
      historia_clinica_comun_id: -1,
    }));
    setListaHijos(nuevaLista);
  }

  const handleCantidadHermanos = (cant: number) => {
    setCantHermanos(cant);
    const nuevaLista = Array.from({ length: cant }, (_, i) => ({
      id: i + 1,
      nota: listaHermanos[i]?.nota || "",
      tipo: "hermano",
      historia_clinica_comun_id: 0,
    }));
    setListaHermanos(nuevaLista);
  };

  const handleParienteNota = (
    tipo: "hijo" | "hermano",
    index: number,
    texto: string
  ) => {
    if (tipo === "hijo") {
      const actualizados = [...listaHijos];
      actualizados[index].nota = texto;
      setListaHijos(actualizados);
    } else {
      const actualizados = [...listaHermanos];
      actualizados[index].nota = texto;
      setListaHermanos(actualizados);
    }
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
        historia_clinica_comun_id: -1
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

  const retroceder = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  }

  // elimina los items que creo en base a las ids que recibio al crearlos
  const eliminarItemsGuardados = async (lista_ids : number[]) => {
    if(lista_ids.length > 0){
      for (let i=0; i<listaItems.length; i++){
        eliminarItemPorId(lista_ids[i])
      }
    }
  }

  // elimina los parientes que creo en base a las ids que recibio al crearlos
  const eliminarParientesGuardados = async (lista_ids : number[]) => {
    if(lista_ids.length > 0){
      for (let i=0; i<listaItems.length; i++){
        eliminarParientePorId(lista_ids[i])
      }
    }
  }

  const guardarDatos = async () => {
    console.log(" ---------- FORM DATA ---------- ")
    console.log(formData)
    console.log(" ---------- ITEMS ---------- ")
    console.log(listaItems)
    console.log(" ---------- HIJOS ---------- ")
    console.log(listaHijos)
    console.log(" ---------- HERMANOS ---------- ")
    console.log(listaHermanos)

    const reg_aux_id: {
      id_historia: number;
      id_items: number[];
      id_parientes: number[]
    } = {
      id_historia: -1,
      id_items: [],
      id_parientes: []
    }

    try{

      // se crea el objeto para envio de datos de historia clinica
      const historiaNueva : HistoriaClinicaComunModel = {
        nombre: formData.nombre,
        dni: formData.dni,
        edad: formData.edad,
        sexo: formData.sexo,
        estado_civil: formData.estado_civil,
        l_nacimiento: formData.l_nacimiento,
        l_residencia: formData.l_residencia,
        ocupacion: formData.ocupacion,
        motivo_consulta: formData.motivo_consulta,
        narracion: formData.narracion,
        antecedentes_enfermedad: formData.antecedentes_enfermedad,
        alergias: formData.alergias,
        antecedentes_fisiologicos: formData.antecedentes_fisiologicos,
        antecedentes_patologicos: formData.antecedentes_patologicos,
        antecedentes_quirurgicos: formData.antecedentes_quirurgicos,
        antecedentes_farmacologicos: formData.antecedentes_farmacologicos,
        madre_vive: formData.madre_vive,
        madre_causa_fallecimiento: formData.madre_causa_fallecimiento,
        madre_enfermedad: formData.madre_enfermedad,
        padre_vive: formData.padre_vive,
        padre_causa_fallecimiento: formData.padre_causa_fallecimiento,
        padre_enfermedad: formData.padre_enfermedad,
        hijos: formData.hijos,
        hermanos: formData.hermanos,
        h_alimentacion: formData.h_alimentacion,
        h_diuresis: formData.h_diuresis,
        h_catarsis: formData.h_catarsis,
        h_sueño: formData.h_sueño,
        h_alcohol_tabaco: formData.h_alcohol_tabaco,
        h_infusiones: formData.h_infusiones,
        h_farmacos: formData.h_farmacos,
        obra_social: formData.obra_social,
        material_casa: formData.material_casa,
        electricidad: formData.electricidad,
        agua: formData.agua,
        toilet_privado: formData.toilet_privado,
        calefaccion: formData.calefaccion,
        mascotas: formData.mascotas,
        otro: formData.otro
      }

      // envia a guardar la historia clinica
      const response_historia : HistoriaClinicaComunResult = await agregarHistoriaClinica(historiaNueva)
      if(!response_historia.success){
        alert("Error cuardando la historia clinica :( (error : historia)")
        throw new Error("Error guardando historia");
      }
      reg_aux_id.id_historia=response_historia.id!
      console.log("Historia Clinica guardada ✅")

      // se crea el objeto para envio de datos de items por cada item que se haya creado
      for (let i=0; i<listaItems.length; i++){
        const item = listaItems[i]

        const itemNuevo : ItemModel = {
          fecha: item.fecha,
          descripcion: item.descripcion,
          historia_clinica_comun_id: response_historia.id!
        }

        const response_item : ItemResult = await agregarLineaTiempoItem(itemNuevo)

        // si falla
        if(!response_item.success){
          alert("Error cuardando la historia clinica :( (error : item)")
          // procede a borrar los que guardo si es que guardo alguno
          await eliminarItemsGuardados(reg_aux_id.id_items)
          await eliminarHistoriaClinica(reg_aux_id.id_historia)
          throw new Error("Error guardando item");
        }else{
          // guarda la id del item actual
          reg_aux_id.id_items.push(response_item.id!)
        }
      }
      console.log("Items guardados ✅")

      // se crea el objeto para envio de datos de pariente por cada item que se haya creado
      for (let i=0; i<listaHijos.length; i++){
        const hijo = listaHijos[i]

        const hijoNuevo : ParienteModel = {
          nota: hijo.nota,
          tipo: "hijo",
          historia_clinica_comun_id: response_historia.id!
        }
        const response_pariente : ParienteResult = await agregarPariente(hijoNuevo)

        // si falla
        if(!response_pariente.success){
          alert("Error cuardando la historia clinica :( (error : pariente)")
          // procede a borrar los items y parientes que guardo, si guardo alguno
          await eliminarParientesGuardados(reg_aux_id.id_parientes)
          await eliminarItemsGuardados(reg_aux_id.id_items)
          await eliminarHistoriaClinica(reg_aux_id.id_historia)
          throw new Error("Error guardando pariente");
        }else{
          // guarda la id del pariente actual
          reg_aux_id.id_parientes.push(response_pariente.id!)
        }
      }
      console.log("Hijos guardados ✅")

      // se crra el objeto para envio de datos de pariente por cada item que se haya creado
      for (let i=0; i<listaHermanos.length; i++){
        const hermano = listaHermanos[i]

        const hermanoNuevo : ParienteModel = {
          nota: hermano.nota,
          tipo: "hermano",
          historia_clinica_comun_id: response_historia.id!
        }
        await agregarPariente(hermanoNuevo)
      }
      console.log("Hermanos guardados ✅")

      console.log(" ---------- Todos los datos guardados con exito ✅ ---------- ")
      retroceder()

    } catch (error) {
      console.error("create : Se produjo un error cuardando los datos obtenidos ❌.")
    }
  }

  const validarCamposObligatorios = (data: HistoriaClinicaComunModel) => {
    const faltantes: string[] = [];

    camposObligatorios.forEach((campo) => {
      const valor = data[campo];
      if (!valor || String(valor).trim() === "") {
        faltantes.push(nombresLegibles[campo] || campo);
      }
    });

    if (listaItems.length === 0) {
      faltantes.push("Línea de tiempo (al menos un evento)");
    }

    return faltantes;
  };



  // VISTA

  return (
    <>
    <Stack.Screen
        options={{
          title: "Crear Historia Clínica",
          headerBackVisible: false, // elimino la flecha de retroceso para evitar errores del user y mantener consistencia visual
          headerShown: true,
        }}
      />

    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Datos personales */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Datos del Paciente</Text>

        <CustomInput
            placeholder="Nombre completo *"
            value={formData.nombre}
            onChangeText={(text) => handleChange("nombre", text)}
        />

        <CustomInput
            placeholder="Edad *"
            keyboardType="numeric"
            value={formData.edad}
            onChangeText={(text) => handleChange("edad", text)}
        />

        <CustomInput
            placeholder="DNI"
            keyboardType="numeric"
            value={formData.dni}
            onChangeText={(text) => handleChange("dni", text)}
        />

        <CustomInput
            placeholder="Sexo *"
            value={formData.sexo}
            onChangeText={(text) => handleChange("sexo", text)}
        />

        <CustomInput
            placeholder="Estado civil"
            value={formData.estado_civil}
            onChangeText={(text) => handleChange("estado_civil", text)}
        />

        <CustomInput
            placeholder="Lugar de nacimiento *"
            value={formData.l_nacimiento}
            onChangeText={(text) => handleChange("l_nacimiento", text)}
        />

        <CustomInput
            placeholder="Lugar de residencia *"
            value={formData.l_residencia}
            onChangeText={(text) => handleChange("l_residencia", text)}
        />

        <CustomInput
            placeholder="Ocupacion *"
            value={formData.ocupacion}
            onChangeText={(text) => handleChange("ocupacion", text)}
        />
      </View>

      {/* Motivo de consulta */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Motivo de Consulta</Text>

        <CustomInput
            big
            placeholder="Describa brevemente el motivo de la consulta... *"
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
            <Text style={styles.inputLabel}>Solo ingresar números</Text>
            <DateInput
              placeholder="Fecha (dd/mm/yyyy)"
              value={nuevoItem.fecha}
              onChangeText={(text) => setNuevoItem({ ...nuevoItem, fecha: text })}
            />
            <CustomInput
              big
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
              <TouchableOpacity style={[styles.modalButton, { backgroundColor: Colors.primary, }]} onPress={aceptarNuevoItem}>
                <Text style={{ color: "white" }}>Aceptar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Narracion */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Narración</Text>

        <CustomInput
            big
            placeholder="Haga una narración acorde a la linea de tiempo establecida previamente... *"
            value={formData.narracion}
            onChangeText={(text) => handleChange("narracion", text)}
        />
      </View>

      {/* Antecedentes de enfermedad actual */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Antecedentes de enfermedad</Text>

        <CustomInput
            big
            placeholder="Haga una descripción de los antecedentes de la enfermedad actual del paciente... *"
            value={formData.antecedentes_enfermedad}
            onChangeText={(text) => handleChange("antecedentes_enfermedad", text)}
        />
      </View>

      {/* Alergias */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Alergias</Text>

        <CustomInput
            big
            placeholder="Alergias del paciente... *"
            value={formData.alergias}
            onChangeText={(text) => handleChange("alergias", text)}
        />
      </View>

      {/* Antecedentes personales */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Antecedentes personales</Text>

        <Text style={styles.inputLabel}>Antecedentes fisiológicos</Text>
        <CustomInput
            big
            placeholder="Antecedentes fisiológicos... *"
            value={formData.antecedentes_fisiologicos}
            onChangeText={(text) => handleChange("antecedentes_fisiologicos", text)}
        />

        <Text style={styles.inputLabel}>Antecedentes patológicos</Text>
        <CustomInput
            big
            placeholder="Antecedentes patológicos... *"
            value={formData.antecedentes_patologicos}
            onChangeText={(text) => handleChange("antecedentes_patologicos", text)}
        />

        <Text style={styles.inputLabel}>Antecedentes quirúrgicos</Text>
        <CustomInput
            big
            placeholder="Antecedentes quirúrgicos... *"
            value={formData.antecedentes_quirurgicos}
            onChangeText={(text) => handleChange("antecedentes_quirurgicos", text)}
        />

        <Text style={styles.inputLabel}>Antecedentes farmacológicos</Text>
        <CustomInput
            big
            placeholder="Antecedentes farmacológicos... *"
            value={formData.antecedentes_farmacologicos}
            onChangeText={(text) => handleChange("antecedentes_farmacologicos", text)}
        />
      </View>

      {/* Antecedentes familiares */}

      {/* Padres */}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Antecedentes familiares</Text>

        <Text style={styles.inputLabelBigger}>Madre</Text>
        <Text style={styles.inputLabel}>¿Vive?</Text>
        <BinaryChoice
          value={formData.madre_vive as "si" | "no" | ""}
          onChange={(val) => handleChange("madre_vive", val)}
        />
        {formData.madre_vive === "no" && (
          <CustomInput
            small
            placeholder="Causa de fallecimiento..."
            value={formData.madre_causa_fallecimiento}
            onChangeText={(text) => handleChange("madre_causa_fallecimiento", text)}
          />
        )}
        <Text style={styles.inputLabel}>Padece alguna enfermedad?</Text>
        <CustomInput
          mid
          placeholder="Enfermedad/es de la madre..."
          value={formData.madre_enfermedad}
          onChangeText={(text) => handleChange("madre_enfermedad", text)}
        />

        <Text style={styles.inputLabelBigger}>Padre</Text>
        <Text style={styles.inputLabel}>¿Vive?</Text>
        <BinaryChoice
          value={formData.padre_vive as "si" | "no" | ""}
          onChange={(val) => handleChange("padre_vive", val)}
        />
        {formData.padre_vive === "no" && (
          <CustomInput
            small
            placeholder="Causa de fallecimiento..."
            value={formData.padre_causa_fallecimiento}
            onChangeText={(text) => handleChange("padre_causa_fallecimiento", text)}
          />
        )}
        <Text style={styles.inputLabel}>Padece alguna enfermedad?</Text>
        <CustomInput
          mid
          placeholder="Enfermedad/es del padre..."
          value={formData.padre_enfermedad}
          onChangeText={(text) => handleChange("padre_enfermedad", text)}
        />

        {/* Hijos / Hermanos */}

        <Text style={styles.inputLabelBigger}>Hijos</Text>
        <Text style={styles.inputLabel}>¿Cuántos?</Text>

        <NumberPicker
          value={cantHijos}
          onChange={(num) => handleCantidadHijos(num)}
        />

        {listaHijos.map((hijo, i) => (
          <CustomInput
            small
            key={`hijo_${i}`}
            placeholder={`Información del hijo ${i + 1}`}
            value={hijo.nota}
            onChangeText={(text) => handleParienteNota("hijo", i, text)}
          />
        ))}

        {/* Sección de Hermanos */}
        <Text style={styles.inputLabelBigger}>Hermanos</Text>
        <Text style={styles.inputLabel}>¿Cuántos?</Text>

        <NumberPicker
          value={cantHermanos}
          onChange={(num) => handleCantidadHermanos(num)}
        />

        {listaHermanos.map((hermano, i) => (
          <CustomInput
            small
            key={`hermano_${i}`}
            placeholder={`Información del hermano ${i + 1}`}
            value={hermano.nota}
            onChangeText={(text) => handleParienteNota("hermano", i, text)}
          />
        ))}

      </View>

      {/* Habitos */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Hábitos</Text>

        <Text style={styles.inputLabel}>Alimentacion</Text>
        <CustomInput
            big
            placeholder="H. de alimentación..."
            value={formData.h_alimentacion}
            onChangeText={(text) => handleChange("h_alimentacion", text)}
        />

        <Text style={styles.inputLabel}>Diuresis</Text>
        <CustomInput
            big
            placeholder="H. de diuresis..."
            value={formData.h_diuresis}
            onChangeText={(text) => handleChange("h_diuresis", text)}
        />

        <Text style={styles.inputLabel}>Catarsis</Text>
        <CustomInput
            big
            placeholder="H. de catarsis..."
            value={formData.h_catarsis}
            onChangeText={(text) => handleChange("h_catarsis", text)}
        />

        <Text style={styles.inputLabel}>Sueño</Text>
        <CustomInput
            big
            placeholder="H. de sueño..."
            value={formData.h_sueño}
            onChangeText={(text) => handleChange("h_sueño", text)}
        />

        <Text style={styles.inputLabel}>Alcohol/tabaco</Text>
        <CustomInput
            big
            placeholder="H. de alcohol/tabaco..."
            value={formData.h_alcohol_tabaco}
            onChangeText={(text) => handleChange("h_alcohol_tabaco", text)}
        />

        <Text style={styles.inputLabel}>Infusiones</Text>
        <CustomInput
            big
            placeholder="H. de infusiones..."
            value={formData.h_infusiones}
            onChangeText={(text) => handleChange("h_infusiones", text)}
        />

        <Text style={styles.inputLabel}>Fármacos</Text>
        <CustomInput
            big
            placeholder="H. de fármacos..."
            value={formData.h_farmacos}
            onChangeText={(text) => handleChange("h_farmacos", text)}
        />
      </View>

      {/* Caracteristicas socioeconomicas */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Características socioeconómicas</Text>

        <Text style={styles.inputLabel}>Obra social</Text>
        <CustomInput
            placeholder="Obra social..."
            value={formData.obra_social}
            onChangeText={(text) => handleChange("obra_social", text)}
        />

        <Text style={styles.inputLabel}>Material de la casa</Text>
        <CustomInput
            big
            placeholder="Material del que este hecha la vivienda..."
            value={formData.material_casa}
            onChangeText={(text) => handleChange("material_casa", text)}
        />

        <Text style={styles.inputLabel}>Electricidad</Text>
        <BinaryChoice
          value={formData.electricidad as "si" | "no" | ""}
          onChange={(val) => handleChange("electricidad", val)}
        />

        <Text style={styles.inputLabel}>Agua corriente</Text>
        <BinaryChoice
          value={formData.agua as "si" | "no" | ""}
          onChange={(val) => handleChange("agua", val)}
        />

        <Text style={styles.inputLabel}>Baño privado</Text>
        <BinaryChoice
          value={formData.toilet_privado as "si" | "no" | ""}
          onChange={(val) => handleChange("toilet_privado", val)}
        />

        <Text style={styles.inputLabel}>Calefacción</Text>
        <CustomInput
            big
            placeholder="Calefacción..."
            value={formData.calefaccion}
            onChangeText={(text) => handleChange("calefaccion", text)}
        />

        <Text style={styles.inputLabel}>Mascotas</Text>
        <CustomInput
            big
            placeholder="Mascotas que tenga el paciente..."
            value={formData.mascotas}
            onChangeText={(text) => handleChange("mascotas", text)}
        />

        <Text style={styles.inputLabel}>Otros</Text>
        <CustomInput
            big
            placeholder="Otras caracteristicas extras a agregar..."
            value={formData.otro}
            onChangeText={(text) => handleChange("otro", text)}
        />

      </View>

      {/* Botones al final */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: "#ccc" }]}
          onPress={() => {
            Alert.alert(
              "Confirmar",
              "¿Seguro que quieres cancelar?",
              [
                { text: "No", style: "cancel" },
                { text: "Sí", onPress: () => retroceder() }
              ]
            );
          }}
        >
          <Text style={styles.actionButtonText}>Cancelar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: Colors.primary }]}
          onPress={() => {
            const faltantes = validarCamposObligatorios(formData);
            if (faltantes.length > 0) {
              Alert.alert(
                "Campos faltantes",
                faltantes.map(f => `• ${f}`).join("\n")
              );
              return;
            }

            Alert.alert(
              "Confirmar",
              "¿Seguro que quieres guardar esta historia?",
              [
                { text: "No", style: "cancel" },
                { text: "Sí", onPress: () => guardarDatos() }
              ]
            );
          }}
        >
          <Text style={[styles.actionButtonText, { color: "white" }]}>Aceptar</Text>
        </TouchableOpacity>
      </View>
      
    </ScrollView>
    </>
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 40,
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