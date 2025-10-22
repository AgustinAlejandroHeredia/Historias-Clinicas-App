import { HistoriaClinicaComunListadoResult, HistoriaClinicaComunModel, HistoriaClinicaComunResult, HistoriaClinicaListadoModel } from '@/models/historia_clinica_model';
import { openDatabase } from './database';

export const initDatabaseHistoriaClinica = async () => {
    try {

        const db = await openDatabase();
        (await db).execAsync(`
            CREATE TABLE IF NOT EXISTS historia_clinica_comun (

                id INTEGER PRIMARY KEY AUTOINCREMENT,

                fecha_creacion TEXT DEFAULT (datetime('now')),

                nombre TEXT NOT NULL,
                dni TEXT NOT NULL,
                edad TEXT NOT NULL,
                sexo TEXT NOT NULL,
                estado_civil TEXT NOT NULL,
                l_nacimiento TEXT NOT NULL,
                l_residencia TEXT NOT NULL,
                ocupacion TEXT NOT NULL,
                motivo_consulta TEXT NOT NULL,

                narracion TEXT NOT NULL,

                antecedentes_enfermedad TEXT NOT NULL,

                alergias TEXT NOT NULL,

                antecedentes_fisiologicos TEXT NOT NULL,
                antecedentes_patologicos TEXT NOT NULL,
                antecedentes_quirurgicos TEXT NOT NULL,
                antecedentes_farmacologicos TEXT NOT NULL,

                madre_vive TEXT NOT NULL,
                madre_causa_fallecimiento TEXT,
                madre_enfermedad TEXT,

                padre_vive TEXT NOT NULL,
                padre_causa_fallecimiento TEXT,
                padre_enfermedad TEXT,

                hijos TEXT DEFAULT '0',
                hermanos TEXT DEFAULT '0',

                h_alimentacion TEXT NOT NULL,
                h_diuresis TEXT NOT NULL,
                h_catarsis TEXT NOT NULL,
                h_sueño TEXT NOT NULL,
                h_alcohol_tabaco TEXT NOT NULL,
                h_infusiones TEXT NOT NULL,
                h_farmacos TEXT NOT NULL,

                obra_social TEXT NOT NULL,
                material_casa TEXT NOT NULL,
                electricidad TEXT NOT NULL,
                agua TEXT NOT NULL,
                toilet_privado TEXT NOT NULL,
                calefaccion TEXT NOT NULL,
                mascotas TEXT NOT NULL,
                otro TEXT NOT NULL
            );
        `);

        console.log('Tabla historia_clinica ✅')

    } catch (error) {
        console.log('Error inicializando la base de datos en historia_clinica_service.ts.')
        throw error
    }
}

