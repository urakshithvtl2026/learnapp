import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  form = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  loading = false;
  error = '';
  hidePassword = true;

  async onSubmit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';

    const { username, password } = this.form.getRawValue();
    const result = await this.auth.login(username, password);

    this.loading = false;
    if (result === 'ok') {
      this.router.navigate(['/dashboard']);
    } else if (result === 'inactive') {
      this.error = 'Your account has been deactivated. Please contact an administrator.';
    } else {
      this.error = 'Invalid username or password.';
    }
  }
}
