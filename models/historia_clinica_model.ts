import { DatabaseResult } from "@/db/database";

export interface HistoriaClinicaComunModel {
    id?: number;
    fecha_creacion?: string;
    
    nombre: string;
    dni?: string;
    edad: string;
    sexo: string;
    estado_civil: string;
    l_nacimiento: string;
    l_residencia: string;
    ocupacion: string;
    motivo_consulta: string;
    
    narracion: string;
    
    antecedentes_enfermedad: string;

    alergias: string,

    antecedentes_fisiologicos: string;
    antecedentes_patologicos: string;
    antecedentes_quirurgicos: string;
    antecedentes_farmacologicos: string;
    
    madre_vive: string;
    madre_causa_fallecimiento?: string;
    madre_enfermedad?: string;
    
    padre_vive: string;
    padre_causa_fallecimiento?: string;
    padre_enfermedad?: string;
    
    hijos: string;
    hermanos: string;
    
    h_alimentacion: string;
    h_diuresis: string;
    h_catarsis: string;
    h_sueño: string;
    h_alcohol_tabaco: string;
    h_infusiones: string;
    h_farmacos: string;
    
    obra_social: string;
    material_casa: string;
    electricidad: string;
    agua: string;
    toilet_privado: string;
    calefaccion: string;
    mascotas: string;
    otro: string;
}

export interface HistoriaClinicaComunSQLResult {
    id: number;
    fecha_creacion: string;
    nombre: string;
    dni: string | "";
    edad: string;
    sexo: string;
    estado_civil: string;
    l_nacimiento: string;
    l_residencia: string;
    ocupacion: string;
    motivo_consulta: string;
    narracion: string;
    antecedentes_enfermedad: string;
    alergias: string,
    antecedentes_fisiologicos: string;
    antecedentes_patologicos: string;
    antecedentes_quirurgicos: string;
    antecedentes_farmacologicos: string;
    madre_vive: string;
    madre_causa_fallecimiento: string | "";
    madre_enfermedad: string | "";
    padre_vive: string;
    padre_causa_fallecimiento: string | "";
    padre_enfermedad: string | "";
    hijos: string;
    hermanos: string;
    h_alimentacion: string;
    h_diuresis: string;
    h_catarsis: string;
    h_sueño: string;
    h_alcohol_tabaco: string;
    h_infusiones: string;
    h_farmacos: string;
    obra_social: string;
    material_casa: string;
    electricidad: string;
    agua: string;
    toilet_privado: string;
    calefaccion: string;
    mascotas: string;
    otro: string;
}

export interface HistoriaClinicaComunResult extends DatabaseResult {
    data?: HistoriaClinicaComunModel | HistoriaClinicaComunModel[];
    id?: number;
    changes?: number;
    message?: string;
}

export interface HistoriaClinicaListadoModel {
    id: number;
    fecha_creacion?: string;
    nombre: string;
    motivo_consulta: string;
}

export interface HistoriaClinicaComunListadoResult extends DatabaseResult {
    data?: HistoriaClinicaListadoModel[];
    count?: number;
}

export interface HistoriaClinicaComun_View_Exchange {
    id?: number;
    fecha_creacion?: string;
    nombre: string;
    dni: string;
    edad: string;
    sexo: string;
    estado_civil: string;
    l_nacimiento: string;
    l_residencia: string;
    ocupacion: string;
    motivo_consulta: string;
    narracion: string;
    antecedentes_enfermedad: string;
    alergias: string,
    antecedentes_fisiologicos: string;
    antecedentes_patologicos: string;
    antecedentes_quirurgicos: string;
    antecedentes_farmacologicos: string;
    madre_vive: string;
    madre_causa_fallecimiento: string;
    madre_enfermedad: string;
    padre_vive: string;
    padre_causa_fallecimiento: string;
    padre_enfermedad: string;
    hijos: string;
    hermanos: string;
    h_alimentacion: string;
    h_diuresis: string;
    h_catarsis: string;
    h_sueño: string;
    h_alcohol_tabaco: string;
    h_infusiones: string;
    h_farmacos: string;
    obra_social: string;
    material_casa: string;
    electricidad: string;
    agua: string;
    toilet_privado: string;
    calefaccion: string;
    mascotas: string;
    otro: string;
}