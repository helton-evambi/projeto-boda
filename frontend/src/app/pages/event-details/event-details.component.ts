import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { BodaEvent, Comment as BodaComment, OrderDto } from '../../core/models/models';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    @if (loading) {
      <div class="loading" style="min-height: 100vh"><div class="spinner"></div></div>
    } @else if (event) {
      <div class="content-header">
        <a routerLink="/explore" style="font-size: 1.2rem; text-decoration: none"><i class="ri-arrow-left-line"></i></a>
        <h2>{{ event.title }}</h2>
      </div>

      <div class="content-body fade-in">
        <div class="event-detail-layout">
          <!-- Main Column -->
          <div class="event-main">
            <div class="event-hero">
              <img [src]="event.imageUrl" [alt]="event.title" class="event-hero-img">
              @if (event.isFeatured) {
                <span class="event-badge featured" style="position: absolute; top: 16px; left: 16px"><i class="ri-star-fill"></i> Em Destaque</span>
              }
            </div>

            <div class="card" style="margin-top: -30px; position: relative; z-index: 1">
              <div class="card-body" style="padding: 24px">
                <div style="display: flex; gap: 12px; align-items: center; margin-bottom: 16px">
                  <img [src]="event.organizerAvatar" style="width: 44px; height: 44px; border-radius: 50%; border: 2px solid var(--accent-primary)">
                  <div>
                    <div style="font-weight: 600">{{ event.organizerName }}</div>
                    <div style="font-size: 0.75rem; color: var(--text-muted)">Organizador</div>
                  </div>
                  <button class="btn btn-outline btn-sm" style="margin-left: auto"><i class="ri-user-add-line"></i> Seguir</button>
                </div>

                <h1 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 12px">{{ event.title }}</h1>

                <div class="detail-row"><i class="ri-calendar-event-line"></i> {{ event.startDateTime | date:'EEEE, d MMM y':'':'pt' }} · {{ event.startDateTime | date:'HH:mm' }} - {{ event.endDateTime | date:'HH:mm' }}</div>
                @if (event.venue) {
                  <div class="detail-row"><i class="ri-map-pin-2-fill"></i> {{ event.venue.name }} — {{ event.venue.address }}, {{ event.venue.city }}</div>
                }
                <div class="detail-row"><i class="ri-group-line"></i> Capacidade: {{ event.capacity | number }} pessoas</div>
                @if (event.minAge > 0) {
                  <div class="detail-row"><i class="ri-shield-user-line"></i> Idade mínima: {{ event.minAge }} anos</div>
                }
                @if (event.isHybrid) {
                  <div class="detail-row"><i class="ri-live-line"></i> Evento híbrido — streaming disponível</div>
                }

                <div class="social-stats">
                  <button class="event-action-btn" [class.liked]="liked" (click)="toggleLike()">
                    <i [class]="liked ? 'ri-heart-3-fill' : 'ri-heart-3-line'"></i> {{ event.likesCount }}
                  </button>
                  <span><i class="ri-chat-3-line"></i> {{ event.commentsCount }} comentários</span>
                  <div style="position: relative">
                    <button class="event-action-btn" (click)="showShareMenu = !showShareMenu">
                      <i class="ri-share-forward-line"></i> {{ event.sharesCount }} partilhas
                    </button>
                    @if (showShareMenu) {
                      <div class="share-dropdown">
                        <div class="share-title"><i class="ri-share-line"></i> Partilhar evento</div>
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
                </div>

                @if (event.description) {
                  <div class="event-desc">
                    <h3>Sobre o evento</h3>
                    <p>{{ event.description }}</p>
                  </div>
                }
                @if (event.refundPolicy) {
                  <div style="margin-top: 16px; padding: 12px; background: var(--bg-surface); border-radius: var(--radius-sm); font-size: 0.8rem; color: var(--text-tertiary)">
                    <strong><i class="ri-refund-2-line"></i> Política de reembolso:</strong> {{ event.refundPolicy }}
                  </div>
                }
              </div>
            </div>

            <!-- Comments -->
            <div class="card" style="margin-top: 20px">
              <div class="card-body" style="padding: 20px">
                <h3 style="margin-bottom: 16px"><i class="ri-chat-3-line"></i> Comentários ({{ comments.length }})</h3>

                @if (auth.isLoggedIn()) {
                  <div style="display: flex; gap: 12px; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid var(--border-color)">
                    <img [src]="auth.currentUser()?.avatarUrl" style="width: 40px; height: 40px; border-radius: 50%">
                    <div style="flex: 1">
                      <div style="display: flex; gap: 6px; margin-bottom: 8px">
                        @for (star of [1,2,3,4,5]; track star) {
                          <button (click)="newRating = star" style="background: none; border: none; cursor: pointer; font-size: 1.2rem; color: var(--accent-primary)">
                            <i [class]="star <= newRating ? 'ri-star-fill' : 'ri-star-line'"></i>
                          </button>
                        }
                      </div>
                      <textarea class="form-control" [(ngModel)]="newComment" placeholder="Escrever comentário..." rows="2"></textarea>
                      <button class="btn btn-primary btn-sm" style="margin-top: 8px" (click)="postComment()"><i class="ri-send-plane-fill"></i> Publicar</button>
                    </div>
                  </div>
                }

                @for (comment of comments; track comment.id) {
                  <div style="display: flex; gap: 12px; padding: 12px 0; border-bottom: 1px solid var(--border-color)">
                    <img [src]="comment.userAvatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=user'" style="width: 36px; height: 36px; border-radius: 50%">
                    <div style="flex: 1">
                      <div style="display: flex; justify-content: space-between">
                        <strong style="font-size: 0.85rem">{{ comment.userName }}</strong>
                        <div style="display: flex; gap: 8px; align-items: center">
                          <span style="font-size: 0.7rem; color: var(--text-muted)">{{ comment.createdAt | date:'d MMM' }}</span>
                          <button class="icon-btn" style="width: 24px; height: 24px; font-size: 0.75rem" (click)="reportComment(comment.id)" title="Reportar"><i class="ri-flag-line"></i></button>
                        </div>
                      </div>
                      <div style="margin: 4px 0; font-size: 0.8rem; color: var(--accent-primary)">
                        @for (s of [1,2,3,4,5]; track s) {
                          <i [class]="s <= comment.rating ? 'ri-star-fill' : 'ri-star-line'"></i>
                        }
                      </div>
                      <p style="font-size: 0.85rem; color: var(--text-secondary)">{{ comment.body }}</p>
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>

          <!-- Sidebar — Tickets & Checkout -->
          <div class="event-sidebar">
            <div class="card" style="position: sticky; top: calc(var(--header-height) + 24px)">
              <div class="card-body" style="padding: 20px">
                <!-- Normal view: ticket selection -->
                @if (!checkoutMode && !checkoutResult) {
                  <h3 style="margin-bottom: 16px"><i class="ri-ticket-line"></i> Bilhetes</h3>

                  @for (ticket of event.tickets; track ticket.id) {
                    <div class="ticket-option" [class.sold-out]="ticket.available <= 0" [class.selected]="selectedTicket?.id === ticket.id"
                         (click)="ticket.available > 0 && selectTicket(ticket)">
                      <div style="display: flex; justify-content: space-between; align-items: center">
                        <div>
                          <div style="font-weight: 600; font-size: 0.9rem">{{ ticket.type }}</div>
                          <div style="font-size: 0.75rem; color: var(--text-muted)">{{ ticket.available }} restantes</div>
                        </div>
                        <div style="text-align: right">
                          @if (ticket.price === 0) {
                            <div style="font-weight: 700; color: var(--success)">Grátis</div>
                          } @else {
                            <div style="font-weight: 700; color: var(--accent-primary)">{{ ticket.price | number }} Kz</div>
                          }
                        </div>
                      </div>
                    </div>
                  }

                  @if (selectedTicket) {
                    <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--border-color)">
                      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px">
                        <label style="font-size: 0.85rem">Quantidade:</label>
                        <select class="form-control" style="width: 70px; padding: 6px" [(ngModel)]="quantity">
                          @for (n of [1,2,3,4,5]; track n) {
                            <option [value]="n">{{ n }}</option>
                          }
                        </select>
                      </div>
                      <button class="btn btn-primary btn-block" (click)="startCheckout()"><i class="ri-shopping-cart-line"></i> Comprar — {{ selectedTicket.price * quantity | number }} Kz</button>
                    </div>
                  }
                }

                <!-- Checkout mode -->
                @if (checkoutMode && !checkoutResult) {
                  <h3 style="margin-bottom: 16px"><i class="ri-shopping-cart-line"></i> Checkout</h3>

                  <div style="padding: 12px; background: var(--bg-surface); border-radius: var(--radius-sm); margin-bottom: 16px">
                    <div style="font-weight: 600">{{ selectedTicket?.type }}</div>
                    <div style="font-size: 0.85rem; color: var(--text-secondary)">{{ quantity }}x {{ selectedTicket?.price | number }} Kz</div>
                    <div style="font-weight: 700; font-size: 1.1rem; color: var(--accent-primary); margin-top: 4px">
                      Subtotal: {{ (selectedTicket?.price || 0) * quantity | number }} Kz
                    </div>
                  </div>

                  <!-- Promo code -->
                  <div class="form-group">
                    <label style="font-size: 0.8rem"><i class="ri-coupon-3-line"></i> Código promocional</label>
                    <div style="display: flex; gap: 8px">
                      <input type="text" class="form-control" [(ngModel)]="promoCode" placeholder="BODA20" style="flex: 1">
                      <button class="btn btn-sm btn-secondary" (click)="validatePromo()" [disabled]="!promoCode">Aplicar</button>
                    </div>
                    @if (promoMessage) {
                      <div style="font-size: 0.75rem; margin-top: 4px" [style.color]="promoValid ? 'var(--success)' : 'var(--danger)'">
                        {{ promoMessage }}
                      </div>
                    }
                  </div>

                  <!-- Payment method -->
                  <div class="form-group">
                    <label style="font-size: 0.8rem"><i class="ri-bank-card-line"></i> Método de pagamento</label>
                    <select class="form-control" [(ngModel)]="paymentMethod">
                      <option value="Multicaixa">Multicaixa Express</option>
                      <option value="BAI Pay">BAI Pay</option>
                      <option value="Transferência">Transferência Bancária</option>
                      <option value="Stripe">Cartão (Stripe)</option>
                    </select>
                  </div>

                  <div style="display: flex; gap: 8px">
                    <button class="btn btn-secondary btn-block" (click)="checkoutMode = false"><i class="ri-arrow-left-line"></i> Voltar</button>
                    <button class="btn btn-primary btn-block" (click)="confirmCheckout()" [disabled]="purchasing">
                      <i class="ri-check-line"></i> {{ purchasing ? 'A processar...' : 'Confirmar' }}
                    </button>
                  </div>
                }

                <!-- Success -->
                @if (checkoutResult) {
                  <div style="text-align: center; padding: 16px 0">
                    <div style="font-size: 3rem; color: var(--success); margin-bottom: 8px"><i class="ri-checkbox-circle-fill"></i></div>
                    <h3 style="color: var(--success)">Compra confirmada!</h3>
                    <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 8px 0">{{ checkoutResult.ticketType }} x{{ checkoutResult.quantity }}</p>
                    <p style="font-weight: 700; font-size: 1.2rem; color: var(--accent-primary)">{{ checkoutResult.totalAmount | number }} Kz</p>

                    @for (t of checkoutResult.tickets; track t.id) {
                      <div style="margin-top: 16px; padding: 12px; background: var(--bg-surface); border-radius: var(--radius-md); border: 1px dashed var(--accent-primary)">
                        <div style="font-size: 0.7rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 4px">Código do Bilhete</div>
                        <code style="font-size: 1rem; letter-spacing: 2px; color: var(--accent-primary)">{{ t.ticketCode }}</code>
                        @if (t.qrCodeUrl) {
                          <div style="margin-top: 8px">
                            <img [src]="t.qrCodeUrl" style="width: 120px; height: 120px; border-radius: 8px; background: #fff; padding: 4px" alt="QR Code">
                          </div>
                        }
                      </div>
                    }

                    <button class="btn btn-secondary btn-block" style="margin-top: 16px" (click)="resetCheckout()"><i class="ri-arrow-left-line"></i> Voltar ao evento</button>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .event-detail-layout { display: grid; grid-template-columns: 1fr 340px; gap: 24px; align-items: start; }
    .event-hero { position: relative; border-radius: var(--radius-lg); overflow: hidden; }
    .event-hero-img { width: 100%; max-height: 400px; object-fit: cover; display: block; }
    .detail-row { padding: 8px 0; font-size: 0.9rem; color: var(--text-secondary); border-bottom: 1px solid var(--border-color); display: flex; align-items: center; gap: 8px; }
    .detail-row i { color: var(--accent-primary); font-size: 1.1rem; width: 20px; }
    .social-stats { display: flex; gap: 20px; padding: 14px 0; font-size: 0.85rem; color: var(--text-tertiary); align-items: center; }
    .social-stats i { margin-right: 4px; }
    .event-desc { margin-top: 16px; }
    .event-desc h3 { font-size: 1rem; margin-bottom: 8px; }
    .event-desc p { font-size: 0.9rem; color: var(--text-secondary); line-height: 1.7; }
    .ticket-option { padding: 14px; border: 1px solid var(--border-color); border-radius: var(--radius-md); margin-bottom: 10px; transition: all 0.2s; cursor: pointer; }
    .ticket-option:hover { border-color: var(--accent-primary); }
    .ticket-option.selected { border-color: var(--accent-primary); background: rgba(242,196,0,0.06); }
    .ticket-option.sold-out { opacity: 0.5; cursor: not-allowed; }
    .share-dropdown {
      position: absolute; top: 100%; left: 0; z-index: 50;
      background: var(--bg-card); border: 1px solid var(--border-color);
      border-radius: var(--radius-lg); padding: 10px; min-width: 220px;
      box-shadow: 0 8px 30px rgba(0,0,0,0.3); animation: fadeIn 0.15s;
    }
    .share-title { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); padding: 4px 8px; letter-spacing: 1px; }
    .share-option {
      display: flex; align-items: center; gap: 10px; padding: 9px 10px;
      border-radius: var(--radius-sm); font-size: 0.85rem; color: var(--text-primary);
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
    .share-msg { font-size: 0.75rem; color: var(--success); text-align: center; padding: 6px; animation: fadeIn 0.2s; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
    @media (max-width: 900px) { .event-detail-layout { grid-template-columns: 1fr; } }
  `]
})
export class EventDetailsComponent implements OnInit {
  event: BodaEvent | null = null;
  comments: BodaComment[] = [];
  loading = true;
  liked = false;
  showShareMenu = false;
  shareMsg = '';

  // Comments
  newComment = '';
  newRating = 5;

  // Checkout
  selectedTicket: any = null;
  quantity = 1;
  checkoutMode = false;
  promoCode = '';
  promoMessage = '';
  promoValid = false;
  paymentMethod = 'Multicaixa';
  purchasing = false;
  checkoutResult: OrderDto | null = null;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    public auth: AuthService
  ) { }

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug')!;
    this.api.getEvent(slug).subscribe({
      next: event => {
        this.event = event;
        this.loading = false;
        this.api.getComments(event.id).subscribe(c => this.comments = c);
      },
      error: () => this.loading = false
    });
  }

  selectTicket(ticket: any) {
    this.selectedTicket = this.selectedTicket?.id === ticket.id ? null : ticket;
    this.quantity = 1;
  }

  startCheckout() {
    this.checkoutMode = true;
    this.promoCode = '';
    this.promoMessage = '';
    this.promoValid = false;
  }

  validatePromo() {
    if (!this.promoCode || !this.event) return;
    this.api.validatePromo(this.promoCode, this.event.id).subscribe({
      next: result => {
        this.promoValid = true;
        const desc = result.discountType === 'percentage' ? `${result.value}% de desconto` : `${result.value} Kz de desconto`;
        this.promoMessage = `✓ Código "${result.code}" válido! ${desc}`;
      },
      error: () => {
        this.promoValid = false;
        this.promoMessage = '✗ Código inválido ou expirado.';
      }
    });
  }

  confirmCheckout() {
    if (!this.selectedTicket) return;
    this.purchasing = true;
    this.api.checkout(
      this.selectedTicket.id,
      this.quantity,
      this.promoValid ? this.promoCode : undefined,
      this.paymentMethod
    ).subscribe({
      next: result => {
        this.checkoutResult = result;
        this.purchasing = false;
        this.checkoutMode = false;
      },
      error: () => this.purchasing = false
    });
  }

  resetCheckout() {
    this.checkoutResult = null;
    this.selectedTicket = null;
    this.checkoutMode = false;
  }

  toggleLike() {
    if (!this.event) return;
    this.api.likeEvent(this.event.id).subscribe({
      next: result => {
        this.event!.likesCount = result.likesCount;
        this.liked = !this.liked;
      }
    });
  }

  postComment() {
    if (!this.event || !this.newComment.trim()) return;
    this.api.createComment(this.event.id, this.newRating, this.newComment).subscribe({
      next: comment => {
        this.comments.unshift(comment);
        this.newComment = '';
        this.newRating = 5;
      }
    });
  }

  // ── Sharing ──────────────────────────────────────────
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
      setTimeout(() => { this.shareMsg = ''; this.showShareMenu = false; }, 1500);
    });
  }

  shareWithFollowers(event: BodaEvent) {
    this.shareMsg = '✓ Partilhado com os teus seguidores!';
    event.sharesCount++;
    setTimeout(() => { this.shareMsg = ''; this.showShareMenu = false; }, 1500);
  }

  reportComment(id: number) {
    this.api.reportComment(id).subscribe(() => {
      alert('Comentário reportado. A equipa vai analisar.');
    });
  }
}
