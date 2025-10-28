
import { obtenerHistoriaClinicaCompletaPorId } from '@/db/historia_clinica_service'
import { obtenerItemsPorHistoriaId } from '@/db/linea_tiempo_item_service'
import { obtenerParientesPorHistoria } from '@/db/pariente_service'
import { HistoriaClinicaComunModel, HistoriaClinicaComunResult } from '@/models/historia_clinica_model'
import { ItemListaResult, ItemModel, ItemResult } from '@/models/lt_item_model'
import { ParienteListaResult, ParienteModel, ParienteResultRoles, ParientesListasRolesModel } from '@/models/pariente_model'
import { generatePDF } from 'react-native-html-to-pdf'
import { HistoriaCompleta, HistoriaCompletaResponse, PDFGenerationResult } from './pdf_models'

const generarVistaPDF = async (id: string) => {
    const datos : HistoriaCompletaResponse = await obtenerDatos(id)
    if(!datos.success){
        throw new Error('generarVistaPDF : error al obtener los datos')
    }
    return `
    
    `
}

export const generarPDF = async (id: string, nombre: string): Promise<PDFGenerationResult> => {
    try{

        const options = {
            html: await generarVistaPDF(id),
            filename: sanitizeFileName(nombre),
            directory: 'Documents',
            base64: true,
        }

        const result = await generatePDF(options)

        if(result.filePath){
            console.log(' pdf_service : pdf de historia clinica generada exitosamente en la ruta ', result.filePath, ' ✅')
            return {
                success: true,
                filepath: result.filePath,
                base64: result.base64
            }
        }else{
            throw new Error('No se pudo generar el pdf')
        }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error desconocido'
        }
    }
}

const sanitizeFileName = (nombre: string): string => {
    let sanitized = nombre.replace(/\.pdf$/i, '')
    sanitized = sanitized.replace(/[<>:"/\\|?*]/g, '_')
    if (sanitized.length > 100) {
      sanitized = sanitized.substring(0, 50);
    }
    return `${sanitized}.pdf`
}

const obtenerHistoria = async (id: number): Promise<HistoriaClinicaComunResult> => {
    const response : HistoriaClinicaComunResult = await obtenerHistoriaClinicaCompletaPorId(id)
    if(!response.success) {
        throw new Error("create : Error obteniendo historia clinica ❌ ")
    }
    return response
}

const obtenerParientes = async (id: number): Promise<ParienteResultRoles> => {
    try {
        const response: ParienteListaResult = await obtenerParientesPorHistoria(id)

        if (!response.success) {
        throw new Error("create: Error obteniendo parientes ❌")
        }

        const parientes: ParienteModel[] = response.data as ParienteModel[] || []

        const hijos = parientes.filter(p => p.tipo === "hijo")
        const hermanos = parientes.filter(p => p.tipo === "hermano")

        const data : ParientesListasRolesModel = {
            hijos: hijos,
            hermanos: hermanos,
        }

        return {
            success: true,
            data: data
        }

    } catch (error) {
        return {
            success: false,
        }
    }
}


const obtenerItems = async (id: number): Promise<ItemResult> => {
    try{
        const response : ItemListaResult = await obtenerItemsPorHistoriaId(id)
        if(!response.success) {
            throw new Error("create : Error obteniendo items ❌ ")
        }
        // ordena la lista por fechas
        const itemsOrdenados = (response.data as ItemModel[]).sort((a, b) => {
            const [diaA, mesA, anioA] = a.fecha.split("/").map(Number);
            const [diaB, mesB, anioB] = b.fecha.split("/").map(Number);

            const dateA = new Date(anioA, mesA - 1, diaA);
            const dateB = new Date(anioB, mesB - 1, diaB);

            return dateA.getTime() - dateB.getTime();
        })
        return {
            success: true,
            data: itemsOrdenados
        }
        
    } catch (error){
        return {
            success: false,
        }
    }
}

const obtenerDatos = async (id: string): Promise<HistoriaCompletaResponse> => {
    try{

        const idNum = Number(id)

        const historia : HistoriaClinicaComunResult = await obtenerHistoria(idNum) 
        const historiaData = historia.data as HistoriaClinicaComunModel

        const parientes : ParienteResultRoles = await obtenerParientes(idNum)
        const parientesData = parientes.data as ParientesListasRolesModel

        const items : ItemResult = await obtenerItems(idNum)
        const itemsData = items.data as ItemModel[]

        const dataComleta : HistoriaCompleta = {

            fecha_creacion: historiaData.fecha_creacion!,
            
            nombre: historiaData.nombre,
            dni: historiaData.dni,
            edad: historiaData.edad,
            sexo: historiaData.edad,
            estado_civil: historiaData.estado_civil,
            l_nacimiento: historiaData.l_nacimiento,
            l_residencia: historiaData.l_residencia,
            ocupacion: historiaData.ocupacion,
            motivo_consulta: historiaData.motivo_consulta,
            
            narracion: historiaData.narracion,
            
            antecedentes_enfermedad: historiaData.antecedentes_enfermedad,

            alergias: historiaData.alergias,

            antecedentes_fisiologicos: historiaData.antecedentes_fisiologicos,
            antecedentes_patologicos: historiaData.antecedentes_patologicos,
            antecedentes_quirurgicos: historiaData.antecedentes_quirurgicos,
            antecedentes_farmacologicos: historiaData.antecedentes_farmacologicos,
            
            madre_vive: historiaData.madre_vive,
            madre_causa_fallecimiento: historiaData.madre_causa_fallecimiento,
            madre_enfermedad: historiaData.madre_enfermedad,
            
            padre_vive: historiaData.padre_vive,
            padre_causa_fallecimiento: historiaData.padre_causa_fallecimiento,
            padre_enfermedad: historiaData.padre_enfermedad,
            
            h_alimentacion: historiaData.h_alimentacion,
            h_diuresis: historiaData.h_diuresis,
            h_catarsis: historiaData.h_catarsis,
            h_sueño: historiaData.h_sueño,
            h_alcohol_tabaco: historiaData.h_alcohol_tabaco,
            h_infusiones: historiaData.h_infusiones,
            h_farmacos: historiaData.h_farmacos,
            
            obra_social: historiaData.obra_social,
            material_casa: historiaData.material_casa,
            electricidad: historiaData.electricidad,
            agua: historiaData.agua,
            toilet_privado: historiaData.toilet_privado,
            calefaccion: historiaData.calefaccion,
            mascotas: historiaData.mascotas,
            otro: historiaData.otro,

            hijos: parientesData.hijos || [],
            hermanos: parientesData.hermanos || [],

            linea_tiempo: itemsData
        }

        return {
            success: true,
            data: dataComleta,
        }
    } catch (error) {
        return {
            success: false,
        }
    }
}