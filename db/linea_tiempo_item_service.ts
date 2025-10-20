import { openDatabase } from './database';

const initDatabaseLineaTiempoItem = async () => {
    try {

        const db = openDatabase();
        (await db).execAsync(`
            CREATE TABLE IF NOT EXISTS lt_item (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                fecha TEXT NOT NULL,
                descripcion TEXT NOT NULL,
                FOREING KEY (historia_clinica_comun_id) REFERENCES historia_clinica_comun(id) ON DELETE CASCADE
            );
        `);
        
    } catch (error) {
        console.log('Error inicializando la base de datos en linea_tiempo_item_service.ts.')
        throw error
    }
}