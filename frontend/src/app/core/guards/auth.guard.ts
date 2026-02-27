import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (auth.isLoggedIn()) {
        return true;
    }
    return router.createUrlTree(['/login']);
};

export const adminGuard: CanActivateFn = () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (auth.isLoggedIn() && auth.currentUser()?.role === 'Admin') {
        return true;
    }
    return router.createUrlTree(['/feed']);
};

export const organizerGuard: CanActivateFn = () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (auth.isLoggedIn() && (auth.currentUser()?.role === 'Organizer' || auth.currentUser()?.role === 'Admin')) {
        return true;
    }
    return router.createUrlTree(['/feed']);
};
