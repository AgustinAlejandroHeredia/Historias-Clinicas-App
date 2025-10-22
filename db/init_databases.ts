import { initDatabaseHistoriaClinica } from "./historia_clinica_service";
import { initDatabaseLineaTiempoItem } from "./linea_tiempo_item_service";
import { initDatabasePariente } from "./pariente_service";

export const initDatabases = async () => {
    try {

        console.log("Inicializando tablas...")

        await initDatabaseHistoriaClinica();
        await initDatabasePariente();
        await initDatabaseLineaTiempoItem();

        console.log("Bases de datos inicializada con exito.")

    } catch (error) {
        console.error("Error al inicializar las tablas: ", error)
    }
}