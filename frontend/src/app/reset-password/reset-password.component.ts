import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Message } from 'primeng/api';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  resetForm: FormGroup;
  messages: Message[] = [];
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.resetForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['']
    }, { validators: this.passwordsMatch });
  }

  passwordsMatch(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { notMatching: true };
  }

  onSubmit() {
    if (this.resetForm.valid) {
      const password = this.resetForm.get('password')?.value;
      this.http.post(`${environment.apiUrl}/password-recovery/reset`, { password }).subscribe(
        response => {
          this.successMessage = 'Senha redefinida com sucesso.';
          this.messages = [{ severity: 'success', summary: 'Sucesso', detail: this.successMessage }];
        },
        error => {
          this.errorMessage = 'Erro ao redefinir a senha. Tente novamente.';
          this.messages = [{ severity: 'error', summary: 'Erro', detail: this.errorMessage }];
        }
      );
    }
  }
}
