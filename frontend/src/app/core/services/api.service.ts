import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BodaEvent, Comment, Message, Notification, User, DashboardStats, OrderDto, SearchSuggestion, Venue } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ApiService {
    private base = 'http://localhost:5214/api';

    constructor(private http: HttpClient) { }

    // ── Events ──────────────────────────────────────────

    getEvents(params?: {
        city?: string; category?: string; q?: string; featured?: boolean;
        priceMin?: number; priceMax?: number; sort?: string; page?: number;
    }): Observable<BodaEvent[]> {
        let httpParams = new HttpParams();
        if (params?.city) httpParams = httpParams.set('city', params.city);
        if (params?.category) httpParams = httpParams.set('category', params.category);
        if (params?.q) httpParams = httpParams.set('q', params.q);
        if (params?.featured) httpParams = httpParams.set('featured', 'true');
        if (params?.priceMin) httpParams = httpParams.set('priceMin', params.priceMin.toString());
        if (params?.priceMax) httpParams = httpParams.set('priceMax', params.priceMax.toString());
        if (params?.sort) httpParams = httpParams.set('sort', params.sort);
        if (params?.page) httpParams = httpParams.set('page', params.page.toString());
        return this.http.get<BodaEvent[]>(`${this.base}/events`, { params: httpParams });
    }

    getEvent(slug: string): Observable<BodaEvent> {
        return this.http.get<BodaEvent>(`${this.base}/events/${slug}`);
    }

    createEvent(event: any): Observable<BodaEvent> {
        return this.http.post<BodaEvent>(`${this.base}/events`, event);
    }

    updateEvent(id: number, event: any): Observable<BodaEvent> {
        return this.http.put<BodaEvent>(`${this.base}/events/${id}`, event);
    }

    cancelEvent(id: number): Observable<any> {
        return this.http.delete(`${this.base}/events/${id}`);
    }

    likeEvent(id: number): Observable<{ likesCount: number }> {
        return this.http.post<{ likesCount: number }>(`${this.base}/events/${id}/like`, {});
    }

    searchEvents(q: string): Observable<SearchSuggestion[]> {
        return this.http.get<SearchSuggestion[]>(`${this.base}/events/search`, { params: { q } });
    }

    getCategories(): Observable<string[]> {
        return this.http.get<string[]>(`${this.base}/events/categories`);
    }

    getCities(): Observable<string[]> {
        return this.http.get<string[]>(`${this.base}/events/cities`);
    }

    getVenues(): Observable<Venue[]> {
        return this.http.get<Venue[]>(`${this.base}/events/venues`);
    }

    getAttendees(eventId: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.base}/events/${eventId}/attendees`);
    }

    // ── Orders / Checkout ───────────────────────────────

    checkout(ticketId: number, quantity: number, promoCode?: string, paymentMethod?: string): Observable<OrderDto> {
        return this.http.post<OrderDto>(`${this.base}/orders/checkout`, {
            ticketId, quantity, promoCode, paymentMethod
        });
    }

    getMyOrders(): Observable<OrderDto[]> {
        return this.http.get<OrderDto[]>(`${this.base}/orders/my`);
    }

    validatePromo(code: string, eventId?: number): Observable<{ code: string; discountType: string; value: number; valid: boolean }> {
        return this.http.post<any>(`${this.base}/orders/validate-promo`, { code, eventId });
    }

    // ── Users ───────────────────────────────────────────

    getUser(id: number): Observable<User> {
        return this.http.get<User>(`${this.base}/users/${id}`);
    }

    getUsers(role?: string): Observable<User[]> {
        let params = new HttpParams();
        if (role) params = params.set('role', role);
        return this.http.get<User[]>(`${this.base}/users`, { params });
    }

    followUser(id: number): Observable<any> {
        return this.http.post(`${this.base}/users/${id}/follow`, {});
    }

    unfollowUser(id: number): Observable<any> {
        return this.http.delete(`${this.base}/users/${id}/follow`);
    }

    updateProfile(data: any): Observable<User> {
        return this.http.put<User>(`${this.base}/users/me`, data);
    }

    changePassword(currentPassword: string, newPassword: string): Observable<any> {
        return this.http.put(`${this.base}/auth/change-password`, { currentPassword, newPassword });
    }

    // ── Comments ────────────────────────────────────────

    getComments(eventId: number): Observable<Comment[]> {
        return this.http.get<Comment[]>(`${this.base}/comments/event/${eventId}`);
    }

    createComment(eventId: number, rating: number, body: string): Observable<Comment> {
        return this.http.post<Comment>(`${this.base}/comments/event/${eventId}`, { rating, body });
    }

    reportComment(id: number): Observable<any> {
        return this.http.post(`${this.base}/comments/${id}/report`, {});
    }

    deleteComment(id: number): Observable<any> {
        return this.http.delete(`${this.base}/comments/${id}`);
    }

    // ── Messages ────────────────────────────────────────

    getMessages(): Observable<Message[]> {
        return this.http.get<Message[]>(`${this.base}/messages`);
    }

    sendMessage(toUserId: number, subject: string, body: string): Observable<Message> {
        return this.http.post<Message>(`${this.base}/messages`, { toUserId, subject, body });
    }

    // ── Notifications ───────────────────────────────────

    getNotifications(): Observable<Notification[]> {
        return this.http.get<Notification[]>(`${this.base}/notifications`);
    }

    getUnreadCount(): Observable<number> {
        return this.http.get<number>(`${this.base}/notifications/unread-count`);
    }

    markAsRead(id: number): Observable<any> {
        return this.http.put(`${this.base}/notifications/${id}/read`, {});
    }

    markAllAsRead(): Observable<any> {
        return this.http.put(`${this.base}/notifications/read-all`, {});
    }

    // ── Admin ───────────────────────────────────────────

    getDashboard(): Observable<DashboardStats> {
        return this.http.get<DashboardStats>(`${this.base}/admin/dashboard`);
    }

    getAdminUsers(role?: string): Observable<User[]> {
        let params = new HttpParams();
        if (role) params = params.set('role', role);
        return this.http.get<User[]>(`${this.base}/admin/users`, { params });
    }

    getAdminEvents(status?: string): Observable<BodaEvent[]> {
        let params = new HttpParams();
        if (status) params = params.set('status', status);
        return this.http.get<BodaEvent[]>(`${this.base}/admin/events`, { params });
    }

    getSalesReport(): Observable<any[]> {
        return this.http.get<any[]>(`${this.base}/admin/reports/sales`);
    }
}
