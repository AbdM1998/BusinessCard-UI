import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BusinessCard, BusinessCardCreate, BusinessCardFilter, PagedResult } from '../models/business-card';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiPath } from 'src/utils/api/paths'; 

@Injectable({
  providedIn: 'root'
})
export class BusinessCardService {

  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  getAll(pageNumber: number, pageSize: number): Observable<PagedResult<BusinessCard>>{
    return this.http.get<PagedResult<BusinessCard>>(`${this.apiUrl}${ApiPath.BUSINESS_CARDS_GET_ALL}`, {
      params: {
        pageNumber: pageNumber,
        pageSize: pageSize
      }
    });
  }
  getById(id: number): Observable<BusinessCard>{
    return this.http.get<BusinessCard>(`${this.apiUrl}${ApiPath.BUSINESS_CARDS_GET_BY_ID}/${id}`);
  }

   filter(filter: BusinessCardFilter): Observable<BusinessCard[]> {
    let params = new HttpParams();
    
    if (filter.name) params = params.set('name', filter.name);
    if (filter.dateOfBirth) params = params.set('dateOfBirth', filter.dateOfBirth);
    if (filter.gender) params = params.set('gender', filter.gender);
    if (filter.email) params = params.set('email', filter.email);
    if (filter.phone) params = params.set('phone', filter.phone);

    console.log('Filter params:', params.toString());
    return this.http.get<BusinessCard[]>(this.apiUrl + ApiPath.BUSINESS_CARDS_FILTER, { params });
  }



  create(card: BusinessCardCreate): Observable<BusinessCard>{
    return this.http.post<BusinessCard>(`${this.apiUrl}${ApiPath.BUSINESS_CARDS_CREATE}`, card);
  }

  delete(id: number): Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}${ApiPath.BUSINESS_CARDS_DELETE}/${id}`);
  }

  exportCsv(id: any = null): Observable<Blob> {
    return this.http.get(`${this.apiUrl}${ApiPath.BUSINESS_CARDS_EXPORT_CSV}/${id}`, {
      responseType: 'blob'
    });
  }

  exportXml(id: any= null): Observable<Blob> {
    return this.http.get(`${this.apiUrl}${ApiPath.BUSINESS_CARDS_EXPORT_XML}/${id}`, {
      responseType: 'blob'
    });
  }
  
  importFile(importedFile: File): Observable<any> {
          if (importedFile.name.endsWith('.csv') ) {
              return this.importCsv(importedFile);
          } else if (importedFile.name.endsWith('.xml')) {
            return this.importXml(importedFile);
          } 
          return new Observable<any>((observer) => {
            observer.error(new Error('Unsupported file format'));
          });  
  }

  importCsv(file: any = null): Observable<any> {
     const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post(`${this.apiUrl}${ApiPath.BUSINESS_CARDS_IMPORT_CSV}`, formData);
  }

  importXml(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post(`${this.apiUrl}${ApiPath.BUSINESS_CARDS_IMPORT_XML}`, formData);
  }


  parseFile(file: File): Promise<BusinessCardCreate[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        try {
          if (file.name.endsWith('.csv')) {
            resolve(this.parseCsvContent(e.target.result));
          } else if (file.name.endsWith('.xml')) {
            resolve(this.parseXmlContent(e.target.result));
          } else {
            reject(new Error('Unsupported file format'));
          }
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }

  private parseCsvContent(content: string): BusinessCardCreate[] {
    const lines = content.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const cards: BusinessCardCreate[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const card: any = {};
      
      headers.forEach((header, index) => {
        card[header] = values[index] || '';
      });

      cards.push({
        name: card.name,
        gender: card.gender,
        dateOfBirth: card.dateofbirth || card.dob,
        email: card.email,
        phone: card.phone,
        address: card.address || '',
        photo: card.photo || undefined
      });
    }

    return cards;
  }

  private parseXmlContent(content: string): BusinessCardCreate[] {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(content, 'text/xml');
    const cards: BusinessCardCreate[] = [];
    const cardElements = xmlDoc.getElementsByTagName('BusinessCard');

    for (let i = 0; i < cardElements.length; i++) {
      const cardEl = cardElements[i];
      cards.push({
        name: this.getXmlValue(cardEl, 'Name'),
        gender: this.getXmlValue(cardEl, 'Gender'),
        dateOfBirth: this.getXmlValue(cardEl, 'DateOfBirth'),
        email: this.getXmlValue(cardEl, 'Email'),
        phone: this.getXmlValue(cardEl, 'Phone'),
        address: this.getXmlValue(cardEl, 'Address'),
        photo: this.getXmlValue(cardEl, 'Photo') || undefined
      });
    }

    return cards;
  }

  private getXmlValue(element: Element, tagName: string): string {
    const el = element.getElementsByTagName(tagName)[0];
    return el ? el.textContent || '' : '';
  }
}

