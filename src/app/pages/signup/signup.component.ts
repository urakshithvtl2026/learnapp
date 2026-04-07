import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../services/auth.service';

function passwordsMatch(group: AbstractControl): ValidationErrors | null {
  const pw  = group.get('password')?.value;
  const cpw = group.get('confirmPassword')?.value;
  return pw && cpw && pw !== cpw ? { passwordMismatch: true } : null;
}

@Component({
  selector: 'app-signup',
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
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  private fb   = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  form = this.fb.nonNullable.group(
    {
      username:        ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^\S+$/)]],
      password:        ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      acceptKey:       ['', Validators.required],
    },
    { validators: passwordsMatch }
  );

  loading      = false;
  error        = '';
  success      = false;
  hidePassword = true;
  hideConfirm  = true;

  get f() { return this.form.controls; }

  async onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error   = '';

    const { username, password, acceptKey } = this.form.getRawValue();
    const result = await this.auth.signup(username, password, acceptKey);

    this.loading = false;

    if (result.success) {
      this.success = true;
      setTimeout(() => this.router.navigate(['/login']), 2000);
    } else {
      this.error = result.error ?? 'Registration failed. Please try again.';
    }
  }
}
