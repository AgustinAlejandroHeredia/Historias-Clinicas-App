/*
import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    <View style={styles.view}>
      <Text> View de las historias clinicas que existan </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  }
})
*/

// index.tsx
import { agregarHistoriaClinica, eliminarHistoriaClinica, obtenerHistoriasClinicas } from '@/db/historia_clinica_service';
import { initDatabases } from '@/db/init_databases';
import { HistoriaClinicaComunResult, HistoriaClinicaListadoModel } from '@/models/historia_clinica_model';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Button, FlatList, StyleSheet, Text, View } from 'react-native';

const HistoriaClinicaTestScreen: React.FC = () => {
  const [listadoHistorias, setListadoHistorias] = useState<HistoriaClinicaListadoModel[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [eliminando, setEliminando] = useState<number | null>(null);

  useEffect(() => {
    initDatabases();
    cargarListado();
  }, []);

  const cargarListado = async (): Promise<void> => {
    try {
      setCargando(true);
      setError(null);
      
      // Obtener el listado
      const resultado = await obtenerHistoriasClinicas();
      
      if (resultado.success && resultado.data) {
        setListadoHistorias(resultado.data);
      } else {
        setError(resultado.error || 'Error al cargar el listado');
      }
    } catch (err) {
      setError('Error inesperado: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setCargando(false);
    }
  };

  const agregarHistoriaEjemplo = async (): Promise<void> => {
    try {
      const historiaEjemplo = {
        nombre: 'Paciente de Ejemplo',
        dni: 12345678,
        edad: 35,
        sexo: 'Masculino',
        estado_civil: 'Casado',
        l_nacimiento: 'Buenos Aires',
        l_residencia: 'CABA',
        ocupacion: 'Ingeniero',
        motivo_consulta: 'Control rutinario',
        narracion: 'Paciente se presenta para control médico de rutina...',
        antecedentes_enfermedad: 'Ninguno',
        antecedentes_fisiologicos: 'Desarrollo normal',
        antecedentes_patologicos: 'Ninguno',
        antecedentes_quirurgicos: 'Ninguno',
        antecedentes_farmacologicos: 'Ninguno',
        madre_vive: true,
        padre_vive: true,
        hijos: 2,
        hermanos: 1,
        h_alimentacion: 'Balanceada',
        h_diuresis: 'Normal',
        h_catarsis: 'Regular',
        h_sueño: '7-8 horas',
        h_alcohol_tabaco: 'Ocasional',
        h_infusiones: 'Café',
        h_farmacos: 'Ninguno',
        obra_social: 'OSDE',
        material_casa: 'Ladrillo',
        electicidad: true,
        agua: true,
        toilet_privado: true,
        calefaccion: 'Gas',
        mascotas: 'Perro',
        otro: 'Ninguno'
      };

      const resultado: HistoriaClinicaComunResult = await agregarHistoriaClinica(historiaEjemplo);
      
      if (resultado.success) {
        console.log('✅ Historia de ejemplo agregada con ID:', resultado.id);
        // Recargar el listado
        await cargarListado();
      } else {
        setError('Error al agregar historia: ' + resultado.error);
      }
    } catch (err) {
      setError('Error al agregar historia: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  const eliminarHistoria = async (id: number, nombre: string): Promise<void> => {
    // Confirmación antes de eliminar
    Alert.alert(
      'Confirmar eliminación',
      `¿Estás seguro de que quieres eliminar la historia clínica de "${nombre}"?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              setEliminando(id);
              
              const resultado = await eliminarHistoriaClinica(id);
              
              if (resultado.success) {
                console.log('✅ Historia eliminada exitosamente');
                await cargarListado();
              } else {
                setError('Error al eliminar historia: ' + resultado.error);
              }
            } catch (err) {
              setError('Error al eliminar historia: ' + (err instanceof Error ? err.message : String(err)));
            } finally {
              setEliminando(null);
            }
          }
        }
      ]
    );
  };

  const renderItem = ({ item }: { item: HistoriaClinicaListadoModel }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.nombre}>{item.nombre}</Text>
      <Text style={styles.detalles}>Motivo: {item.motivo_consulta}</Text>
      <Text style={styles.fecha}>
        Creado: {item.fecha_creacion 
          ? new Date(item.fecha_creacion).toLocaleDateString('es-ES') + ' ' + 
            new Date(item.fecha_creacion).toLocaleTimeString('es-ES')
          : 'Fecha no disponible'
        }
      </Text>
      
      <View style={styles.botonesContainer}>
        <Button 
          title={eliminando === item.id ? "Eliminando..." : "Eliminar"} 
          onPress={() => eliminarHistoria(item.id, item.nombre)} 
          color="#ff4444"
          disabled={eliminando === item.id}
        />
      </View>
    </View>
  );

  if (cargando) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.mensaje}>Cargando historias clínicas...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.error}>Error: {error}</Text>
        <Button title="Reintentar" onPress={cargarListado} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Listado de Historias Clínicas</Text>
      
      <View style={styles.botonesSuperiores}>
        <Button title="Recargar" onPress={cargarListado} />
        <Button title="Agregar Ejemplo" onPress={agregarHistoriaEjemplo} />
      </View>

      <Text style={styles.contador}>
        Total: {listadoHistorias.length} historia(s)
      </Text>

      {listadoHistorias.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.mensaje}>No hay historias clínicas para mostrar</Text>
          <Text style={styles.submensaje}>
            Presiona "Agregar Ejemplo" para crear una historia de prueba
          </Text>
        </View>
      ) : (
        <FlatList
          data={listadoHistorias}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          style={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  botonesSuperiores: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  contador: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
    color: '#666',
  },
  list: {
    flex: 1,
  },
  itemContainer: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  nombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  detalles: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  fecha: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
    marginBottom: 10,
  },
  botonesContainer: {
    marginTop: 10,
  },
  mensaje: {
    fontSize: 18,
    textAlign: 'center',
    color: '#666',
    marginBottom: 10,
  },
  submensaje: {
    fontSize: 14,
    textAlign: 'center',
    color: '#999',
    fontStyle: 'italic',
  },
  error: {
    fontSize: 16,
    textAlign: 'center',
    color: 'red',
    marginBottom: 20,
  },
});

export default HistoriaClinicaTestScreen;