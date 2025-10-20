import { initDatabases } from "@/db/init_databases";
import { HistoriaClinicaListadoModel } from "@/models/historia_clinica_model";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Index() {

  const [listadoHistorias, setListadoHistorias] = useState<HistoriaClinicaListadoModel[]>([])





  useEffect(() => {
    initDatabases()
  }, []);

  //asd





  return (
    <View style={styles.container}>
      <Text> View de las historias clinicas que existan </Text>
    </View>
  );
}





const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
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
    backgroundColor: '#4CAF50',
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

