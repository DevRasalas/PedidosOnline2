// auth.guard.ts

import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const userRole = this.authService.getUserRole();

    // Check if the user is authenticated based on your application's logic
    // You can adjust this logic based on your requirements
    const isAuthenticated = !!userRole;

    if (isAuthenticated) {
      // Check if the user has the required role to access the route
      // You can adjust this logic based on your roles and permissions
      const requiredRoles = (next.data as { roles: string[] }).roles || [];

      if (requiredRoles && requiredRoles.length > 0 && !requiredRoles.includes(userRole)) {
        // User doesn't have the required role
        this.router.navigate(['/unauthorized']); // Navigate to an unauthorized page or another suitable page
        return false;
      }

      return true;
    } else {
      // User is not authenticated, redirect to login
      this.router.navigate(['/login']);
      return false;
    }
  }
}
