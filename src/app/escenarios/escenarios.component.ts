import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { AuthService } from '../usuarios/auth.service';
import { Escenario } from './escenario';
import { EscenarioService } from './escenario.service';

@Component({
  selector: 'app-escenarios',
  templateUrl: './escenarios.component.html',
  styleUrls: ['./escenarios.component.css']
})
export class EscenariosComponent implements OnInit {

  escenarios: Escenario[];

  constructor(private escenarioService: EscenarioService,
    public authService: AuthService) { }

  ngOnInit(): void {
    this.escenarioService.getEscenarios().subscribe(
      escenarios => this.escenarios = escenarios
    );
  }

  delete(escenario: Escenario): void{
    Swal.fire({
      title: 'Está seguro?',
      text: `¿Seguro que desea eliminar el escenario ${escenario.nombreEscenario}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar!',
      cancelButtonText: 'No, cancelar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.escenarioService.delete(escenario.id).subscribe(
          response => {
            //quitamos del listado deporrte el objeto que se eliminó
            this.escenarios = this.escenarios.filter(esc => esc != escenario)
            Swal.fire(
              'Escenario eliminado!',
              `Escenario ${escenario.nombreEscenario} eliminado con éxito!`,
              'success'
            )
          }
        )
      }
    })
  }

}
