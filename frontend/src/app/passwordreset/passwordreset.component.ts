import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-passwordreset',
  templateUrl: './passwordreset.component.html',
  styleUrls: ['./passwordreset.component.css'],
  providers:[MessageService]
})
export class PasswordresetComponent {
  email: string = ''

  constructor(private http: HttpClient, private messageService: MessageService) {}

  onSubmit(){
    this.http.post(`${environment.apiUrl}/password-recovery/request`, {email: this.email}).subscribe(
      response => {
        this.messageService.add({severity:'success', summary: 'Sucesso', detail: 'Instruções de recuperação de senha enviadas.'})        
      },
      error => {
        this.messageService.add({severity:'error', summary: 'Erro', detail: 'Erro ao enviar as instruções. Tente novamente'})
      }
    )
  }
}

