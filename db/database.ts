import * as SQLite from 'expo-sqlite';

// opens db
export const openDatabase = async () => {
    try {

        const db = await SQLite.openDatabaseAsync('database.db')
        return db

    } catch (error) {

        console.error('Error abriendo la base de datos. Archivo database.ts.')
        throw error
    }
}

export interface DatabaseResult {
    success: boolean;
    error?: string;
    message?: string;
}