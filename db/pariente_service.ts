import { ParienteListaModel, ParienteListaResult, ParienteModel, ParienteResult } from '@/models/pariente_model';
import { openDatabase } from './database';

export const initDatabasePariente = async () => {
    try {

        const db = await openDatabase();
        (await db).execAsync(`
            CREATE TABLE IF NOT EXISTS pariente (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nota TEXT NOT NULL,
                tipo TEXT NOT NULL,
                historia_clinica_comun_id INTEGER NOT NULL,
                FOREIGN KEY (historia_clinica_comun_id) REFERENCES historia_clinica_comun(id) ON DELETE CASCADE
            );
        `);
        console.log("Tabla pariente ✅")
        
    } catch (error) {
        console.log('Error inicializando la base de datos en hijo_service.ts.')
        throw error
    }
}

export const agregarPariente = async (
    parienteData: Omit<ParienteModel, 'id'>
): Promise<ParienteResult> => {
    try {

        const db = await openDatabase();
        const result = await db.runAsync(`
            INSERT INTO pariente (
                nota,
                tipo,
                historia_clinica_comun, id
            ) VALUES (?, ?, ?)
        `,
            [
                parienteData.nota,
                parienteData.tipo,
                parienteData.historia_clinica_comun_id
            ]
        );
        console.log("Pariente agregado con ID ", result.lastInsertRowId, ".")
        return {
            success: true,
            id: result.lastInsertRowId
        }

    } catch (error) {
        console.error("Error al agregar un pariente a la tabla (pariente_service.ts)")
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error'
        }
    }
}

export const obtenerParientesPorHistoria = async (
    historiaClinicaId: number
): Promise<ParienteListaResult> => {

    try {

        const db = await openDatabase();
        const result = await db.getAllAsync(
            'SELECT * FROM pariente WHERE historia_clinica_comun_id = ? ORDER BY tipo',
            [historiaClinicaId]
        );

        console.log("Parientes obtenidos exitosamente para la historia clinica con id ", historiaClinicaId, ".")
        return {
            success: true,
            data: result as ParienteListaModel[]
        }

    } catch (error) {
        console.error("Error al obtener pariente con id de historia clinica.")
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error'
        }
    }

}