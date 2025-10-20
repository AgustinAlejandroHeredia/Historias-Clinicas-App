import { DatabaseResult } from "@/db/database";

export interface ParienteModel {
    id?: number,
    nota: string,
    tipo: string,
    historia_clinica_comun_id: number
}

export interface ParienteResult extends DatabaseResult {
    id?: number,
    data?: ParienteModel,
}

export interface ParienteListaModel {
    data?: ParienteModel | ParienteListaModel[],
    id?: number
}

export interface ParienteListaResult extends DatabaseResult {
    data?: ParienteListaModel[],
    count?: number
}