import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(private router: Router) {}
  
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const currentUser = localStorage.getItem('currentUser');
    
    if (currentUser) {
      console.log('AuthGuard: User is authenticated, allowing access to:', state.url);
      return true;
    }
    
    console.log('AuthGuard: User not authenticated, redirecting to login');
    this.router.navigate(['/login']);
    return false;
  }
}
