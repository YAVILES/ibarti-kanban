import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import {  HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment as env } from '../../../environments/environment';

interface TaskEdit {
  usuario: string, // Código de usuario en sesión
  cod_usuario: string, // Codigo de usuario asignado a la tarea (novedad)
  codigo: string, // Codigo de la tarea (novedad)
  fec_vencimiento:  string,
  status: string // Estatus kanban de la tarea (novedad.cod_nov_status_kanban)
}

@Injectable({
  providedIn: 'root'
})
export class IbartiService  {
  protected URL_API: string = env.API;
  protected URL = `${this.URL_API}/kanban`;
  constructor(private http: HttpClient) { }

  /* Get Status Kanban Ibarti */
  getStatus() {
    return this.http
      .get<Array<{}>>(`${this.URL}/status/?usuario=1234`)
      .pipe(map(data => data), catchError(this.handleError));
  }

  getUsuarios() {
    return this.http
      .get<Array<{}>>(`${this.URL}/users/?usuario=1234`)
      .pipe(map(data => data), catchError(this.handleError));
  }

  editTask(task: TaskEdit) {
    let data =  new FormData();
    data.append('usuario', task.usuario);
    data.append('cod_usuario', task.cod_usuario);
    data.append('codigo', task.codigo);
    data.append('fec_vencimiento', task.fec_vencimiento);
    data.append('status', task.status);

    return this.http
      .post(`${this.URL}/edit_task/?usuario=1234`, data)
      .pipe(map(data => data), catchError(this.handleError));
  }
  
  getTasks() {
    return this.http
      .get<Array<{}>>(`${this.URL}/news/?usuario=1234`)
      .pipe(map(data => data), catchError(this.handleError));
  }

  /* Handle request error */
  private handleError(res: HttpErrorResponse){
    return throwError(() => new Error(res.error || 'Server error'));
  }
 
}
