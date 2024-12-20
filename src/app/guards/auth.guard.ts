import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    console.log(this.router.url);

    if (this.authService.isLoggedIn() === true) {
      return true;
    } else {
      if (this.router.url == '/') {
        this.router.navigate(['home']);
        return true;
      } else {
        this.authService.clearSession();
        this.router.navigate(['login']);
        return false;
      }
    }
  }
}
