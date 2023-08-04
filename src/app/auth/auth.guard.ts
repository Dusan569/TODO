import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { AuthService } from "./auth.service";
import { Observable, map, take, tap } from "rxjs";

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate{

    constructor(private authService: AuthService, private router: Router){}

    canActivate(route: ActivatedRouteSnapshot, router: RouterStateSnapshot): boolean | UrlTree | Promise<boolean | UrlTree>  | Observable<boolean | UrlTree> {
        return this.authService.user.pipe(map(user => {
            return !!user;
        }), tap(isTrue => {
            if (!isTrue){
                this.router.navigate(['/auth']);
            }
        }))
    }
}