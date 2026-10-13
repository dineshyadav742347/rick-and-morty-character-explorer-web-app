import { Injectable, signal } from '@angular/core';
import { UserRole } from '../models/character.model';
import { APP_CONSTANTS } from '../constants/app.constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Read saved role from storage or default to Admin
  private getSavedRole(): UserRole {
    const saved = localStorage.getItem(APP_CONSTANTS.STORAGE_KEYS.USER_ROLE);
    return (saved === APP_CONSTANTS.ROLES.VIEWER || saved === APP_CONSTANTS.ROLES.ADMIN) ? saved : APP_CONSTANTS.ROLES.ADMIN;
  }

  readonly currentRole = signal<UserRole>(this.getSavedRole());

  // Switch active user role and persist in localStorage
  switchRole(role: UserRole) {
    this.currentRole.set(role);
    localStorage.setItem(APP_CONSTANTS.STORAGE_KEYS.USER_ROLE, role);
  }

  // Check if current user is admin
  isAdmin(): boolean {
    return this.currentRole() === APP_CONSTANTS.ROLES.ADMIN;
  }
}