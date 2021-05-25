import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { AuthService } from '../usuarios/auth.service';
import { Deporte } from './deporte';
import { DeporteService } from './deporte.service';

@Component({
  selector: 'app-deportes',
  templateUrl: './deportes.component.html',
  styleUrls: ['./deportes.component.css']
})
export class DeportesComponent implements OnInit {


  deportes: Deporte[];

  constructor(private deporteService: DeporteService,
    public authService: AuthService) { }

  ngOnInit(): void {
    // el valor del atributo = al valor de la constante
    this.deporteService.getDeportes().subscribe(
      deportes => this.deportes = deportes
    );
  }

  delete(deporte: Deporte): void{
    Swal.fire({
      title: 'Está seguro?',
      text: `¿Seguro que desea eliminar el deporte ${deporte.nombreDeporte} de la modalidad ${deporte.modalidadDeporte}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar!',
      cancelButtonText: 'No, cancelar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.deporteService.delete(deporte.id).subscribe(
          response => {
            //quitamos del listado deporrte el objeto que se eliminó
            this.deportes = this.deportes.filter(dep => dep != deporte)
            Swal.fire(
              'Deporte eliminado!',
              `Deporte ${deporte.nombreDeporte} eliminado con éxito`,
              'success'
            )
          }
        )
      }
    })
  }

}
