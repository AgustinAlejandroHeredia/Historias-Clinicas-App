import * as SQLite from 'expo-sqlite';

// opens db
/*
export const openDatabase = async () => {
    try {
        const db = await SQLite.openDatabaseAsync('database.db')
        if (!db) throw new Error('No se pudo abrir la base de datos.')
        return db
    } catch (error) {
        console.error('Error abriendo la base de datos. Archivo database.ts.', error)
        throw error
    }
}
*/

let database: SQLite.SQLiteDatabase | null = null;

export const openDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
    try {
        if (!database) {
            database = await SQLite.openDatabaseAsync('database.db');
            console.log('Base de datos abierta correctamente');
        }
        return database;
    } catch (error) {
        console.error('Error abriendo la base de datos:', error);
        throw error;
    }
}

// ejecutar solo para resetear completamente la DB, solo debug
export const resetDatabase = async (): Promise<void> => {
    try {
        const db = await openDatabase()
        await db.execAsync('DROP TABLE IF EXISTS pariente')
        await db.execAsync('DROP TABLE IF EXISTS padres')
        await db.execAsync('DROP TABLE IF EXISTS historia_clinica_comun')
        await db.execAsync('DROP TABLE IF EXISTS lt_items')

        console.log(' ---- Base de datos reseteada con exito. ---- ✅')
    } catch (error) {
        console.error(' ---- Error reseteando la DB: ', error, ' ---- ❌')
    }
}

export interface DatabaseResult {
    success: boolean;
    error?: string;
    message?: string;
}