import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment as env } from '../../../environments/environment';
import { getLocalStorage } from 'src/app/utils/localStorage';

import { DatePipe } from '@angular/common';
import { TaskSchema } from '../models';
interface TaskEdit {
  usuario: string, // Código de usuario en sesión
  cod_usuario: string, // Codigo de usuario asignado a la tarea (novedad)
  codigo: string, // Codigo de la tarea (novedad)
  fec_vencimiento:  string,
  status: string ,// Estatus kanban de la tarea (novedad.cod_nov_status_kanban)
  }
interface TaskActividad {
  usuario: string, // Código de usuario en sesión
  activity: string, // Codigo de usuario asignado a la tarea (novedad)
  codigo: string, // Codigo de la tarea (novedad)
  
}
@Injectable({
  providedIn: 'root'
})
export class IbartiService  {
  protected URL_API: string = env.API;
  protected URL = `${this.URL_API}/kanban`;
  constructor(private http: HttpClient,private miDatePipe: DatePipe,) { }

  /* Get Status Kanban Ibarti */
  getStatus() {
    return this.http
      .get<Array<{}>>(`${this.URL}/status/?usuario=${getLocalStorage('userIbartiKanban')}`)
      .pipe(map(data => data), catchError(this.handleError));
  }

  getUsuarios() {
    return this.http
      .get<Array<{}>>(`${this.URL}/users/?usuario=${getLocalStorage('userIbartiKanban')}`)
      .pipe(map(data => data), catchError(this.handleError));
  }

  editTask(task: TaskEdit) {
    let data =  new FormData();
    
    data.append('usuario', task.usuario);
    data.append('cod_usuario', task.cod_usuario);
    data.append('codigo', task.codigo);
    data.append('fec_vencimiento', task?.fec_vencimiento ? this.formatearFecha(task.fec_vencimiento) : 'null');
    data.append('status', task.status);

    return this.http
      .post(`${this.URL}/edit_task/?usuario=${getLocalStorage('userIbartiKanban')}`, data)
      .pipe(map(data => data), catchError(this.handleError));
  }
  
  getTasksEditActivity(task:TaskSchema) {
    return this.http
      .get<Array<{}>>(`${this.URL}/activity/?usuario=${getLocalStorage('userIbartiKanban')}&codigo=${task.codigo}`)
      .pipe(map(data => data), catchError(this.handleError));
  }
  getTaskshistorial(task:TaskSchema) {
    return this.http
      .get<Array<{}>>(`${this.URL}/historial/?usuario=${getLocalStorage('userIbartiKanban')}&codigo=${task.codigo}`)
      .pipe(map(data => data), catchError(this.handleError));
  }
  
  getTasks() {
    return this.http
      .get<Array<{}>>(`${this.URL}/news/?usuario=${getLocalStorage('userIbartiKanban')}`)
      .pipe(map(data => data), catchError(this.handleError));
  }
  /* Handle request error */
  private handleError(res: HttpErrorResponse){
    return throwError(() => new Error(res.error || 'Server error'));
  }
  CrearExcerciseTask(task:TaskActividad) {
    let data =  new FormData();
    data.append('usuario', task.usuario);
    data.append('codigo', task.codigo);
    data.append('activity',task.activity );
    return this.http
      .post(`${this.URL}/add_activity/?usuario=${getLocalStorage('userIbartiKanban')}`, data)
      .pipe(map(data => data), catchError(this.handleError));
  }
  formatearFecha(fecha: string) {
    const fechaArray = fecha.toString();

    // Pasamos la fecha Date
    const date = new Date(fechaArray);

    const fechaFormateada = this.miDatePipe.transform(date, 'yyyy-MM-dd hh:mm:ss');

    return `${fechaFormateada}`;
  }
}
