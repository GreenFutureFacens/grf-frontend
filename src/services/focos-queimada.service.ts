import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FocosQueimadaInterface } from '../interface/FocosQueimadaInterface';
import { environment } from '../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class FocosQueimadaService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<HttpResponse<FocosQueimadaInterface[]>> {
    return this.http.get<FocosQueimadaInterface[]>(environment.urlApi + 'focos', { observe: 'response'});
  }

  getByPeriodCity(dateStart: string, dateEnd: string, codeCity: string):Observable<HttpResponse<FocosQueimadaInterface[]>> {
    // Manually build the query string
    const queryString = `?start=${encodeURIComponent(dateStart)}&end=${encodeURIComponent(dateEnd)}&code=${encodeURIComponent(codeCity)}`;
    console.log(queryString);
    // Make the GET request
    return this.http.get<FocosQueimadaInterface[]>(environment.urlApi + 'focos/period/city' + queryString, {observe:'response'});
  }
}
