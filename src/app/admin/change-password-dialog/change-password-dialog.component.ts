import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';

export interface ChangePasswordDialogData {
  username: string;
}

@Component({
  selector: 'app-change-password-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './change-password-dialog.component.html',
})
export class ChangePasswordDialogComponent {
  newPassword = '';
  confirmPassword = '';
  error = '';
  saving = false;
  showNew = false;
  showConfirm = false;

  constructor(
    public dialogRef: MatDialogRef<ChangePasswordDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ChangePasswordDialogData,
    private auth: AuthService,
  ) {}

  get passwordMismatch(): boolean {
    return this.confirmPassword.length > 0 && this.newPassword !== this.confirmPassword;
  }

  async save(): Promise<void> {
    this.error = '';
    if (!this.newPassword) { this.error = 'Please enter a new password.'; return; }
    if (this.newPassword.length < 4) { this.error = 'Password must be at least 4 characters.'; return; }
    if (this.newPassword !== this.confirmPassword) { this.error = 'Passwords do not match.'; return; }

    this.saving = true;
    try {
      await this.auth.changePassword(this.data.username, this.newPassword);
      this.dialogRef.close(true);
    } catch {
      this.error = 'Failed to change password. Please try again.';
    } finally {
      this.saving = false;
    }
  }
}
