import { PadreListaModel, PadreListaResult, PadreModel, PadreResult } from '@/models/padres_model';
import { openDatabase } from './database';

export const initDatabasePadres = async() => {
    try {

        const db = await openDatabase();
        (await db).execAsync(`
            CREATE TABLE IF NOT EXISTS padres (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                vive TEXT NOT NULL,
                fallecimiento TEXT NOT NULL,
                enfermedad TEXT NOT NULL,
                tipo TEXT NOT NULL,
                historia_clinica_comun_id INTEGER NOT NULL,
                FOREIGN KEY (historia_clinica_comun_id) REFERENCES historia_clinica_comun(id) ON DELETE CASCADE
            )
        `)
        console.log("Tabla padres ✅")

    } catch (error) {
        console.error("Error al inicializar la base de datos de padres")
        throw error
    }
}

export const agregarPadre = async (
    padreData: Omit<PadreModel, 'id'>
): Promise<PadreResult> => {

    try {

        const db = await openDatabase();
        const result = await db.runAsync(`
            INSERT INTO padres (
                vive,
                fallecimiento,
                enfermedad,
                historia_clinica_comun_id
            ) VALUES (?, ?, ?)    
        `,
            [
                padreData.vive,
                padreData.fallecimiento || null,
                padreData.enfermedad || null,
                padreData.historia_clinica_comun_id
            ]
        );
        console.log("Padre agregado exitosamente a la historia con id ", result.lastInsertRowId)
        return {
            success: true,
            id: result.lastInsertRowId
        }

    } catch (error) {
        console.error("Error al agregar padre")
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error'
        }
    }
}

export const obtenerPadrePorHistoria = async (
    historiaClinicaId: number
): Promise<PadreListaResult> => {

    try {

        const db = await openDatabase()
        const result = await db.getAllAsync(
            'SELECT * FROM padres WHERE historia_clinica_comun_id = ?',
            [historiaClinicaId]
        );

        console.log("Parientes obtenidos exitosamente para la historia clinica con id ", historiaClinicaId, ".")
        return {
            success: true,
            data: result as PadreListaModel[]
        }

    } catch (error) {
        console.error("Error al obtener padre con id de historia clinica.")
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error'
        }
    }

}