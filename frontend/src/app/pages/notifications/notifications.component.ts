import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { Notification } from '../../core/models/models';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="content-header">
      <h2><i class="ri-notification-3-line"></i> Notificações</h2>
      <div class="header-actions">
        @if (hasUnread) {
          <button class="btn btn-sm btn-secondary" (click)="markAllRead()"><i class="ri-check-double-line"></i> Marcar todas como lidas</button>
        }
      </div>
    </div>

    <div class="content-body fade-in">
      @if (loading) {
        <div class="loading"><div class="spinner"></div></div>
      } @else if (notifications.length === 0) {
        <div class="empty-state">
          <div class="empty-icon"><i class="ri-notification-off-line" style="font-size: 3rem"></i></div>
          <h3>Sem notificações</h3>
          <p>Quando algo acontecer, vais ver aqui.</p>
        </div>
      } @else {
        <div class="card">
          @for (notif of notifications; track notif.id) {
            <div class="notification-item" [class.unread]="!notif.read" (click)="markRead(notif)">
              <div class="notif-icon" [style.background]="getNotifBg(notif.type)" [style.color]="getNotifColor(notif.type)">
                <i [class]="getNotifIcon(notif.type)"></i>
              </div>
              <div class="notif-content">
                <div class="notif-title">{{ notif.title }}</div>
                <div class="notif-time">{{ getTimeAgo(notif.createdAt) }}</div>
              </div>
              @if (!notif.read) {
                <div style="width: 8px; height: 8px; border-radius: 50%; background: var(--accent-primary); flex-shrink: 0"></div>
              }
            </div>
          }
        </div>
      }
    </div>
  `
})
export class NotificationsComponent implements OnInit {
  notifications: Notification[] = [];
  loading = true;
  hasUnread = false;

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.api.getNotifications().subscribe({
      next: notifs => {
        this.notifications = notifs;
        this.loading = false;
        this.hasUnread = notifs.some(n => !n.read);
      },
      error: () => this.loading = false
    });
  }

  markRead(notif: Notification) {
    if (!notif.read) {
      notif.read = true;
      this.api.markAsRead(notif.id).subscribe();
    }
  }

  markAllRead() {
    this.notifications.forEach(n => n.read = true);
    this.hasUnread = false;
    this.api.markAllAsRead().subscribe();
  }

  getNotifIcon(type: string): string {
    const icons: Record<string, string> = {
      ticket_purchased: 'ri-ticket-line',
      event_reminder: 'ri-alarm-line',
      new_follower: 'ri-user-add-line',
      new_message: 'ri-message-3-line',
      event_cancelled: 'ri-close-circle-line'
    };
    return icons[type] || 'ri-notification-3-line';
  }

  getNotifBg(type: string): string {
    const bgs: Record<string, string> = {
      ticket_purchased: 'rgba(34,197,94,0.12)',
      event_reminder: 'rgba(245,158,11,0.12)',
      new_follower: 'rgba(59,130,246,0.12)',
      new_message: 'rgba(242,196,0,0.12)'
    };
    return bgs[type] || 'rgba(107,114,128,0.12)';
  }

  getNotifColor(type: string): string {
    const colors: Record<string, string> = {
      ticket_purchased: '#22c55e',
      event_reminder: '#f59e0b',
      new_follower: '#3b82f6',
      new_message: '#f2c400'
    };
    return colors[type] || '#888';
  }

  getTimeAgo(date: string): string {
    const diff = Date.now() - new Date(date).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return 'agora';
    if (hours < 24) return `há ${hours}h`;
    const days = Math.floor(hours / 24);
    return `há ${days}d`;
  }
}
