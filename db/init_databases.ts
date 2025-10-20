import { initDatabaseHistoriaClinica } from "./historia_clinica_service";
import { initDatabasePadres } from "./padres_service";
import { initDatabasePariente } from "./pariente_service";

export const initDatabases = async () => {
    try {

        await initDatabaseHistoriaClinica();
        await initDatabasePariente();
        await initDatabasePadres();

        console.log("Bases de datos inicializadas con exito.")

    } catch (error) {
        console.error("Error al inicializar las tablas: ", error)
    }
}