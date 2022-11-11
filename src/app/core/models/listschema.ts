import { TaskSchema } from './index';

export interface ListSchema {
    codigo: string;
    descripcion: string;
    color: string;
    tasks: TaskSchema[];
}