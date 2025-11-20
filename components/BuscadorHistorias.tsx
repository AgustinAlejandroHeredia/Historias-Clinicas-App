import { HistoriaClinicaListadoModel } from "@/models/historia_clinica_model"
import React, { useEffect, useState } from "react"
import { StyleSheet, TextInput, View } from "react-native"

interface BuscadorHistoriasProps {
  historias: HistoriaClinicaListadoModel[]
  onFiltrar: (resultados: HistoriaClinicaListadoModel[]) => void
}

export default function BuscadorHistorias({ historias, onFiltrar }: BuscadorHistoriasProps) {
  const [busqueda, setBusqueda] = useState("")

  useEffect(() => {
    const texto = busqueda.toLowerCase().trim()

    if (!texto) {
      onFiltrar(historias);
      return
    }

    const filtradas = historias
      .filter((h) => {
        const nombre = (h.nombre ?? "").toLowerCase()
        const fecha = (h.fecha_creacion ?? "").toLowerCase()
        return nombre.includes(texto) || fecha.includes(texto)
      })
      .sort((a, b) => (b.fecha_creacion ?? "").localeCompare(a.fecha_creacion ?? ""))

    onFiltrar(filtradas)
  }, [busqueda, historias])

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Buscar por nombre o fecha..."
        placeholderTextColor='#666'
        value={busqueda}
        onChangeText={setBusqueda}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 40,
    backgroundColor: "white",
  },
})