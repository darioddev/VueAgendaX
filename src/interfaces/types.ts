import type { TaskModelProps } from './taskModelProps'

export enum TaskType {
    EVENTO = 'Evento',
    TAREA = 'Tarea',
    TODOS = 'Todos'
}

export type RequestFunction = () => Promise<TaskModelProps | void>
