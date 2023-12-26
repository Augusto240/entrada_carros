import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MqttModule } from 'ngx-mqtt';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxScannerQrcodeModule, LOAD_WASM } from 'ngx-scanner-qrcode';
import { CookieService } from 'ngx-cookie-service';

import { AppComponent } from './app.component';
import { ListaComponent } from './lista/lista.component';
import { FormsComponent } from './forms/forms.component';
import { DadosService } from './dados.service';
import { MqttComponent } from './mqtt/mqtt.component';
import { LoginComponent } from './login/login.component';
import { EditarComponent } from './editar/editar.component';
import { SharedDataService } from './shared-data.service';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { HttpClientModule } from '@angular/common/http';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { PasswordModule } from 'primeng/password';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ScannerComponent } from './scanner/scanner.component';
import { AnaliseComponent } from './analise/analise.component';
import { ReqresmqttService } from './reqresmqtt.service';
import { MenuComponent } from './menu/menu.component';

LOAD_WASM().subscribe();

@NgModule({
  declarations: [
    AppComponent,
    ListaComponent,
    FormsComponent,
    MqttComponent,
    LoginComponent,
    EditarComponent,
    ScannerComponent,
    AnaliseComponent,
    MenuComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    InputTextModule,
    FormsModule,
    CheckboxModule,
    TableModule,
    ButtonModule,
    HttpClientModule,
    InputNumberModule,
    MqttModule.forRoot({
      hostname: 'test.mosquitto.org',
      port: 8081,
      protocol: 'wss'
    }),
    CalendarModule,
    BrowserAnimationsModule,
    PasswordModule,
    ProgressSpinnerModule,
    NgxScannerQrcodeModule
  ],
  providers: [DadosService, SharedDataService, CookieService, ReqresmqttService],
  bootstrap: [AppComponent]
})
export class AppModule { }
