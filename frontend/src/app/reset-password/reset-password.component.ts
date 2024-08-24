import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  resetForm: FormGroup;
  token: string | null;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {
    this.resetForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordsMatch });

    this.token = this.route.snapshot.queryParamMap.get('token');
  }

  passwordsMatch(group: FormGroup): { [key: string]: any } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { notMatching: true };
  }

  onSubmit() {
    if (this.resetForm.valid && this.token) {
      const { password } = this.resetForm.value;

      this.http.post('/api/reset-password', { token: this.token, password })
        .subscribe({
          next: (response: any) => {
            this.successMessage = 'Senha alterada com sucesso!';
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 3000);
          },
          error: (error) => {
            this.errorMessage = 'Erro ao alterar a senha. Tente novamente.';
          }
        });
    }
  }
}
