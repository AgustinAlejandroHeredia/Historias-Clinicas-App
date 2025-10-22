import { ItemListaModel, ItemListaResult, ItemModel, ItemResult } from '@/models/lt_item_model';
import { openDatabase } from './database';

export const initDatabaseLineaTiempoItem = async () => {
    try {

        const db = await openDatabase();
        (await db).execAsync(`
            CREATE TABLE IF NOT EXISTS lt_item (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                fecha TEXT NOT NULL,
                descripcion TEXT NOT NULL,
                historia_clinica_comun_id INTEGER NOT NULL,
                FOREIGN KEY (historia_clinica_comun_id) REFERENCES historia_clinica_comun(id) ON DELETE CASCADE
            );
        `);
        console.log("Tabla lt_item ✅")
        
    } catch (error) {
        console.log('Error inicializando la base de datos en linea_tiempo_item_service.ts.')
        throw error
    }
}

export const agregarLineaTiempoItem = async (
    itemData: Omit<ItemModel, 'id'>
): Promise<ItemResult> => {

    try {

        const db = await openDatabase();
        const result = await db.runAsync(`
            INSERT INTO lt_item (
                fecha,
                descripcion,
                historia_clinica_comun_id
            ) VALUES (?, ?, ?)    
        `,
            [
                itemData.fecha,
                itemData.descripcion,
                itemData.historia_clinica_comun_id
            ]
        );
        console.log("Item agregado exitosamente a la historia con id ", result.lastInsertRowId)
        return {
            success: true,
            id: result.lastInsertRowId
        }

    } catch (error) {
        console.error("Error al agrgar un item nuevo.")
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error'
        }
    }
}

export const obtenerItemsPorHistoriaId = async (
    historiaClinicaId: number
): Promise<ItemListaResult> => {
    
    try {
        
        const db = await openDatabase()
        const result = await db.getAllAsync(
            'SELECT * FROM lt_items WHERE historia_clinica_comun_id = ?',
            [historiaClinicaId]
        );
        
        console.log("Items obtenidos exitosamente para la historia clinica con id ", historiaClinicaId, ".")
        return {
            success: true,
            data: result as ItemListaModel[]
        }

    } catch (error) {
        console.error("Error al obtener un item nuevo con id de historia clinica.")
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error'
        }
    }
}

export const eliminarItemPorId = async (
    id:number
): Promise<ItemResult> => {
    try {

        const db = await openDatabase()

        const result = await db.runAsync(
            'DELETE FROM lt_item WHERE id = ?',
            [id]
        )

        if(result.changes === 0){
            return {
                success: false,
                error: 'No se encontro el item con la id proporcionada.'
            }
        }

        console.log("Exito al eliminar el item con id ", id, " ✅")
        return {
            success: true,
            changes: result.changes,
            message: 'Item eliminado exitosamente ✅'
        }

    } catch (error) {
        console.error("Error al eliminar el item con id ", id, " ❌")
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error desconocido'
        }
    }
}