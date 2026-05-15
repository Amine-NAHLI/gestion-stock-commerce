import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { API_BASE_URL } from './api.config';

const API_URL = `${API_BASE_URL}/ai`;

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private http = inject(HttpClient);
  private apiUrl = API_URL;

  generateDescription(productName: string): Observable<string> {
    return this.http.get<{description: string}>(`${this.apiUrl}/generate-description`, {
      params: { productName }
    }).pipe(map(res => res.description));
  }

  getMarketingAdvice(): Observable<string> {
    return this.http.get<{advice: string}>(`${this.apiUrl}/marketing-advice`)
      .pipe(map(res => res.advice));
  }
}
