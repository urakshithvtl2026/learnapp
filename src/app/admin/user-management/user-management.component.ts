import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AuthService, UserInfo } from '../../services/auth.service';
import { ChangePasswordDialogComponent } from '../change-password-dialog/change-password-dialog.component';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
  ],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss',
})
export class UserManagementComponent implements OnInit {
  displayedColumns = ['index', 'username', 'role', 'status', 'actions'];
  users: UserInfo[] = [];
  currentUsername: string | null;

  // Change My Password form
  currentPw = '';
  newPw = '';
  confirmPw = '';
  pwError = '';
  pwSaving = false;
  showCurrent = false;
  showNew = false;
  showConfirm = false;

  constructor(
    private auth: AuthService,
    private snack: MatSnackBar,
    private dialog: MatDialog,
  ) {
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
    this.users = [...this.users];
    const msg = newState
      ? `${user.username} has been activated.`
      : `${user.username} has been deactivated.`;
    this.snack.open(msg, 'OK', { duration: 3000 });
  }

  openChangePassword(user: UserInfo): void {
    const ref = this.dialog.open(ChangePasswordDialogComponent, {
      width: '400px',
      data: { username: user.username },
    });
    ref.afterClosed().subscribe((changed: boolean) => {
      if (changed) {
        this.snack.open(`Password for ${user.username} has been reset.`, 'OK', { duration: 3000 });
      }
    });
  }

  async changeMyPassword(): Promise<void> {
    this.pwError = '';
    if (this.newPw.length < 4) { this.pwError = 'New password must be at least 4 characters.'; return; }
    if (this.newPw !== this.confirmPw) { this.pwError = 'Passwords do not match.'; return; }

    this.pwSaving = true;
    try {
      const valid = await this.auth.verifyPassword(this.currentPw);
      if (!valid) { this.pwError = 'Current password is incorrect.'; return; }

      await this.auth.changePassword(this.currentUsername!, this.newPw);
      this.currentPw = '';
      this.newPw = '';
      this.confirmPw = '';
      this.snack.open('Your password has been updated.', 'OK', { duration: 3000 });
    } catch {
      this.pwError = 'Failed to update password. Please try again.';
    } finally {
      this.pwSaving = false;
    }
  }
}
