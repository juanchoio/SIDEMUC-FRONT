import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FooterComponent } from './footer/footer.component';
import { InicioComponent } from './inicio/inicio.component';
import { DeportesComponent } from './deportes/deportes.component';
import { DeporteService } from './deportes/deporte.service';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormDeporteComponent } from './deportes/form-deporte.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CategoriasComponent } from './categorias/categorias.component';
import { FormCategoriaComponent } from './categorias/form-categoria.component';
import { CategoriaService } from './categorias/categoria.service';
import { HabilidadesComponent } from './habilidades/habilidades.component';
import { FormHabilidadComponent } from './habilidades/form-habilidad.component';
import { HabilidadService } from './habilidades/habilidad.service';
import { EscenariosComponent } from './escenarios/escenarios.component';
import { FormEscenarioComponent } from './escenarios/form-escenario.component';
import { EscenarioService } from './escenarios/escenario.service';
import { ImplementosComponent } from './implementos/implementos.component';
import { FormImplementoComponent } from './implementos/form-implemento.component';
import { ImplementoService } from './implementos/implemento.service';
import { DeportistasComponent } from './deportistas/deportistas.component';
import { FormDeportistaComponent } from './deportistas/form-deportista.component';
import localeES from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import { PaginadorComponent } from './paginador/paginador.component';
import { DetalleComponent } from './deportistas/detalle/detalle.component';
import { LoginComponent } from './usuarios/login.component';
import { DeportistaCategoriaComponent } from './deportistas/detalle/deportista-categoria.component';
import { DeportistaHabilidadesComponent } from './deportistas/detalle/deportista-habilidades.component';

//IMPORTS DEL AUTOCOMPLETE
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MonitoresComponent } from './monitores/monitores.component';
import { FormMonitorComponent } from './monitores/form-monitor.component';
import { DeportistaService } from './deportistas/deportista.service';
import { ModalService } from './deportistas/detalle/modal.service';
import { MonitorService } from './monitores/monitor.service';
import { DetalleMonitorComponent } from './monitores/detalle/detalle-monitor.component';
import { MonitorEscenarioComponent } from './monitores/detalle/monitor-escenario.component';
import { ModalMonitorService } from './monitores/detalle/modal-monitor.service';
import { MonitorEscenarioService } from './monitores/detalle/monitor-escenario.service';
import { MonitorImplementosComponent } from './monitores/detalle/monitor-implementos.component';
import { MonitorImplementosService } from './monitores/detalle/monitor-implementos.service';
import { DeportistaCategoriaService } from './deportistas/detalle/deportista-categoria.service';
import { DeportistaHabilidadesService } from './deportistas/detalle/deportista-habilidades.service';
import { UserComponent } from './monitores/detalle/user/user.component';
import { UserService } from './monitores/detalle/user/user.service';
import { UsuarioService } from './monitores/detalle/user/usuario.service';
import { AuthService } from './usuarios/auth.service';


registerLocaleData(localeES, 'es');

const routes: Routes = [
  {path: '', redirectTo: '/inicio', pathMatch: 'full'},
  {path: 'inicio', component: InicioComponent},
  {path: 'deportes', component: DeportesComponent},
  {path: 'deportes/form', component: FormDeporteComponent},
  {path: 'deportes/form/:id', component: FormDeporteComponent},
  {path: 'categorias', component: CategoriasComponent},
  {path: 'categorias/form', component: FormCategoriaComponent},
  {path: 'categorias/form/:id', component: FormCategoriaComponent},
  {path: 'habilidades', component: HabilidadesComponent},
  {path: 'habilidades/form', component: FormHabilidadComponent},
  {path: 'habilidades/form/:id', component: FormHabilidadComponent},
  {path: 'escenarios', component: EscenariosComponent},
  {path: 'escenarios/form', component: FormEscenarioComponent},
  {path: 'escenarios/form/:id', component: FormEscenarioComponent},
  {path: 'implementos', component: ImplementosComponent},
  {path: 'implementos/form', component: FormImplementoComponent},
  {path: 'implementos/form/:id', component: FormImplementoComponent},
  {path: 'deportistas', component: DeportistasComponent},
  {path: 'deportistas/page/:page', component: DeportistasComponent},
  {path: 'deportistas/form', component: FormDeportistaComponent},
  {path: 'deportistas/form/:id', component: FormDeportistaComponent},
  {path: 'login', component: LoginComponent},
  {path: 'monitores', component: MonitoresComponent},
  {path: 'monitores/page/:page', component: MonitoresComponent},
  {path: 'monitores/form', component: FormMonitorComponent},
  {path: 'monitores/form/:id', component: FormMonitorComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    InicioComponent,
    DeportesComponent,
    FormDeporteComponent,
    CategoriasComponent,
    FormCategoriaComponent,
    HabilidadesComponent,
    FormHabilidadComponent,
    EscenariosComponent,
    FormEscenarioComponent,
    ImplementosComponent,
    FormImplementoComponent,
    DeportistasComponent,
    FormDeportistaComponent,
    PaginadorComponent,
    DetalleComponent,
    LoginComponent,
    DeportistaCategoriaComponent,
    DeportistaHabilidadesComponent,
    MonitoresComponent,
    FormMonitorComponent,
    DetalleMonitorComponent,
    MonitorEscenarioComponent,
    MonitorImplementosComponent,
    UserComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    DeporteService, 
    CategoriaService, 
    HabilidadService,
    EscenarioService,
    ImplementoService,
    DeportistaService,
    DeportistaCategoriaService,
    DeportistaHabilidadesService,
    ModalService,
    MonitorService,
    ModalMonitorService,
    MonitorEscenarioService,
    MonitorImplementosService,
    UserService,
    UsuarioService,
    AuthService,
    {provide: LOCALE_ID, useValue: 'es'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
