import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

const API_URL = 'http://localhost:8080/api/users';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private http = inject(HttpClient);

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(API_URL);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${API_URL}/${id}`);
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(API_URL, user);
  }

  updateUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${API_URL}/${id}`, user);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${API_URL}/${id}`);
  }

  toggleStatus(id: number): Observable<User> {
    return this.http.patch<User>(`${API_URL}/${id}/toggle-status`, {});
  }

  approveUser(id: number): Observable<User> {
    return this.http.patch<User>(`${API_URL}/${id}/approve`, {});
  }

  rejectUser(id: number): Observable<any> {
    return this.http.delete(`${API_URL}/${id}/reject`);
  }

  getAuditLogs(): Observable<any[]> {
    return this.http.get<any[]>(`${API_URL}/audit-logs`);
  }
}
