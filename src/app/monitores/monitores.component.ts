import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { URL_BACKEND } from '../config/config';
import { AuthService } from '../usuarios/auth.service';
import { ModalMonitorService } from './detalle/modal-monitor.service';
import { Monitor } from './monitor';
import { MonitorService } from './monitor.service';

@Component({
  selector: 'app-monitores',
  templateUrl: './monitores.component.html',
  styleUrls: ['./monitores.component.css']
})
export class MonitoresComponent implements OnInit {

  urlBackend: string = URL_BACKEND;

  monitores: Monitor[];

  paginador: any; //se inyecta al componente paginador
  
  enlacePaginador: string = '/monitores/page'; //inyectado al componente paginador

  monitorSeleccionado: Monitor;

  constructor(private monitorService: MonitorService,
    private activatedRoute: ActivatedRoute,
    private modalMonitorService: ModalMonitorService,
    public authService: AuthService) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(
      params => {
          let page: number = +params.get('page');

          if(!page){//validamos que la pagina esté definida
            page = 0;
          }

          this.monitorService.getMonitores(page).pipe(        
            tap(response => {//tap no es necesario
            console.log('MonitorComponent: tap 3');
            (response.content as Monitor[]).forEach(monitor => {
            console.log(monitor.nombrePersona);
            });
        })
        ).subscribe(response => {
          this.monitores = response.content as Monitor[];
          this.paginador = response;
        });
        }
    );

    /**suscripcion al EventEmitter de la imagen */
    this.modalMonitorService.notificarUpload.subscribe( monitor =>{
      this.monitores = this.monitores.map(monitorOriginal => {
        if(monitor.id == monitorOriginal.id){
          monitorOriginal.foto = monitor.foto;
        }
        return monitorOriginal;
      });
    });
  }

  delete(monitor: Monitor): void{
    Swal.fire({
      title: 'Está seguro?',
      text: `¿Seguro que desea eliminar el monitor ${monitor.nombrePersona}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar!',
      cancelButtonText: 'No, cancelar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.monitorService.delete(monitor.id).subscribe(
          response => {
            //quitamos del listado deporrte el objeto que se eliminó
            this.monitores = this.monitores.filter(mon => mon != monitor)
            Swal.fire(
              'Monitor eliminado!',
              `Monitor ${monitor.nombrePersona} eliminado con éxito!`,
              'success'
            )
          }
        )
      }
    })
  }

  openModalMonitor(monitor: Monitor){
    this.monitorSeleccionado = monitor;
    this.modalMonitorService.openModalMonitor();
  }

}
