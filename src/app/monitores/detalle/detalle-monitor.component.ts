import { HttpEventType } from '@angular/common/http';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AuthService } from 'src/app/usuarios/auth.service';
import Swal from 'sweetalert2';
import { Monitor } from '../monitor';
import { MonitorService } from '../monitor.service';
import { ModalMonitorService } from './modal-monitor.service';
import { MonitorEscenarioService } from './monitor-escenario.service';
import { MonitorImplementosService } from './monitor-implementos.service';
import { UserService } from './user/user.service';
import { Usuario } from './user/usuario';
import { UsuarioService } from './user/usuario.service';

@Component({
  selector: 'detalle-monitor',
  templateUrl: './detalle-monitor.component.html',
  styleUrls: ['./detalle-monitor.component.css']
})
export class DetalleMonitorComponent implements OnInit, OnChanges {

  /**inyectar el componente en el monitor */
  @Input() monitor: Monitor;

  monitorSeleccionado2: Monitor;

  usuario: Usuario;

  usuarioPasado: Usuario;

  titulo: string = 'Detalle del Monitor';

  private fotoSeleccionada: File;
  public progreso: number = 0;

  constructor(private monitorService: MonitorService,
    public modalMonitorService: ModalMonitorService,
    public monitorEscenarioService: MonitorEscenarioService,
    public monitorImplementosService: MonitorImplementosService,
    public userService: UserService,
    public usuarioService: UsuarioService,
    public authService: AuthService) { }

  ngOnInit(): void {  
    //this.cargarUsuarioPorMonitor();
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    console.log(changes);
    this.cargarUsuarioPorMonitor();
    console.log(this.usuario);
    
  }

  // estadoUsuario(): boolean{
  //   let estado = false;
  //   if(!this.usuario || this.usuario == undefined || this.usuario == null){
  //     estado = true;
  //   }
  //   return estado;
  // }

  cargarUsuarioPorMonitor(): void{
    this.usuarioService.getUsuarioPorIdMonitor(this.monitor.id)
    .subscribe(usuario => {
      if(usuario){
        this.usuario = usuario;
      } else{
        this.usuario = new Usuario();
      }
    });
  }

  seleccionarFoto(event){
    this.fotoSeleccionada = event.target.files[0];
    this.progreso = 0;
    console.log(this.fotoSeleccionada);
    if(this.fotoSeleccionada.type.indexOf('image') <0){
      Swal.fire('Error de carga:', 'El archivo seleccionado no es una imagen', 'error');
      this.fotoSeleccionada = null;
    }
  }

  subirFoto(){
    if(!this.fotoSeleccionada){
      Swal.fire('Error de carga:', 'Debe seleccionar una foto', 'error');
    } else{
      this.monitorService.uploadPhoto(this.fotoSeleccionada, this.monitor.id)
      .subscribe(event => {
        //this.deportista = deportista;
        if(event.type === HttpEventType.UploadProgress){
          this.progreso = Math.round((event.loaded/event.total)*100);
        }else if(event.type === HttpEventType.Response){
          let response: any = event.body;
          this.monitor = response.monitor as Monitor;
          
          /**suscripcion al EventEmitter de la imagen */
          this.modalMonitorService.notificarUpload.emit(this.monitor);
          Swal.fire('La foto se ha subido completamente!', response.mensaje, 'success');
        }
      });
    }
  }

  closeModalMonitor(){
    this.modalMonitorService.closeModalMonitor();
    this.fotoSeleccionada = null;
    this.progreso = 0;
    this.monitorEscenarioService.closeMonitorEscenario();
    this.monitorImplementosService.closeMonitorImplementos();
    this.userService.closeMonitorUsuario();
    
  }

  abrirMonitorEscenario(monitor: Monitor){
    this.monitorSeleccionado2 = monitor;
    this.monitorEscenarioService.openMonitorEscenario();
  }

  abrirMonitorImplementos(monitor: Monitor){
    this.monitorSeleccionado2 = monitor;
    this.monitorImplementosService.openMonitorImplementos();
  }

  abrirMonitorUsuario(monitor: Monitor){
    this.monitorSeleccionado2 = monitor;
    this.usuarioPasado = this.usuario;
    this.userService.openMonitorUsuario();    
  }

}
