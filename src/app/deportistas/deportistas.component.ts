import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { URL_BACKEND } from '../config/config';
import { AuthService } from '../usuarios/auth.service';
import { Deportista } from './deportista';
import { DeportistaService } from './deportista.service';
import { ModalService } from './detalle/modal.service';

@Component({
  selector: 'app-deportistas',
  templateUrl: './deportistas.component.html',
  styleUrls: ['./deportistas.component.css']
})
export class DeportistasComponent implements OnInit {

  urlBackend: string = URL_BACKEND;

  deportistas: Deportista[];

  paginador: any; //se inyecta al componente paginador

  enlacePaginador: string = '/deportistas/page'; //inyectado al componente paginador

  deportistaSeleccionado: Deportista;

  constructor(private deportistaService: DeportistaService,
    private activatedRoute: ActivatedRoute,
    private modalService: ModalService,
    public authService: AuthService) { }

  ngOnInit(): void {    
    //este metodo se ejecuta una sola vez por lo tanto debemos
    //suscribirnos a los cambios en el numero de pagina
    this.activatedRoute.paramMap.subscribe(
      params => {
          let page: number = +params.get('page');

          if(!page){//validamos que la pagina esté definida
            page = 0;
          }

          this.deportistaService.getDeportistas(page).pipe(        
            tap(response => {//tap no es necesario
            console.log('DeportistaComponent: tap 3');
            (response.content as Deportista[]).forEach(deportista => {
            console.log(deportista.nombrePersona);
            });
        })
        ).subscribe(response => {
          this.deportistas = response.content as Deportista[];
          this.paginador = response;
        });
        }
    );

    /**suscripcion al EventEmitter de la imagen */
    this.modalService.notificarUpload.subscribe( deportista =>{
      this.deportistas = this.deportistas.map(deportistaOriginal => {
        if(deportista.id == deportistaOriginal.id){
          deportistaOriginal.foto = deportista.foto;
        }
        return deportistaOriginal;
      });
    });
  }

  delete(deportista: Deportista): void{
    Swal.fire({
      title: 'Está seguro?',
      text: `¿Seguro que desea eliminar el deportista ${deportista.nombrePersona}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar!',
      cancelButtonText: 'No, cancelar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.deportistaService.delete(deportista.id).subscribe(
          response => {
            //quitamos del listado deporrte el objeto que se eliminó
            this.deportistas = this.deportistas.filter(dep => dep != deportista)
            Swal.fire(
              'Deportista eliminado!',
              `Deportista ${deportista.nombrePersona} eliminado con éxito!`,
              'success'
            )
          }
        )
      }
    })
  }

  openModal(deportista: Deportista){
    this.deportistaSeleccionado = deportista;
    this.modalService.openModal();
  }

}
