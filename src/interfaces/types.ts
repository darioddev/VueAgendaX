import type { TaskModelProps } from './taskModelProps'

export enum TaskType {
    EVENTO = 'Evento',
    TAREA = 'Tarea',
    TODOS = 'Todos'
}

export type RequestFunction = () => Promise<TaskModelProps | void>

export enum Ordentaion {
    ID = 'ID',
    TITLE = 'Titulo',
    DATE_START = 'Fecha de inicio',
    DATE_END = 'Fecha de fin',
    DATE_CREATED = 'Fecha de creación',
    DATE_MODIFIED = 'Fecha de modificación',
}