import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { AuthService } from '../usuarios/auth.service';
import { Habilidad } from './habilidad';
import { HabilidadService } from './habilidad.service';

@Component({
  selector: 'app-habilidades',
  templateUrl: './habilidades.component.html',
  styleUrls: ['./habilidades.component.css']
})
export class HabilidadesComponent implements OnInit {

  habilidades: Habilidad[];

  constructor(private habilidadService: HabilidadService,
    public authService: AuthService) { }

  ngOnInit(): void {
    this.habilidadService.getHabilidades().subscribe(
      habilidades => this.habilidades = habilidades
    );
  }

  delete(habilidad: Habilidad): void{
    Swal.fire({
      title: 'Está seguro?',
      text: `¿Seguro que desea eliminar la habilidad ${habilidad.nombreHabilidad}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar!',
      cancelButtonText: 'No, cancelar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.habilidadService.delete(habilidad.id).subscribe(
          response => {
            //quitamos del listado deporrte el objeto que se eliminó
            this.habilidades = this.habilidades.filter(hab => hab != habilidad)
            Swal.fire(
              'Habilidad eliminada!',
              `Habilidad ${habilidad.nombreHabilidad} eliminada con éxito`,
              'success'
            )
          }
        )
      }
    })
  }

}
