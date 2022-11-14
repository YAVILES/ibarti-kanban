import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import {  HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment as env } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IbartiService  {
  protected URL_API: string = env.API;
  protected URL = `${this.URL_API}/kanban/`;
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
