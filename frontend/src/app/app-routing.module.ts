import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListaComponent } from './lista/lista.component';
import { FormsComponent } from './forms/forms.component';
import { MqttComponent } from './mqtt/mqtt.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';
import { EditarComponent } from './editar/editar.component';
import { ScannerComponent } from './scanner/scanner.component';
import { AnaliseComponent } from './analise/analise.component';
import { NovousuarioComponent } from './novousuario/novousuario.component';
import { PasswordresetComponent } from './passwordreset/passwordreset.component'
const routes: Routes = [
    { path:'lista', component: ListaComponent, canActivate: [AuthGuard] },
    { path:'editar/:placa', component: EditarComponent, canActivate: [AuthGuard]},
    { path:'forms', component: FormsComponent, canActivate: [AuthGuard] },
    { path:'', component: ListaComponent, canActivate: [AuthGuard] },
    { path:'mqtt', component: MqttComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'scanner', component: ScannerComponent, canActivate: [AuthGuard] },
    { path: 'scanner/:placa', component: ScannerComponent, canActivate: [AuthGuard] },
    { path: 'analise', component: AnaliseComponent, canActivate: [AuthGuard] },
    { path: 'usuario/novo', component: NovousuarioComponent, canActivate: [AuthGuard] },
    { path: 'password-reset', component: PasswordresetComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }