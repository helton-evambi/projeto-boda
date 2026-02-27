import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { User, AuthResponse } from '../models/models';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private apiUrl = 'http://localhost:5214/api/auth';

    currentUser = signal<User | null>(this.loadUser());
    isLoggedIn = computed(() => !!this.currentUser());
    token = signal<string | null>(localStorage.getItem('boda-token'));

    constructor(private http: HttpClient, private router: Router) { }

    login(email: string, password: string): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
            tap(res => {
                this.token.set(res.token);
                this.currentUser.set(res.user);
                localStorage.setItem('boda-token', res.token);
                localStorage.setItem('boda-user', JSON.stringify(res.user));
            })
        );
    }

    register(name: string, email: string, password: string, phone: string, role: string): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/register`, { name, email, password, phone, role }).pipe(
            tap(res => {
                this.token.set(res.token);
                this.currentUser.set(res.user);
                localStorage.setItem('boda-token', res.token);
                localStorage.setItem('boda-user', JSON.stringify(res.user));
            })
        );
    }

    logout(): void {
        this.token.set(null);
        this.currentUser.set(null);
        localStorage.removeItem('boda-token');
        localStorage.removeItem('boda-user');
        this.router.navigate(['/login']);
    }

    getMe(): Observable<User> {
        return this.http.get<User>(`${this.apiUrl}/me`).pipe(
            tap(user => {
                this.currentUser.set(user);
                localStorage.setItem('boda-user', JSON.stringify(user));
            })
        );
    }

    private loadUser(): User | null {
        const data = localStorage.getItem('boda-user');
        return data ? JSON.parse(data) : null;
    }
}