export const agregarHistoriaClinica = async (
    // params
    historiaData: Omit<HistoriaClinicaComunModel, 'id' | 'fecha_creacion'>
): Promise<HistoriaClinicaComunResult> => {
    try {
        const db = await openDatabase();
        const result = await db.runAsync(`
            INSERT INTO historia_clinica_comun (
                nombre,
                dni,
                edad,
                sexo,
                estado_civil, 
                l_nacimiento, 
                l_residencia, 
                ocupacion, 
                motivo_consulta, 
                narracion, 
                antecedentes_enfermedad,
                alergias,
                antecedentes_fisiologicos, 
                antecedentes_patologicos, 
                antecedentes_quirurgicos, 
                antecedentes_farmacologicos, 
                madre_vive, 
                madre_causa_fallecimiento, 
                madre_enfermedad,
                padre_vive, 
                padre_causa_fallecimiento, 
                padre_enfermedad, 
                hijos, 
                hermanos,
                h_alimentacion, 
                h_diuresis, 
                h_catarsis, 
                h_sueño, 
                h_alcohol_tabaco, 
                h_infusiones, 
                h_farmacos,
                obra_social, 
                material_casa, 
                electricidad, 
                agua, 
                toilet_privado, 
                calefaccion, 
                mascotas, 
                otro
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
            [
                historiaData.nombre,
                historiaData.dni || "",
                historiaData.edad,
                historiaData.sexo,
                historiaData.estado_civil,
                historiaData.l_nacimiento,
                historiaData.l_residencia,
                historiaData.ocupacion,
                historiaData.motivo_consulta,
                historiaData.narracion,
                historiaData.antecedentes_enfermedad,
                historiaData.alergias,
                historiaData.antecedentes_fisiologicos,
                historiaData.antecedentes_patologicos,
                historiaData.antecedentes_quirurgicos,
                historiaData.antecedentes_farmacologicos,
                historiaData.madre_vive,
                historiaData.madre_causa_fallecimiento || null,
                historiaData.madre_enfermedad || null,
                historiaData.padre_vive,
                historiaData.padre_causa_fallecimiento || null,
                historiaData.padre_enfermedad || null,
                historiaData.hijos,
                historiaData.hermanos,
                historiaData.h_alimentacion,
                historiaData.h_diuresis,
                historiaData.h_catarsis,
                historiaData.h_sueño,
                historiaData.h_alcohol_tabaco,
                historiaData.h_infusiones,
                historiaData.h_farmacos,
                historiaData.obra_social,
                historiaData.material_casa,
                historiaData.electricidad,
                historiaData.agua,
                historiaData.toilet_privado,
                historiaData.calefaccion,
                historiaData.mascotas,
                historiaData.otro
            ]
        );
        console.log('Historia clinica agregada con ID :', result.lastInsertRowId)
        return {
            success: true,
            id: result.lastInsertRowId
        }

    } catch (error) {
        console.error("Error al agregar elemento a la tabla historia_clinica_comun", error)
        return {
            success: false,
        }
    }
}

// historias clinicas recortadas para el listado en home o index
export const obtenerHistoriasClinicas = async (): Promise<HistoriaClinicaComunListadoResult> => {
    try {

        const db = await openDatabase()

        const historias = await db.getAllAsync(
            'SELECT id, fecha_creacion, nombre, motivo_consulta FROM historia_clinica_comun ORDER BY fecha_creacion DESC'
        )

        console.log("historia_clinica_servise : Exito al obtener listado de historias clinicas comunes (presentacion index).")

        return {
            success: true,
            data: historias as HistoriaClinicaListadoModel[],
            count: historias.length
        }

    } catch (error) {
        console.error("historia_clinica_service : Error al obtener el listado de las historias clinicas: ", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error',
            data: [],
            count: 0
        }
    }
}

export const obtenerHistoriaClinicaCompletaPorId = async (id:number): Promise<HistoriaClinicaComunResult> => {
    try {
        const db = await openDatabase()

        const historia = await db.getFirstAsync(
            'SELECT * FROM historia_clinica_comun WHERE id = ?',
            [id]
        ) as HistoriaClinicaComunModel | null;

        if(!historia){
            return {
                success: false,
                error: 'No se encontro la historia buscada.'
            };
        }

        /*
        const historiaFormateada: HistoriaClinicaComunModel = {
            id: historia.id,
            fecha_creacion: historia.fecha_creacion,
            nombre: historia.nombre,
            dni: historia.dni,
            edad: historia.edad,
            sexo: historia.sexo,
            estado_civil: historia.estado_civil,
            l_nacimiento: historia.l_nacimiento,
            l_residencia: historia.l_residencia,
            ocupacion: historia.ocupacion,
            motivo_consulta: historia.motivo_consulta,
            narracion: historia.narracion,
            antecedentes_enfermedad: historia.antecedentes_enfermedad,
            alergias: historia.alergias,
            antecedentes_fisiologicos: historia.antecedentes_fisiologicos,
            antecedentes_patologicos: historia.antecedentes_patologicos,
            antecedentes_quirurgicos: historia.antecedentes_quirurgicos,
            antecedentes_farmacologicos: historia.antecedentes_farmacologicos,
            madre_vive: historia.madre_vive,
            madre_causa_fallecimiento: historia.madre_causa_fallecimiento || undefined,
            madre_enfermedad: historia.madre_enfermedad || undefined,
            padre_vive: historia.padre_vive,
            padre_causa_fallecimiento: historia.padre_causa_fallecimiento || undefined,
            padre_enfermedad: historia.padre_enfermedad || undefined,
            hijos: historia.hijos,
            hermanos: historia.hermanos,
            h_alimentacion: historia.h_alimentacion,
            h_diuresis: historia.h_diuresis,
            h_catarsis: historia.h_catarsis,
            h_sueño: historia.h_sueño,
            h_alcohol_tabaco: historia.h_alcohol_tabaco,
            h_infusiones: historia.h_infusiones,
            h_farmacos: historia.h_farmacos,
            obra_social: historia.obra_social,
            material_casa: historia.material_casa,
            electricidad: historia.electricidad,
            agua: historia.agua,
            toilet_privado: historia.toilet_privado,
            calefaccion: historia.calefaccion,
            mascotas: historia.mascotas,
            otro: historia.otro
        };
        */

        console.log('Exito al obtener la historia clinica con ID ', id, '.');

        return {
            success: true,
            data: historia
        }

    } catch (error) {
        console.error('Error obteniendo la historia clinica con ID ', id, ': ', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error'
        }
    }
}

export const eliminarHistoriaClinica = async (id:number): Promise<HistoriaClinicaComunResult> => {
    try {

        const db = await openDatabase()

        const result = await db.runAsync(
            'DELETE FROM historia_clinica_comun WHERE id = ?',
            [id]
        )

        if(result.changes === 0){
            return {
                success: false,
                error: 'No se encontro la historia clinica a eliminar.'
            }
        }

        console.log('Exito al eliminar la historia clinica con ID ', id, '.')
        return {
            success: true,
            changes: result.changes,
            message: 'Historia clinica eliminada exitosamente, id: ', id
        }

    } catch (error) {
        console.error("Error al eliminar la historia clinica con id ", id, ".")
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error desconocido'
        }
    }
}