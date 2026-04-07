import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService, UserInfo } from '../../services/auth.service';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatTooltipModule,
  ],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss',
})
export class UserManagementComponent implements OnInit {
  displayedColumns = ['index', 'username', 'role', 'status', 'actions'];
  users: UserInfo[] = [];
  currentUsername: string | null;

  constructor(private auth: AuthService, private snack: MatSnackBar) {
    this.currentUsername = this.auth.getUsername();
  }

  async ngOnInit(): Promise<void> {
    this.users = await this.auth.getAllUsers();
  }

  canToggle(user: UserInfo): boolean {
    return user.role !== 'admin' && user.username !== this.currentUsername;
  }

  async toggleActive(user: UserInfo): Promise<void> {
    const newState = !user.isActive;
    await this.auth.setUserActive(user.username, newState);
    user.isActive = newState;
    // Trigger table re-render
    this.users = [...this.users];
    const msg = newState
      ? `${user.username} has been activated.`
      : `${user.username} has been deactivated.`;
    this.snack.open(msg, 'OK', { duration: 3000 });
  }
}
