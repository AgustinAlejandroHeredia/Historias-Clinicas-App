import { DatabaseResult } from "@/db/database";

export interface PadreModel {
    id?: number,
    vive: number,
    fallecimiento?: string,
    enfermedad?: string,
    historia_clinica_comun_id: number
}

export interface PadreResult extends DatabaseResult {
    id?: number,
    data?: PadreModel
}

export interface PadreListaModel {
    data?: PadreModel | PadreModel[],
    id?: number
}

export interface PadreListaResult extends DatabaseResult {
    data?: PadreListaModel[],
    count?: number
}