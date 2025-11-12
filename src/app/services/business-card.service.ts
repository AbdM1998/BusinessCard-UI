import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BusinessCard, BusinessCardCreate, BusinessCardFilter } from '../models/business-card';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ApiPath } from 'src/utils/api/paths'; 

@Injectable({
  providedIn: 'root'
})
export class BusinessCardService {

  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  getAll(): Observable<BusinessCard[]>{
    return this.http.get<BusinessCard[]>(`${this.apiUrl}${ApiPath.BUSINESS_CARDS_GET_ALL}`);
  }
  getById(id: number): Observable<BusinessCard>{
    return this.http.get<BusinessCard>(`${this.apiUrl}${ApiPath.BUSINESS_CARDS_GET_BY_ID}/${id}`);
  }

  filter(filter: BusinessCardFilter): Observable<BusinessCard[]>{
    return this.http.post<BusinessCard[]>(`${this.apiUrl}${ApiPath.BUSINESS_CARDS_FILTER}`, filter);
  }

  create(card: BusinessCardCreate): Observable<BusinessCard>{
    return this.http.post<BusinessCard>(`${this.apiUrl}${ApiPath.BUSINESS_CARDS_CREATE}`, card);
  }

  delete(id: number): Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}${ApiPath.BUSINESS_CARDS_DELETE}/${id}`);
  }
}

