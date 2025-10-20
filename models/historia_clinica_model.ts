import { DatabaseResult } from "@/db/database";

export interface HistoriaClinicaComunModel {
    id?: number;
    fecha_creacion?: string;
    
    nombre: string;
    dni?: number;
    edad: number;
    sexo: string;
    estado_civil: string;
    l_nacimiento: string;
    l_residencia: string;
    ocupacion: string;
    motivo_consulta: string;
    
    narracion: string;
    
    antecedentes_enfermedad: string;
    antecedentes_fisiologicos: string;
    antecedentes_patologicos: string;
    antecedentes_quirurgicos: string;
    antecedentes_farmacologicos: string;
    
    madre_vive: boolean;
    madre_causa_fallecimiento?: string;
    madre_enfermedad?: string;
    
    padre_vive: boolean;
    padre_causa_fallecimiento?: string;
    padre_enfermedad?: string;
    
    hijos: number;
    hermanos: number;
    
    h_alimentacion: string;
    h_diuresis: string;
    h_catarsis: string;
    h_sueño: string;
    h_alcohol_tabaco: string;
    h_infusiones: string;
    h_farmacos: string;
    
    obra_social: string;
    material_casa: string;
    electicidad: boolean;
    agua: boolean;
    toilet_privado: boolean;
    calefaccion: string;
    mascotas: string;
    otro: string;
}

export interface HistoriaClinicaComunSQLResult {
    id: number;
    fecha_creacion: string;
    nombre: string;
    dni: number | null;
    edad: number;
    sexo: string;
    estado_civil: string;
    l_nacimiento: string;
    l_residencia: string;
    ocupacion: string;
    motivo_consulta: string;
    narracion: string;
    antecedentes_enfermedad: string;
    antecedentes_fisiologicos: string;
    antecedentes_patologicos: string;
    antecedentes_quirurgicos: string;
    antecedentes_farmacologicos: string;
    madre_vive: number;
    madre_causa_fallecimiento: string | null;
    madre_enfermedad: string | null;
    padre_vive: number;
    padre_causa_fallecimiento: string | null;
    padre_enfermedad: string | null;
    hijos: number;
    hermanos: number;
    h_alimentacion: string;
    h_diuresis: string;
    h_catarsis: string;
    h_sueño: string;
    h_alcohol_tabaco: string;
    h_infusiones: string;
    h_farmacos: string;
    obra_social: string;
    material_casa: string;
    electicidad: number;
    agua: number;
    toilet_privado: number;
    calefaccion: string;
    mascotas: string;
    otro: string;
}

export interface HistoriaClinicaListadoModel {
    id: number;
    fecha_creacion?: string;
    nombre: string;
    motivo_consulta: string;
}

export interface HistoriaClinicaComunResult extends DatabaseResult {
    data?: HistoriaClinicaComunModel | HistoriaClinicaComunModel[];
    id?: number;
    changes?: number;
    message?: string;
}

export interface HistoriaClinicaComunListadoResult extends DatabaseResult {
    data?: HistoriaClinicaListadoModel[];
    count?: number;
}