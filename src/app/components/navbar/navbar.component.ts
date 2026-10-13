import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserRole } from '../../models/character.model';
import { APP_CONSTANTS } from '../../constants/app.constants';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent {
  protected readonly authService = inject(AuthService);
  protected readonly constants = APP_CONSTANTS;

  // Handle role selection change from simple dropdown
  onRoleChange(role: UserRole) {
    this.authService.switchRole(role);
  }
}