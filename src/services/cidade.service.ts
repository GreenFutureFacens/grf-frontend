import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CidadeInterface } from '../interface/CidadeInterface';
import { environment } from '../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CidadeService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<HttpResponse<CidadeInterface[]>> {
    return this.http.get<CidadeInterface[]>(environment.urlApi + 'cidade', { observe: 'response' });
  }
}
