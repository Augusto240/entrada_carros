import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Message } from 'primeng/api';

@Component({
  selector: 'app-passwordreset',
  templateUrl: './passwordreset.component.html',
  styleUrls: ['./passwordreset.component.css']
})
export class PasswordresetComponent {
  email: string ='';
  messages: Message[] = [];  // Inicializa como array vazio

  constructor(private http: HttpClient) { }

  onSubmit() {
    this.http.post(`${environment.apiUrl}/password-recovery/request`, { email: this.email }).subscribe(
      response => {
        this.messages = [{ severity: 'success', summary: 'Sucesso', detail: 'Instruções de recuperação de senha enviadas.' }];
      },
      error => {
        this.messages = [{ severity: 'error', summary: 'Erro', detail: 'Erro ao enviar as instruções. Tente novamente.' }];
      }
    );
  }
}
