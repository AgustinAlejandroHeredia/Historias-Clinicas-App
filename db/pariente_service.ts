import { openDatabase } from './database';

export const initDatabasePariente = async () => {
    try {

        const db = openDatabase();
        (await db).execAsync(`
            CREATE TABLE IF NOT EXISTS pariente (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nota TEXT NOT NULL,
                FOREING KEY (historia_clinica_comun_id) REFERENCES historia_clinica_comun(id) ON DELETE CASCADE
            );
        `);
        
    } catch (error) {
        console.log('Error inicializando la base de datos en hijo_service.ts.')
        throw error
    }
}