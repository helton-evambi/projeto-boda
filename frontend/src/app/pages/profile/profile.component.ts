import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { User, BodaEvent } from '../../core/models/models';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="content-header">
      <h2><i class="ri-user-3-line"></i> Perfil</h2>
      <div class="header-actions">
        @if (isOwnProfile && user && !editing) {
          <button class="btn btn-sm btn-secondary" (click)="startEdit()"><i class="ri-pencil-line"></i> Editar Perfil</button>
        }
      </div>
    </div>

    <div class="content-body fade-in">
      @if (user) {
        <div class="profile-header">
          <img [src]="user.coverUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200'" class="profile-cover">
          <div class="profile-info">
            <img [src]="user.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'" class="profile-avatar">
            <div class="profile-details">
              <h2>{{ user.name }}</h2>
              <span class="role-badge">{{ getRoleLabel(user.role) }}</span>
              @if (user.artistName) {
                <div style="font-size: 0.85rem; color: var(--accent-primary); margin-top: 4px"><i class="ri-music-2-line"></i> {{ user.artistName }}</div>
              }
              @if (user.companyName) {
                <div style="font-size: 0.85rem; color: var(--accent-primary); margin-top: 4px"><i class="ri-building-line"></i> {{ user.companyName }}</div>
              }
            </div>
            @if (!isOwnProfile) {
              <button class="btn btn-primary" (click)="toggleFollow()">
                <i [class]="isFollowing ? 'ri-user-unfollow-line' : 'ri-user-add-line'"></i>
                {{ isFollowing ? 'A Seguir' : 'Seguir' }}
              </button>
            }
          </div>
        </div>

        @if (user.bio && !editing) {
          <div style="padding: 0 24px; margin-bottom: 16px; color: var(--text-secondary); font-size: 0.9rem">{{ user.bio }}</div>
        }
        @if (!editing) {
          <div style="padding: 0 24px; margin-bottom: 8px; display: flex; gap: 16px; flex-wrap: wrap">
            @if (user.location) {
              <span style="font-size: 0.8rem; color: var(--text-tertiary)"><i class="ri-map-pin-2-line"></i> {{ user.location }}</span>
            }
            @if (user.genre) {
              <span style="font-size: 0.8rem; color: var(--text-tertiary)"><i class="ri-music-2-line"></i> {{ user.genre }}</span>
            }
            @if (user.email) {
              <span style="font-size: 0.8rem; color: var(--text-tertiary)"><i class="ri-mail-line"></i> {{ user.email }}</span>
            }
          </div>
        }

        <!-- Edit Form -->
        @if (editing) {
          <div class="edit-section">
            <div class="card">
              <div class="card-body" style="padding: 24px">
                <h3 style="margin-bottom: 20px"><i class="ri-pencil-line"></i> Editar Perfil</h3>

                @if (editMsg) {
                  <div class="alert" [class.alert-success]="!editError" [class.alert-error]="editError" style="margin-bottom: 16px">
                    <i [class]="editError ? 'ri-error-warning-line' : 'ri-check-line'"></i> {{ editMsg }}
                  </div>
                }

                <div class="edit-grid">
                  <div class="form-group">
                    <label><i class="ri-user-3-line"></i> Nome</label>
                    <input type="text" class="form-control" [(ngModel)]="editData.name">
                  </div>
                  <div class="form-group">
                    <label><i class="ri-phone-line"></i> Telefone</label>
                    <input type="tel" class="form-control" [(ngModel)]="editData.phone" placeholder="+244 9XX XXX XXX">
                  </div>
                  <div class="form-group full-width">
                    <label><i class="ri-quill-pen-line"></i> Bio</label>
                    <textarea class="form-control" [(ngModel)]="editData.bio" rows="3" placeholder="Escreve algo sobre ti..."></textarea>
                  </div>
                  <div class="form-group">
                    <label><i class="ri-map-pin-2-line"></i> Localização</label>
                    <input type="text" class="form-control" [(ngModel)]="editData.location" placeholder="Luanda, Angola">
                  </div>
                  <div class="form-group">
                    <label><i class="ri-global-line"></i> Website</label>
                    <input type="url" class="form-control" [(ngModel)]="editData.website" placeholder="https://...">
                  </div>
                  <div class="form-group full-width">
                    <label><i class="ri-image-line"></i> URL do Avatar</label>
                    <input type="url" class="form-control" [(ngModel)]="editData.avatarUrl" placeholder="https://...">
                  </div>
                  <div class="form-group full-width">
                    <label><i class="ri-landscape-line"></i> URL da Capa</label>
                    <input type="url" class="form-control" [(ngModel)]="editData.coverUrl" placeholder="https://...">
                  </div>
                  @if (user.role === 'Organizer') {
                    <div class="form-group full-width">
                      <label><i class="ri-building-line"></i> Nome da Empresa</label>
                      <input type="text" class="form-control" [(ngModel)]="editData.companyName">
                    </div>
                  }
                  @if (user.role === 'DjArtist') {
                    <div class="form-group">
                      <label><i class="ri-disc-line"></i> Nome Artístico</label>
                      <input type="text" class="form-control" [(ngModel)]="editData.artistName">
                    </div>
                    <div class="form-group">
                      <label><i class="ri-music-2-line"></i> Género Musical</label>
                      <input type="text" class="form-control" [(ngModel)]="editData.genre" placeholder="Kuduro, Afrohouse...">
                    </div>
                  }
                </div>

                <div class="edit-actions">
                  <button class="btn btn-secondary" (click)="cancelEdit()">Cancelar</button>
                  <button class="btn btn-primary" (click)="saveProfile()" [disabled]="saving">
                    <i class="ri-save-line"></i> {{ saving ? 'A guardar...' : 'Guardar' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        }

        <div class="profile-stats" style="margin: 0 24px 24px">
          <div class="stat">
            <div class="stat-num">{{ user.followersCount }}</div>
            <div class="stat-label">Seguidores</div>
          </div>
          <div class="stat">
            <div class="stat-num">{{ user.followingCount }}</div>
            <div class="stat-label">A seguir</div>
          </div>
          <div class="stat">
            <div class="stat-num">{{ user.eventsCount }}</div>
            <div class="stat-label">Eventos</div>
          </div>
        </div>

        <!-- Tabs -->
        <div class="tabs" style="margin: 0 24px">
          <button class="tab" [class.active]="activeTab === 'events'" (click)="activeTab = 'events'"><i class="ri-calendar-event-line"></i> Eventos</button>
          <button class="tab" [class.active]="activeTab === 'about'" (click)="activeTab = 'about'"><i class="ri-information-line"></i> Sobre</button>
        </div>

        <div style="padding: 0 24px">
          @if (activeTab === 'events') {
            @if (events.length === 0) {
              <div class="empty-state">
                <div class="empty-icon"><i class="ri-calendar-close-line" style="font-size: 3rem"></i></div>
                <h3>Nenhum evento</h3>
              </div>
            } @else {
              <div class="events-grid">
                @for (event of events; track event.id) {
                  <a [routerLink]="['/event', event.slug]" class="event-card" style="text-decoration: none">
                    <div class="event-image-wrapper">
                      <img [src]="event.imageUrl" [alt]="event.title">
                      <div class="event-date-badge">
                        <div class="day">{{ getDay(event.startDateTime) }}</div>
                        <div class="month">{{ getMonth(event.startDateTime) }}</div>
                      </div>
                    </div>
                    <div class="event-content">
                      <div class="event-title">{{ event.title }}</div>
                      <div style="display: flex; gap: 12px; font-size: 0.8rem; color: var(--text-muted); margin-top: 6px">
                        <span><i class="ri-heart-3-line"></i> {{ event.likesCount }}</span>
                        <span><i class="ri-chat-3-line"></i> {{ event.commentsCount }}</span>
                      </div>
                    </div>
                  </a>
                }
              </div>
            }
          } @else {
            <div class="card">
              <div class="card-body" style="padding: 24px">
                <h3 style="margin-bottom: 16px">Informações</h3>
                <div class="about-grid">
                  <div class="about-item"><span class="about-label">Nome</span><span>{{ user.name }}</span></div>
                  <div class="about-item"><span class="about-label">Email</span><span>{{ user.email }}</span></div>
                  @if (user.phone) {
                    <div class="about-item"><span class="about-label">Telefone</span><span>{{ user.phone }}</span></div>
                  }
                  <div class="about-item"><span class="about-label">Conta</span><span>{{ getRoleLabel(user.role) }}</span></div>
                  <div class="about-item"><span class="about-label">Verificado</span><span>{{ user.verified ? 'Sim' : 'Não' }}</span></div>
                  <div class="about-item"><span class="about-label">Membro desde</span><span>{{ user.createdAt | date:'MMM y' }}</span></div>
                </div>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .about-grid {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .about-item {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid var(--border-color);
      font-size: 0.875rem;
    }
    .about-label {
      color: var(--text-tertiary);
      font-weight: 500;
    }
    .edit-section {
      padding: 0 24px;
      margin-bottom: 24px;
    }
    .edit-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    .edit-grid .full-width {
      grid-column: span 2;
    }
    .edit-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 20px;
      padding-top: 16px;
      border-top: 1px solid var(--border-color);
    }
    .alert-success {
      background: rgba(34,197,94,0.1);
      border: 1px solid rgba(34,197,94,0.3);
      color: #22c55e;
      padding: 10px 14px;
      border-radius: var(--radius-md);
      font-size: 0.85rem;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    @media (max-width: 600px) {
      .edit-grid {
        grid-template-columns: 1fr;
      }
      .edit-grid .full-width {
        grid-column: span 1;
      }
    }
  `]
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  events: BodaEvent[] = [];
  activeTab = 'events';
  isOwnProfile = true;
  isFollowing = false;

  // Edit mode
  editing = false;
  saving = false;
  editMsg = '';
  editError = false;
  editData: any = {};

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    public auth: AuthService
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isOwnProfile = +id === this.auth.currentUser()?.id;
      this.api.getUser(+id).subscribe(u => {
        this.user = u;
        if (u.role === 'Organizer' || u.role === 'Admin') {
          this.api.getEvents().subscribe(events => {
            this.events = events.filter(e => e.organizerId === u.id);
          });
        }
      });
    } else {
      this.isOwnProfile = true;
      this.user = this.auth.currentUser();
      if (this.user && (this.user.role === 'Organizer' || this.user.role === 'Admin')) {
        this.api.getEvents().subscribe(events => {
          this.events = events.filter(e => e.organizerId === this.user!.id);
        });
      }
    }
  }

  startEdit() {
    if (!this.user) return;
    this.editing = true;
    this.editMsg = '';
    this.editData = {
      name: this.user.name || '',
      phone: this.user.phone || '',
      bio: this.user.bio || '',
      location: this.user.location || '',
      website: this.user.website || '',
      avatarUrl: this.user.avatarUrl || '',
      coverUrl: this.user.coverUrl || '',
      companyName: this.user.companyName || '',
      artistName: this.user.artistName || '',
      genre: this.user.genre || ''
    };
  }

  cancelEdit() {
    this.editing = false;
    this.editMsg = '';
  }

  saveProfile() {
    this.saving = true;
    this.editMsg = '';
    this.api.updateProfile(this.editData).subscribe({
      next: (updatedUser) => {
        this.user = updatedUser;
        this.auth.currentUser.set(updatedUser);
        localStorage.setItem('boda-user', JSON.stringify(updatedUser));
        this.saving = false;
        this.editing = false;
        this.editMsg = 'Perfil atualizado com sucesso!';
        this.editError = false;
      },
      error: () => {
        this.saving = false;
        this.editMsg = 'Erro ao atualizar perfil.';
        this.editError = true;
      }
    });
  }

  toggleFollow() {
    if (!this.user) return;
    if (this.isFollowing) {
      this.api.unfollowUser(this.user.id).subscribe(() => {
        this.isFollowing = false;
        this.user!.followersCount--;
      });
    } else {
      this.api.followUser(this.user.id).subscribe(() => {
        this.isFollowing = true;
        this.user!.followersCount++;
      });
    }
  }

  getRoleLabel(role: string): string {
    const map: Record<string, string> = { Admin: 'Administrador', Organizer: 'Organizador', DjArtist: 'DJ / Artista', User: 'Utilizador', Developer: 'Desenvolvedor' };
    return map[role] || role;
  }

  getDay(d: string): string { return new Date(d).getDate().toString().padStart(2, '0'); }
  getMonth(d: string): string { return new Date(d).toLocaleString('pt', { month: 'short' }).toUpperCase(); }
}
