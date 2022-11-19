export interface TaskSchema {
  codigo: string;
  fec_us_ing: Date | string;
  fec_vencimiento:string;
  novedad?: string;
  cod_ficha?: string;
  trabajador?: string;
  cod_nov_clasif?: string;
  clasif?: string;
  cod_nov_tipo?: string;
  tipo?: string;
  cod_cliente?: string;
  cliente?: string;
  cod_ubicacion?: string;
  ubicacion?: string;
  cod_nov_status?: string;
  nov_status?: string;
  observacion?: string;
  respuesta?: string;
  cod_nov_status_kanban: string;
  nov_status_kanban?: string;
  cod_usuario: string;
  usuario?: string;
  listId?: string;
}