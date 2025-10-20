import { DatabaseResult } from "@/db/database";

export interface ParienteModel {
    id?: number,
    nota: string
}

export interface ParienteResult extends DatabaseResult {
    id?: number,
    data?: ParienteModel
}

export interface ParienteListaModel {
    
}

export interface ParienteListaResult {

}