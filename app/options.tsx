import { CustomInput } from "@/components/CustomInput";
import { Colors, cambiarColor } from "@/theme/colors";
import { Stack, useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

import { useState } from "react";

export default function Index() {

    const router = useRouter()

    const [colorPrincipal, setColorPrincipal] = useState(Colors.primary)
    const [inputNuevoColor, setInputNuevoColor] = useState("")

    const retrocederOpciones = () => {
        if (router.canGoBack()) {
        router.back();
        } else {
        router.replace("/");
        }
    }

    const doNothing = () => {}

    const optionsCambiarColor = (colorNuevo: string) => {
        setColorPrincipal(colorNuevo)
        cambiarColor(colorNuevo)
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} edges={['left', 'right', 'bottom']}>
            <Stack.Screen
                options={{
                title: "Opciones",
                headerBackVisible: false, // se elimina la flecha de retroceso
                headerShown: true,
                }}
            />

            <View style={styles.container}>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Color principal de la aplicación</Text>
                    <Text style={styles.inputLabel}>Color hexadecimal</Text>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: '#fff'
                    }}>
                        <CustomInput
                            placeholder="Ejemplo : #aa55c6"
                            placeholderTextColor='#666'
                            value={inputNuevoColor}
                            onChangeText={(codigoColor) => setInputNuevoColor(codigoColor)}
                            style={{ flex: 1, paddingVertical: 8, marginRight: 15 }}
                        />

                        <TouchableOpacity onPress={() => optionsCambiarColor(inputNuevoColor)} style={{ paddingBottom: 9 }}>
                            <FontAwesome6 name="pencil" size={24} color="black" />
                        </TouchableOpacity>

                    </View>

                    <View style={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: '#fff'
                    }}>
                        <TouchableOpacity style={styles.botonEjemplo}>
                            <Text>Color actual</Text>
                        </TouchableOpacity>
                    </View>

                </View>

            </View>

        </SafeAreaView>
    )
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
    addButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: Colors.primary,
        justifyContent: "center",
        alignItems: "center",
    },
    inputLabel: {
        fontSize: 12,
        color: "#666",
        marginBottom: 4,
    },
    actionButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: "center",
        marginHorizontal: 5,
    },
    botonEjemplo: {
        backgroundColor: Colors.primary,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 10,
        marginRight: 10,
        marginVertical: 10,
    },
})