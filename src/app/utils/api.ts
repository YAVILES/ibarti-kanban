import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment as env } from '../../environments/environment';
//import { DataTableRender } from './datatable.render';
import { Injectable } from "@angular/core";

/**
 * Case abstracta para implentar funciones establecidas para
 * el CRUD de cualquier servicio, al heredar esta clase debe
 * valorizar el campo URI
 */
@Injectable()
export abstract class API<T> {
  
  protected URL_API: string = env.API;
  protected abstract URL: string;

  constructor(protected http: HttpClient) {
  }

  /**
   * Funcion que ejecuta una solicitud post para
   * Guardar el objeto
   * @param value objeto a guardar
   */
  add(value: T): Observable<T> {
    return this.http.post<T>(this.URL, value);
  }

  /**
   * Funcion que ejecuta un solicitud get y retorna un lista
   * de objeto
   * @param params parametros para el query params
   */
  list(params?: {}): Observable<T[]> {
    return this.http.get<T[]>(this.URL, { params });
  }

  /**
   * Funcion que ejecuta un solicitud get y retorna una lista
   * con los valores y los nombres de los campos en el modelo
   * que tienen el atributo `choices`
   * @param campo nombre del campo del modelo
   */
  opciones_de_campo(campo: string): Observable<{ nombre: string, descripcion: string, valor: string }[]> {
    return this.http.get<{ nombre: string, descripcion: string, valor: string }[]>(this.URL + 'opciones_de_campo/', { params: { campo } });
  }

  /**
   * Funcion que ejecuta una solicitud get para retornar
   * un solo object
   * @param id del objeto a retornar
   * @param params query params que se pasan con la consulta get
   */
  get(id: string | number, params?: {}): Observable<T> {
    return this.http.get<T>(this.URL + id, { params });
  }

  /**
   * Funcion que ejecuta una solicitud put para actualizar
   * un objeto
   *
   * @param id del objeto
   * @param value objeto con las modificaciones
   */
  update(id: string | number, value: T): Observable<T> {
    return this.http
      .put<T>(this.URL + id + '/', value);
  }


  /**
   * Funcion que ejecuta una solicitud patch para actualizar
   * un objeto
   *
   * @param id del objeto
   * @param value objeto con las modificaciones
   */
  update_patch(id: string | number, value: any): Observable<T> {
    return this.http.patch<T>(this.URL + id + '/', value);
  }


  /**
   * Funcion que ejecuta una solicitud delete para eliminar un
   * objeto
   * @param id del objeto
   */
  remove(id: string | number): Observable<T> {
    return this.http
      .delete<T>(this.URL + id + '/');
  }

  /**
   * Funcion que ejecuta una solicitud get para utilizar
   * en implementacion con el datatable
   * @param parametros query params de la solicitud
   */
  ajax(parametros: HttpParams): Observable<T> {
    //const params = DataTableRender.buildQueryParams(parametros);
    return this.http.get<T>(this.URL, { params: parametros });
  }

  /**
 * Funcion que ejecuta un solicitud get y retorna una lista
 * con los valores y los nombres de los campos en el modelo
 * que tienen el atributo `choices`
 * @param field nombre del campo del modelo
 */
  field_options(field: string): Observable<{ description: string, value: string }[]> {
    return this.http.get<{ description: string, value: string }[]>(this.URL + 'field_options/', { params: { field } });
  }

  /**
 * Funcion que ejecuta un solicitud get y retorna una lista
 * con los valores y los nombres de los campos en el modelo
 * que tienen el atributo `choices` de manera multiple
 * @param fields nombre del campo del modelo
 */
  field_options_multiple(fields: string[]): Observable<any> {
    return this.http.get<any>(this.URL + 'field_options/', { params: { fields } });
  }

  previousNext(url: string): Observable<T> {
    return this.http.get<T>(url);
  }
}