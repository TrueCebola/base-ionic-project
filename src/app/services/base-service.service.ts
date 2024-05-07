import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * An object that represents the HTTP headers to be sent with an HTTP request.
 */
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

/**
 * The @Injectable decorator indicates that the ApuracoesService class can be injected with dependencies.
 */
@Injectable({
  providedIn: 'root',
})
export class BaseServiceService {
  /**
   * The URL used for making HTTP requests.
   */
  url = `${window.location.origin}/api/app/program`;
  /**
   * Constructor function for the class.
   *
   * @param {HttpClient} http - The HttpClient instance.
   */
  constructor(private http: HttpClient) {}
  /**
   * Retrieves data from the server.
   *
   * @param {number} id - (Optional) The id of the data to retrieve.
   * @param {string} filter - (Optional) The filter to apply when retrieving data.
   * @return {Observable<any>} An observable that emits the retrieved data.
   */
  get(id?: number, filter?: string): Observable<any> {
    if (id) {
      return this.http.get(this.url, {
        responseType: 'json',
        params: {
          id: id,
        },
      });
    } else if (filter) {
      return this.http.get(this.url, {
        responseType: 'json',
        params: {
          filter: filter,
        },
      });
    } else if (id && filter) {
      return this.http.get(this.url, {
        responseType: 'json',
        params: {
          id: id,
          filter: filter,
        },
      });
    }
    return this.http.get(this.url, {
      responseType: 'json',
    });
  }

  /**
   * Sends a POST request to the specified URL with the provided data.
   *
   * @param {any} data - The data to be sent in the request body.
   * @return {Observable<any>} An observable that emits the response from the server.
   */
  post(data: any): Observable<any> {
    return this.http.post(
      this.url,
      {
        data,
      },
      httpOptions
    );
  }

  /**
   * Updates data at the specified ID using HTTP PUT method.
   *
   * @param {any} data - The data to be updated.
   * @param {number} id - The ID of the data to be updated.
   * @return {Observable<any>} - An observable that emits the updated data.
   */
  put(data: any, id: number): Observable<any> {
    return this.http.put(
      this.url,
      { data },
      {
        params: {
          id: id,
        },
      }
    );
  }

  /**
   * Deletes an item by ID.
   *
   * @param {number} id - The ID of the item to delete.
   * @return {Observable<any>} An observable that emits the response when the item is deleted.
   */
  delete(id: number): Observable<any> {
    return this.http.delete(this.url, {
      params: {
        value: id,
      },
    });
  }
}
