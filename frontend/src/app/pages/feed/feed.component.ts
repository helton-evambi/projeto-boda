import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { BodaEvent, Comment as BodaComment } from '../../core/models/models';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="content-header">
      <h2>Feed</h2>
      <div class="header-actions">
        <span style="font-size: 0.85rem; color: var(--text-tertiary)">Olá, <strong style="color: var(--accent-primary)">{{ getFirstName() }}</strong> <i class="ri-hand-heart-line" style="color: var(--accent-primary)"></i></span>
      </div>
    </div>

    <div class="content-body">
      <!-- Stories Bar (STICKY) -->
      <div class="stories-bar">
        <div class="story-item" (click)="showStoryCreator = true">
          <div class="story-avatar add-story">
            <i class="ri-add-line"></i>
          </div>
          <span class="story-name">Tua Story</span>
        </div>
        @for (story of stories; track story.id) {
          <div class="story-item" [class.viewed]="viewedStories.has(story.id)" (click)="viewStory(story)">
            <div class="story-avatar" [style.background-image]="'url(' + story.imageUrl + ')'">
            </div>
            <span class="story-name">{{ story.title.split(' ')[0] }}</span>
          </div>
        }
      </div>

      <!-- Story Creator Modal -->
      @if (showStoryCreator) {
        <div class="story-creator-overlay" (click)="showStoryCreator = false">
          <div class="story-creator-card" (click)="$event.stopPropagation()">
            <h3><i class="ri-camera-line"></i> Criar Story</h3>
            <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 12px">Partilha um momento com os teus seguidores</p>
            <div class="story-image-grid">
              @for (img of storyImages; track img; let i = $index) {
                <div class="story-img-option" [class.selected]="selectedStoryImage === img" (click)="selectedStoryImage = img">
                  <img [src]="img" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px">
                </div>
              }
            </div>
            <div class="form-group" style="margin-top: 12px">
              <input type="text" class="form-control" [(ngModel)]="storyCaption" placeholder="Escrever legenda...">
            </div>
            <div style="display: flex; gap: 8px">
              <button class="btn btn-secondary btn-block" (click)="showStoryCreator = false"><i class="ri-close-line"></i> Cancelar</button>
              <button class="btn btn-primary btn-block" (click)="postStory()" [disabled]="!selectedStoryImage"><i class="ri-send-plane-fill"></i> Publicar</button>
            </div>
          </div>
        </div>
      }

      <!-- Story Viewer -->
      @if (viewingStory) {
        <div class="story-viewer-overlay" (click)="viewingStory = null">
          <div class="story-viewer" (click)="$event.stopPropagation()">
            <img [src]="viewingStory.imageUrl" class="story-viewer-img" [alt]="viewingStory.title">
            <div class="story-viewer-header">
              <img [src]="viewingStory.organizerAvatar" style="width: 36px; height: 36px; border-radius: 50%; border: 2px solid #fff">
              <div>
                <div style="font-weight: 600; color: #fff; font-size: 0.85rem">{{ viewingStory.organizerName }}</div>
                <div style="font-size: 0.7rem; color: rgba(255,255,255,0.7)">{{ viewingStory.title }}</div>
              </div>
              <button class="icon-btn" style="margin-left: auto; color: #fff; width: 32px; height: 32px" (click)="viewingStory = null"><i class="ri-close-line"></i></button>
            </div>
            <div class="story-viewer-footer">
              <a [routerLink]="['/event', viewingStory.slug]" class="btn btn-primary btn-sm" style="width: 100%" (click)="viewingStory = null"><i class="ri-arrow-right-line"></i> Ver Evento</a>
            </div>
          </div>
        </div>
      }

      <!-- Feed Content -->
      @if (loading) {
        <div class="loading"><div class="spinner"></div></div>
      } @else {
        <div class="feed-list">
          @for (event of events; track event.id; let i = $index) {
            <div class="event-card fade-in" [style.animation-delay]="i * 0.06 + 's'">
              <!-- Post Header -->
              <div class="event-card-header">
                <img [src]="event.organizerAvatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=org'" [alt]="event.organizerName">
                <div>
                  <div class="organizer-name">{{ event.organizerName }}</div>
                  <div class="event-meta">{{ getTimeAgo(event.createdAt) }} · {{ event.category }}</div>
                </div>
                @if (event.isFeatured) {
                  <span class="featured-tag"><i class="ri-star-fill"></i> Destaque</span>
                }
                <div style="margin-left: auto">
                  <button class="icon-btn" style="width: 32px; height: 32px; font-size: 0.9rem"><i class="ri-more-2-fill"></i></button>
                </div>
              </div>

              <!-- Post Text -->
              @if (event.description) {
                <div class="post-text">
                  {{ event.description!.length > 180 ? event.description!.substring(0, 180) + '...' : event.description }}
                  @if (event.description!.length > 180) {
                    <a [routerLink]="['/event', event.slug]" class="read-more">ver mais</a>
                  }
                </div>
              }

              <!-- Post Image -->
              <a [routerLink]="['/event', event.slug]" class="event-image-wrapper">
                <img [src]="event.imageUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800'" [alt]="event.title" loading="lazy">
                <div class="event-date-badge">
                  <div class="day">{{ getDay(event.startDateTime) }}</div>
                  <div class="month">{{ getMonth(event.startDateTime) }}</div>
                </div>
              </a>

              <!-- Post Info -->
              <div class="event-content">
                <a [routerLink]="['/event', event.slug]" style="text-decoration:none">
                  <div class="event-title">{{ event.title }}</div>
                </a>
                @if (event.venue) {
                  <div class="event-location"><i class="ri-map-pin-2-fill"></i> {{ event.venue.name }}, {{ event.venue.city }}</div>
                }
                <div class="event-price">
                  @if (getMinPrice(event) === 0) {
                    <span class="price-tag"><i class="ri-ticket-line"></i> Grátis</span>
                  } @else {
                    <span class="price-tag"><i class="ri-ticket-line"></i> Desde {{ getMinPrice(event) | number }} Kz</span>
                  }
                  @if (event.isHybrid) {
                    <span class="price-tag" style="background: rgba(59,130,246,0.12); color: var(--info)"><i class="ri-live-line"></i> Híbrido</span>
                  }
                </div>
              </div>

              <!-- Actions Bar -->
              <div class="event-actions">
                <button class="event-action-btn" [class.liked]="likedEvents.has(event.id)" (click)="toggleLike(event)">
                  <i [class]="likedEvents.has(event.id) ? 'ri-heart-3-fill' : 'ri-heart-3-line'"></i> {{ event.likesCount }}
                </button>
                <button class="event-action-btn" (click)="toggleComments(event.id)">
                  <i class="ri-chat-3-line"></i> {{ event.commentsCount }}
                </button>
                <div style="position: relative">
                  <button class="event-action-btn" (click)="toggleShareMenu(event.id)">
                    <i class="ri-share-forward-line"></i> {{ event.sharesCount }}
                  </button>
                  @if (openShareMenuId === event.id) {
                    <div class="share-dropdown">
                      <div class="share-title"><i class="ri-share-line"></i> Partilhar</div>
                      <a class="share-option whatsapp" [href]="'https://wa.me/?text=' + encodeShare(event)" target="_blank" rel="noopener">
                        <i class="ri-whatsapp-line"></i> WhatsApp
                      </a>
                      <a class="share-option facebook" [href]="'https://www.facebook.com/sharer/sharer.php?u=' + getEventUrl(event)" target="_blank" rel="noopener">
                        <i class="ri-facebook-fill"></i> Facebook
                      </a>
                      <a class="share-option twitter" [href]="'https://x.com/intent/tweet?text=' + encodeShare(event)" target="_blank" rel="noopener">
                        <i class="ri-twitter-x-fill"></i> X (Twitter)
                      </a>
                      <a class="share-option telegram" [href]="'https://t.me/share/url?url=' + getEventUrl(event) + '&text=' + encodeURIComponent(event.title)" target="_blank" rel="noopener">
                        <i class="ri-telegram-fill"></i> Telegram
                      </a>
                      <button class="share-option instagram" (click)="copyLink(event)">
                        <i class="ri-instagram-line"></i> Instagram (copiar link)
                      </button>
                      <div style="border-top: 1px solid var(--border-color); margin: 6px 0"></div>
                      <button class="share-option followers" (click)="shareWithFollowers(event)">
                        <i class="ri-user-heart-line"></i> Partilhar com seguidores
                      </button>
                      @if (shareMsg) {
                        <div class="share-msg">{{ shareMsg }}</div>
                      }
                    </div>
                  }
                </div>
                <a [routerLink]="['/event', event.slug]" class="event-action-btn" style="margin-left: auto; text-decoration: none">
                  <i class="ri-arrow-right-up-line"></i> Ver
                </a>
              </div>

              <!-- Inline Comments Section -->
              @if (expandedComments.has(event.id)) {
                <div class="inline-comments">
                  <!-- Post a comment -->
                  <div class="comment-input-row">
                    <img [src]="auth.currentUser()?.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=user'" class="comment-avatar">
                    <div style="flex: 1; display: flex; gap: 6px">
                      <div style="display: flex; gap: 2px; align-items: center; margin-right: 4px">
                        @for (s of [1,2,3,4,5]; track s) {
                          <button class="star-btn" (click)="commentRatings[event.id] = s">
                            <i [class]="s <= (commentRatings[event.id] || 5) ? 'ri-star-fill' : 'ri-star-line'"></i>
                          </button>
                        }
                      </div>
                      <input type="text" class="form-control" style="flex: 1; padding: 8px 12px; font-size: 0.8rem"
                             [placeholder]="'Comentar...'" [(ngModel)]="commentTexts[event.id]"
                             (keyup.enter)="postComment(event.id)">
                      <button class="btn btn-primary btn-sm" style="padding: 6px 12px" (click)="postComment(event.id)"><i class="ri-send-plane-fill"></i></button>
                    </div>
                  </div>

                  <!-- Comments list -->
                  @if (eventComments[event.id]?.length) {
                    @for (c of eventComments[event.id].slice(0, 3); track c.id) {
                      <div class="comment-item">
                        <img [src]="c.userAvatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=user'" class="comment-avatar">
                        <div>
                          <div style="display: flex; gap: 6px; align-items: center">
                            <strong style="font-size: 0.8rem">{{ c.userName }}</strong>
                            <span class="comment-stars">
                              @for (s of [1,2,3,4,5]; track s) {
                                <i [class]="s <= c.rating ? 'ri-star-fill' : 'ri-star-line'"></i>
                              }
                            </span>
                            <span style="font-size: 0.65rem; color: var(--text-muted)">{{ getTimeAgo(c.createdAt) }}</span>
                          </div>
                          <p style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 2px">{{ c.body }}</p>
                        </div>
                      </div>
                    }
                    @if ((eventComments[event.id]?.length || 0) > 3) {
                      <a [routerLink]="['/event', event.slug]" style="font-size: 0.75rem; color: var(--accent-primary); padding-left: 48px">Ver todos os {{ eventComments[event.id].length }} comentários →</a>
                    }
                  } @else {
                    <p style="font-size: 0.75rem; color: var(--text-muted); padding-left: 48px; padding-bottom: 8px">Sê o primeiro a comentar!</p>
                  }
                </div>
              }
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .stories-bar {
      display: flex; gap: 14px; padding: 16px 0; margin-bottom: 0;
      overflow-x: auto; scrollbar-width: none;
      position: sticky; top: 0; z-index: 10;
      background: var(--bg-primary); border-bottom: 1px solid var(--border-color);
      padding-bottom: 12px; margin-left: -24px; margin-right: -24px; padding-left: 24px; padding-right: 24px;
    }
    .stories-bar::-webkit-scrollbar { display: none; }
    .story-item {
      display: flex; flex-direction: column; align-items: center;
      gap: 6px; cursor: pointer; text-decoration: none; flex-shrink: 0;
    }
    .story-avatar {
      width: 68px; height: 68px; border-radius: 50%;
      background-size: cover; background-position: center;
      border: 3px solid var(--accent-primary); padding: 2px;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .story-avatar:hover { transform: scale(1.08); box-shadow: 0 0 16px rgba(242,196,0,0.3); }
    .story-item.viewed .story-avatar { border-color: var(--border-color); opacity: 0.7; }
    .story-avatar.add-story {
      border-style: dashed; border-color: var(--accent-primary);
      display: flex; align-items: center; justify-content: center;
      font-size: 1.5rem; color: var(--accent-primary); background: var(--bg-surface);
    }
    .story-name {
      font-size: 0.7rem; color: var(--text-tertiary);
      max-width: 68px; text-align: center;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .feed-list { display: flex; flex-direction: column; gap: 20px; max-width: 680px; margin: 16px auto 0; }
    .featured-tag {
      font-size: 0.65rem; font-weight: 600; padding: 3px 8px;
      border-radius: 50px; background: var(--accent-gradient); color: #000;
    }
    .post-text { padding: 0 16px 10px; font-size: 0.875rem; color: var(--text-secondary); line-height: 1.5; }
    .read-more { color: var(--accent-primary); font-weight: 600; text-decoration: none; }
    /* Inline Comments */
    .inline-comments { border-top: 1px solid var(--border-color); padding: 12px 16px; }
    .comment-input-row { display: flex; gap: 8px; align-items: center; margin-bottom: 10px; }
    .comment-avatar { width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0; }
    .comment-item { display: flex; gap: 8px; padding: 6px 0; }
    .comment-stars { font-size: 0.6rem; color: var(--accent-primary); }
    .star-btn {
      background: none; border: none; cursor: pointer; padding: 0;
      font-size: 0.85rem; color: var(--accent-primary); line-height: 1;
    }
    /* Story Creator */
    .story-creator-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,0.7);
      display: flex; align-items: center; justify-content: center; z-index: 1000;
      animation: fadeIn 0.2s;
    }
    .story-creator-card {
      background: var(--bg-card); border: 1px solid var(--border-color);
      border-radius: var(--radius-lg); padding: 24px; width: 90%; max-width: 440px;
    }
    .story-image-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
    .story-img-option {
      aspect-ratio: 1; border-radius: 8px; overflow: hidden; cursor: pointer;
      border: 3px solid transparent; transition: all 0.2s;
    }
    .story-img-option.selected { border-color: var(--accent-primary); box-shadow: 0 0 12px rgba(242,196,0,0.4); }
    /* Story Viewer */
    .story-viewer-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,0.9);
      display: flex; align-items: center; justify-content: center; z-index: 1000;
    }
    .story-viewer {
      position: relative; max-width: 400px; width: 90%;
      border-radius: var(--radius-lg); overflow: hidden;
    }
    .story-viewer-img { width: 100%; max-height: 80vh; object-fit: cover; display: block; }
    .story-viewer-header {
      position: absolute; top: 0; left: 0; right: 0;
      display: flex; gap: 10px; align-items: center;
      padding: 16px; background: linear-gradient(to bottom, rgba(0,0,0,0.7), transparent);
    }
    .story-viewer-footer {
      position: absolute; bottom: 0; left: 0; right: 0;
      padding: 16px; background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
    }
    /* Share Dropdown */
    .share-dropdown {
      position: absolute; bottom: 100%; left: 0; z-index: 50;
      background: var(--bg-card); border: 1px solid var(--border-color);
      border-radius: var(--radius-lg); padding: 10px; min-width: 220px;
      box-shadow: 0 8px 30px rgba(0,0,0,0.3); animation: shareIn 0.15s;
    }
    .share-title { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); padding: 4px 8px; letter-spacing: 1px; }
    .share-option {
      display: flex; align-items: center; gap: 10px; padding: 8px 10px;
      border-radius: var(--radius-sm); font-size: 0.83rem; color: var(--text-primary);
      text-decoration: none; border: none; background: none; width: 100%;
      cursor: pointer; transition: background 0.15s;
    }
    .share-option:hover { background: var(--bg-surface); }
    .share-option.whatsapp i { color: #25D366; }
    .share-option.facebook i { color: #1877F2; }
    .share-option.twitter i { color: var(--text-primary); }
    .share-option.telegram i { color: #0088cc; }
    .share-option.instagram i { color: #E4405F; }
    .share-option.followers i { color: var(--accent-primary); }
    .share-msg { font-size: 0.75rem; color: var(--success); text-align: center; padding: 6px; }
    @keyframes shareIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class FeedComponent implements OnInit {
  events: BodaEvent[] = [];
  stories: BodaEvent[] = [];
  loading = true;
  likedEvents = new Set<number>();

  // Stories
  viewedStories = new Set<number>();
  showStoryCreator = false;
  viewingStory: BodaEvent | null = null;
  selectedStoryImage = '';
  storyCaption = '';
  storyImages = [
    'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400',
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400',
    'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400',
    'https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=400',
    'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=400',
    'https://images.unsplash.com/photo-1571266028243-d220e6a767e3?w=400',
  ];

  // Inline comments
  expandedComments = new Set<number>();
  eventComments: { [eventId: number]: BodaComment[] } = {};
  commentTexts: { [eventId: number]: string } = {};
  commentRatings: { [eventId: number]: number } = {};

  // Share menu
  openShareMenuId: number | null = null;
  shareMsg = '';

  constructor(public auth: AuthService, private api: ApiService) { }

  ngOnInit() {
    this.api.getEvents().subscribe({
      next: events => {
        this.events = events;
        this.stories = events.filter(e => e.isFeatured || e.imageUrl).slice(0, 10);
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  getFirstName(): string { return this.auth.currentUser()?.name?.split(' ')[0] || ''; }
  getDay(date: string): string { return new Date(date).getDate().toString().padStart(2, '0'); }
  getMonth(date: string): string { return new Date(date).toLocaleString('pt', { month: 'short' }).toUpperCase(); }
  getMinPrice(event: BodaEvent): number { return event.tickets?.length ? Math.min(...event.tickets.map(t => t.price)) : 0; }

  getTimeAgo(date: string): string {
    const diff = Date.now() - new Date(date).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return 'agora';
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d`;
    return `${Math.floor(days / 7)}sem`;
  }

  toggleLike(event: BodaEvent) {
    if (this.likedEvents.has(event.id)) {
      this.likedEvents.delete(event.id);
      event.likesCount--;
    } else {
      this.likedEvents.add(event.id);
      this.api.likeEvent(event.id).subscribe({ next: r => event.likesCount = r.likesCount });
    }
  }

  toggleComments(eventId: number) {
    if (this.expandedComments.has(eventId)) {
      this.expandedComments.delete(eventId);
    } else {
      this.expandedComments.add(eventId);
      if (!this.eventComments[eventId]) {
        this.api.getComments(eventId).subscribe(c => this.eventComments[eventId] = c);
      }
      if (!this.commentRatings[eventId]) this.commentRatings[eventId] = 5;
    }
  }

  postComment(eventId: number) {
    const text = this.commentTexts[eventId]?.trim();
    if (!text) return;
    const rating = this.commentRatings[eventId] || 5;
    this.api.createComment(eventId, rating, text).subscribe({
      next: comment => {
        if (!this.eventComments[eventId]) this.eventComments[eventId] = [];
        this.eventComments[eventId].unshift(comment);
        this.commentTexts[eventId] = '';
        // Update count
        const ev = this.events.find(e => e.id === eventId);
        if (ev) ev.commentsCount++;
      }
    });
  }

  viewStory(story: BodaEvent) {
    this.viewingStory = story;
    this.viewedStories.add(story.id);
  }

  postStory() {
    this.showStoryCreator = false;
    this.selectedStoryImage = '';
    this.storyCaption = '';
  }

  // ── Social Sharing ──────────────────────────────────────
  toggleShareMenu(eventId: number) {
    this.openShareMenuId = this.openShareMenuId === eventId ? null : eventId;
    this.shareMsg = '';
  }

  getEventUrl(event: BodaEvent): string {
    return encodeURIComponent(`${window.location.origin}/event/${event.slug}`);
  }

  encodeShare(event: BodaEvent): string {
    return encodeURIComponent(`${event.title} — ${window.location.origin}/event/${event.slug}`);
  }

  encodeURIComponent(str: string): string {
    return encodeURIComponent(str);
  }

  copyLink(event: BodaEvent) {
    const link = `${window.location.origin}/event/${event.slug}`;
    navigator.clipboard.writeText(link).then(() => {
      this.shareMsg = '✓ Link copiado!';
      setTimeout(() => { this.shareMsg = ''; this.openShareMenuId = null; }, 1500);
    });
  }

  shareWithFollowers(event: BodaEvent) {
    this.shareMsg = '✓ Partilhado com seguidores!';
    event.sharesCount++;
    setTimeout(() => { this.shareMsg = ''; this.openShareMenuId = null; }, 1500);
  }
}
