import { HttpEventType } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { URL_BACKEND } from 'src/app/config/config';
import { AuthService } from 'src/app/usuarios/auth.service';
import Swal from 'sweetalert2';
import { Deportista } from '../deportista';
import { DeportistaService } from '../deportista.service';
import { DeportistaCategoriaService } from './deportista-categoria.service';
import { DeportistaHabilidadesService } from './deportista-habilidades.service';
import { ModalService } from './modal.service';

@Component({
  selector: 'detalle-deportista',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {

  @Input() deportista: Deportista;

  deportistaSeleccionado2: Deportista;

  urlBackend: string = URL_BACKEND;

  titulo: string = 'Detalle del deportista';

  private fotoSeleccionada: File;
  public progreso: number = 0;
  

  constructor(private deportistaService: DeportistaService,
    public modalService: ModalService,
    public deportistaCategoriaService: DeportistaCategoriaService,
    public deportistaHabilidadesService: DeportistaHabilidadesService,
    public authService: AuthService) { }

  ngOnInit(): void {
    //LO ESTAMOS INYECTANDO
    // this.activatedRoute.paramMap.subscribe(params =>{
    //   let id: number = +params.get('id');
    //   if(id){
    //     this.deportistaService.getDeportista(id).subscribe(deportista => {
    //       this.deportista = deportista;
    //     });
    //   }
    // });
  }

  seleccionarFoto(event){
    this.fotoSeleccionada = event.target.files[0];
    this.progreso = 0;
    console.log(this.fotoSeleccionada);
    if(this.fotoSeleccionada.type.indexOf('image') < 0){
      Swal.fire('Error de carga:', 'El archivo seleccionado no es una imagen', 'error');
      this.fotoSeleccionada = null;
    }
  }

  subirFoto(){

    if(!this.fotoSeleccionada){
      Swal.fire('Error de carga:', 'Debe seleccionar una foto', 'error');
    }else{
      this.deportistaService.uploadPhoto(this.fotoSeleccionada, this.deportista.id)
      .subscribe(event => {
        //this.deportista = deportista;
        if(event.type === HttpEventType.UploadProgress){
          this.progreso = Math.round((event.loaded/event.total)*100);
        }else if(event.type === HttpEventType.Response){
          let response: any = event.body;
          this.deportista = response.deportista as Deportista;
          
          /**suscripcion al EventEmitter de la imagen */
          this.modalService.notificarUpload.emit(this.deportista);
          Swal.fire('La foto se ha subido completamente!', response.mensaje, 'success');
        }
      });
    }
    
  }

  closeModal(){
    this.modalService.closeModal();
    this.fotoSeleccionada = null;
    this.progreso = 0;
    this.deportistaCategoriaService.closeDeportistaCategoria();
    this.deportistaHabilidadesService.closeDeportistaHabilidades();
  }

  abrirDeportistaCategoria(deportista: Deportista){
    this.deportistaSeleccionado2 = deportista;
    this.deportistaCategoriaService.openDeportistaCategoria();
  }

  abrirDeportistaHabilidades(deportista: Deportista){
    this.deportistaSeleccionado2 = deportista;
    this.deportistaHabilidadesService.openDeportistaHabilidades();
  }

}
