import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../services/notification';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notification-container">
      @for (notif of notificationService.notifications(); track notif.id) {
        <div class="toast-premium shadow" [ngClass]="notif.type">
          <div class="toast-icon">
            <i class="bi" [ngClass]="{
              'bi-check-circle-fill': notif.type === 'success',
              'bi-exclamation-triangle-fill': notif.type === 'error',
              'bi-info-circle-fill': notif.type === 'info',
              'bi-exclamation-circle-fill': notif.type === 'warning'
            }"></i>
          </div>
          <div class="toast-content">
            {{ notif.message }}
          </div>
          <button class="toast-close" (click)="notificationService.remove(notif.id)">
            <i class="bi bi-x"></i>
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .notification-container {
      position: fixed;
      top: 2rem;
      right: 2rem;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      pointer-events: none;
    }

    .toast-premium {
      pointer-events: auto;
      min-width: 300px;
      max-width: 450px;
      background: white;
      border-radius: 1rem;
      display: flex;
      align-items: center;
      padding: 1rem;
      animation: slideIn 0.3s ease-out forwards;
      border: 1px solid #f1f5f9;

      &.success { border-left: 5px solid #10b981; .toast-icon { color: #10b981; } }
      &.error { border-left: 5px solid #ef4444; .toast-icon { color: #ef4444; } }
      &.warning { border-left: 5px solid #f59e0b; .toast-icon { color: #f59e0b; } }
      &.info { border-left: 5px solid #3b82f6; .toast-icon { color: #3b82f6; } }
    }

    .toast-icon {
      font-size: 1.5rem;
      margin-right: 1rem;
      display: flex;
      align-items: center;
    }

    .toast-content {
      flex: 1;
      font-weight: 500;
      color: #1e293b;
      font-size: 0.9rem;
    }

    .toast-close {
      background: transparent;
      border: none;
      color: #94a3b8;
      font-size: 1.25rem;
      padding: 0;
      margin-left: 1rem;
      transition: color 0.2s;
      &:hover { color: #1e293b; }
    }

    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `]
})
export class NotificationComponent {
  notificationService = inject(NotificationService);
}
