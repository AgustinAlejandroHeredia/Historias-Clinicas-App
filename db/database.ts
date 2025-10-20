import * as SQLite from 'expo-sqlite';

// opens db
export const openDatabase = async () => {
    try {

        const db = SQLite.openDatabaseAsync('database.db')
        if (!db) throw new Error('No se pudo abrir la base de datos.')
        return db

    } catch (error) {

        console.error('Error abriendo la base de datos. Archivo database.ts.')
        throw error
    }
}

// ejecutar solo para resetear completamente la DB, solo debug
export const resetDatabase = async (): Promise<void> => {
    try {
        const db = await openDatabase()
        await db.execAsync('DROP TABLE IF EXISTS pariente')
        await db.execAsync('DROP TABLE IF EXISTS padres')
        await db.execAsync('DROP TABLE IF EXISTS historia_clinica_comun')

        console.log('Base de datos reseteada con exito.')
    } catch (error) {
        console.error('Error reseteando la DB: ', error)
    }
}

export interface DatabaseResult {
    success: boolean;
    error?: string;
    message?: string;
}