import { Injectable, signal } from '@angular/core';

export interface Notification {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  id: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  notifications = signal<Notification[]>([]);
  private nextId = 0;

  show(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'success'): void {
    const id = this.nextId++;
    const notification: Notification = { id, message, type };
    
    this.notifications.update(n => [...n, notification]);

    // Auto-suppression après 4 secondes
    setTimeout(() => {
      this.remove(id);
    }, 4000);
  }

  remove(id: number): void {
    this.notifications.update(n => n.filter(item => item.id !== id));
  }
}
