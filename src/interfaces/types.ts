import type { TaskModelProps } from './taskModelProps'

export enum TaskType {
    EVENTO = 'Evento',
    TAREA = 'Tarea',
}

export type RequestFunction = () => Promise<TaskModelProps | void>
