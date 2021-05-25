import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { AuthService } from '../usuarios/auth.service';
import { Implemento } from './implemento';
import { ImplementoService } from './implemento.service';

@Component({
  selector: 'app-implementos',
  templateUrl: './implementos.component.html',
  styleUrls: ['./implementos.component.css']
})
export class ImplementosComponent implements OnInit {

  implementos: Implemento[];

  constructor(private implementoService: ImplementoService,
    public authService: AuthService) { }

  ngOnInit(): void {
    this.implementoService.getImplementos().subscribe(
      implementos => this.implementos = implementos
    );
  }

  delete(implemento: Implemento): void{
    Swal.fire({
      title: 'Está seguro?',
      text: `¿Seguro que desea eliminar el Implemento ${implemento.nombreImplemento}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar!',
      cancelButtonText: 'No, cancelar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.implementoService.delete(implemento.id).subscribe(
          response => {
            //quitamos del listado deporrte el objeto que se eliminó
            this.implementos = this.implementos.filter(impl => impl != implemento)
            Swal.fire(
              'Implemento eliminado!',
              `Implemento ${implemento.nombreImplemento} eliminado con éxito!`,
              'success'
            )
          }
        )
      }
    })
  }

}
