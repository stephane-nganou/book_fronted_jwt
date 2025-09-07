import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { TokenService } from "../token/token.service";


export const AuthGuard: CanActivateFn = () => {
    const router = inject(Router);
    const auth = inject(TokenService);
    
    if (auth.isAuthenticated())
        return true;

    router.navigate(['/login']);
    return false;
};