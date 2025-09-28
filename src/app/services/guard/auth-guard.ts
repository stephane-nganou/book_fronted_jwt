import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { TokenService } from "../token/token.service";

/**
 * @fileoverview AuthGuard, purpose of insurring that on authenticated user access given routes
 * @author Stephane Nganou <stephane.nganou.w@snganou.de>
 * @version 1.0.0
 * @date 2025-09-07
 */
export const authGuard: CanActivateFn = () => {
    const router = inject(Router);
    const auth = inject(TokenService);
    
    if (auth.isAuthenticated())
        return true;

    router.navigate(['/login']);
    return false;
};