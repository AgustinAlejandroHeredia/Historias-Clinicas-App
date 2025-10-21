import { DatabaseResult } from "@/db/database";

export interface ItemModel {
    id?: number,
    fecha: string,
    descripcion: string,
    historia_clinica_comun_id: number,
}

export interface ItemResult extends DatabaseResult {
    data?: ItemModel | ItemModel[]
    id?: number
}

export interface ItemListaModel {
    id: number,
    fecha: string,
    descripcion: string,
    historia_clinica_comun_id: number,
}

export interface ItemListaResult extends DatabaseResult{
    data?: ItemListaModel[],
    count?: number
}