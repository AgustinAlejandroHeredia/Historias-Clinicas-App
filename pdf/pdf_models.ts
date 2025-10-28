import { ItemModel } from "@/models/lt_item_model";
import { ParienteModel } from "@/models/pariente_model";

export interface PDFOptions {
    html: string,
    filename: string,
    directory?: string,
    base64?: boolean
}

export interface PDFResponse {
    filepath?: string,
    base64?: string,
    error?: string
}

export interface PDFGenerationResult {
    success: boolean,
    filepath?: string,
    base64?: string,
    error?: string,
}

export interface HistoriaCompletaResponse {
    success: boolean;
    data?: HistoriaCompleta;
}

export interface HistoriaCompleta {

    fecha_creacion: string;
    
    nombre: string;
    dni?: string;
    edad: string;
    sexo: string;
    estado_civil?: string;
    l_nacimiento: string;
    l_residencia: string;
    ocupacion: string;
    motivo_consulta: string;

    linea_tiempo: ItemModel[]
    
    narracion?: string;
    
    antecedentes_enfermedad: string;

    alergias: string,

    antecedentes_fisiologicos: string;
    antecedentes_patologicos: string;
    antecedentes_quirurgicos: string;
    antecedentes_farmacologicos: string;
    
    madre_vive?: string;
    madre_causa_fallecimiento?: string;
    madre_enfermedad?: string;
    
    padre_vive?: string;
    padre_causa_fallecimiento?: string;
    padre_enfermedad?: string;
    
    // hijos
    hijos: ParienteModel[];

    // hermanos
    hermanos: ParienteModel[];
    
    h_alimentacion?: string;
    h_diuresis?: string;
    h_catarsis?: string;
    h_sueño?: string;
    h_alcohol_tabaco?: string;
    h_infusiones?: string;
    h_farmacos?: string;
    
    obra_social?: string;
    material_casa?: string;
    electricidad?: string;
    agua?: string;
    toilet_privado?: string;
    calefaccion?: string;
    mascotas?: string;
    otro?: string;
}