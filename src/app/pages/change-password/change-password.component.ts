import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss',
})
export class ChangePasswordComponent {
  currentPw = '';
  newPw = '';
  confirmPw = '';
  error = '';
  saving = false;
  showCurrent = false;
  showNew = false;
  showConfirm = false;

  constructor(
    private auth: AuthService,
    private snack: MatSnackBar,
    private router: Router,
  ) {}

  get mismatch(): boolean {
    return this.confirmPw.length > 0 && this.newPw !== this.confirmPw;
  }

  async save(): Promise<void> {
    this.error = '';
    if (!this.currentPw) { this.error = 'Please enter your current password.'; return; }
    if (this.newPw.length < 4) { this.error = 'New password must be at least 4 characters.'; return; }
    if (this.newPw !== this.confirmPw) { this.error = 'Passwords do not match.'; return; }

    this.saving = true;
    try {
      const valid = await this.auth.verifyPassword(this.currentPw);
      if (!valid) { this.error = 'Current password is incorrect.'; return; }

      const username = this.auth.getUsername()!;
      await this.auth.changePassword(username, this.newPw);

      this.snack.open('Password updated successfully.', 'OK', { duration: 3000 });
      this.router.navigate(['/']);
    } catch {
      this.error = 'Failed to update password. Please try again.';
    } finally {
      this.saving = false;
    }
  }
}
