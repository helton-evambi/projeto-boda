import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { Message, User } from '../../core/models/models';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="content-header">
      <h2><i class="ri-message-3-line"></i> Mensagens</h2>
      <button class="btn btn-primary btn-sm" (click)="showCompose = !showCompose">
        <i class="ri-quill-pen-line"></i> Nova Mensagem
      </button>
    </div>

    <div class="content-body fade-in">
      <!-- Compose Form -->
      @if (showCompose) {
        <div class="card compose-card" style="margin-bottom: 24px">
          <div class="card-body" style="padding: 20px">
            <h3 style="margin-bottom: 12px"><i class="ri-mail-send-line"></i> Nova Mensagem</h3>
            <div class="form-group">
              <label><i class="ri-user-line"></i> Destinatário</label>
              <select class="form-control" [(ngModel)]="composeToUserId">
                <option value="0" disabled>Selecionar destinatário...</option>
                @for (u of availableUsers; track u.id) {
                  <option [value]="u.id">{{ u.name }} ({{ u.role }})</option>
                }
              </select>
            </div>
            <div class="form-group">
              <label><i class="ri-text"></i> Assunto</label>
              <input type="text" class="form-control" [(ngModel)]="composeSubject" placeholder="Assunto da mensagem">
            </div>
            <div class="form-group">
              <label><i class="ri-chat-3-line"></i> Mensagem</label>
              <textarea class="form-control" [(ngModel)]="composeBody" rows="4" placeholder="Escrever mensagem..."></textarea>
            </div>
            <div style="display: flex; gap: 8px; justify-content: flex-end">
              <button class="btn btn-secondary btn-sm" (click)="showCompose = false"><i class="ri-close-line"></i> Cancelar</button>
              <button class="btn btn-primary btn-sm" (click)="send()" [disabled]="!composeBody || composeToUserId <= 0">
                <i class="ri-send-plane-fill"></i> Enviar
              </button>
            </div>
          </div>
        </div>
      }

      @if (loading) {
        <div class="loading"><div class="spinner"></div></div>
      } @else if (messages.length === 0) {
        <div class="empty-state">
          <div class="empty-icon"><i class="ri-message-3-line" style="font-size: 3rem"></i></div>
          <h3>Sem mensagens</h3>
          <p>As tuas conversas aparecerão aqui.</p>
        </div>
      } @else {
        <div class="messages-list">
          @for (msg of messages; track msg.id) {
            <div class="message-item" [class.sent]="msg.fromUserId === currentUserId" [class.unread]="!msg.read && msg.toUserId === currentUserId">
              <div class="message-header">
                <div style="display: flex; gap: 10px; align-items: center">
                  <img [src]="getAvatar(msg)" style="width: 36px; height: 36px; border-radius: 50%">
                  <div>
                    <span style="font-weight: 600; font-size: 0.85rem">
                      {{ msg.fromUserId === currentUserId ? msg.toUserName : msg.fromUserName }}
                    </span>
                    <span class="message-time">{{ getTimeAgo(msg.createdAt) }}</span>
                    @if (!msg.read && msg.toUserId === currentUserId) {
                      <span class="new-badge">NOVA</span>
                    }
                  </div>
                </div>
                <div style="font-size: 0.65rem; text-transform: uppercase; color: var(--text-muted); padding: 2px 6px; border-radius: 4px; background: var(--bg-surface)">
                  {{ msg.fromUserId === currentUserId ? 'Enviada' : 'Recebida' }}
                </div>
              </div>
              @if (msg.subject) {
                <div style="font-weight: 600; font-size: 0.85rem; margin-bottom: 4px"><i class="ri-mail-line"></i> {{ msg.subject }}</div>
              }
              <div class="message-body">{{ msg.body }}</div>
              @if (msg.fromUserId !== currentUserId) {
                <div style="margin-top: 10px; display: flex; justify-content: flex-end">
                  <button class="btn btn-sm btn-primary" (click)="replyTo(msg)" style="font-size: 0.75rem; padding: 4px 12px">
                    <i class="ri-reply-line"></i> Responder
                  </button>
                </div>
              }
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .messages-list { display: flex; flex-direction: column; gap: 10px; }
    .message-item {
      padding: 16px; background: var(--bg-card); border: 1px solid var(--border-color);
      border-radius: var(--radius-lg); transition: all 0.2s;
    }
    .message-item:hover { border-color: var(--accent-primary); }
    .message-item.unread { border-left: 3px solid var(--accent-primary); background: rgba(242,196,0, 0.03); }
    .message-item.sent { border-left: 3px solid var(--border-color); }
    .message-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
    .message-time { font-size: 0.7rem; color: var(--text-muted); margin-left: 8px; }
    .message-body { font-size: 0.85rem; color: var(--text-secondary); line-height: 1.6; }
    .new-badge {
      font-size: 0.55rem; font-weight: 700; padding: 1px 6px; border-radius: 4px;
      background: var(--accent-gradient); color: #000; margin-left: 6px; letter-spacing: 1px;
    }
    .compose-card { border: 1px solid var(--accent-primary); }
    @media (max-width: 600px) { .message-item { padding: 12px; } }
  `]
})
export class MessagesComponent implements OnInit {
  messages: Message[] = [];
  availableUsers: User[] = [];
  loading = true;
  currentUserId = 0;
  showCompose = false;
  composeToUserId = 0;
  composeSubject = '';
  composeBody = '';

  constructor(private api: ApiService, private auth: AuthService) { }

  ngOnInit() {
    this.currentUserId = this.auth.currentUser()?.id || 0;
    this.api.getMessages().subscribe({
      next: msgs => { this.messages = msgs; this.loading = false; },
      error: () => this.loading = false
    });
    // Load users for compose dropdown
    this.api.getUsers().subscribe(users => {
      this.availableUsers = users.filter(u => u.id !== this.currentUserId);
    });
  }

  send() {
    if (!this.composeBody || this.composeToUserId <= 0) return;
    this.api.sendMessage(+this.composeToUserId, this.composeSubject, this.composeBody).subscribe({
      next: msg => {
        this.messages.unshift(msg);
        this.showCompose = false;
        this.composeToUserId = 0;
        this.composeSubject = '';
        this.composeBody = '';
      }
    });
  }

  replyTo(msg: Message) {
    this.showCompose = true;
    this.composeToUserId = msg.fromUserId;
    this.composeSubject = msg.subject?.startsWith('RE: ') ? msg.subject : `RE: ${msg.subject || ''}`;
    this.composeBody = '';
    // Scroll to the compose form
    setTimeout(() => {
      document.querySelector('.compose-card')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }

  getAvatar(msg: Message): string {
    if (msg.fromUserId === this.currentUserId) {
      return this.auth.currentUser()?.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=user';
    }
    return msg.fromUserAvatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=user';
  }

  getTimeAgo(date: string): string {
    const diff = Date.now() - new Date(date).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return 'agora';
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d`;
    return new Date(date).toLocaleDateString('pt');
  }
}
