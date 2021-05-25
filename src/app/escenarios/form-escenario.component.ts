import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Escenario } from './escenario';
import { EscenarioService } from './escenario.service';

@Component({
  selector: 'app-form-escenario',
  templateUrl: './form-escenario.component.html',
  styleUrls: ['./form-escenario.component.css']
})
export class FormEscenarioComponent implements OnInit {

  public escenario: Escenario = new Escenario();

  public titulo: string ='Crear Escenario';

  constructor(private escenarioService: EscenarioService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.cargarEscenario();
  }

  cargarEscenario(): void{
    this.activatedRoute.params.subscribe(params => {
      let id = params['id']
      if(id){
        this.escenarioService.getEscenario(id).subscribe((escenario) => this.escenario = escenario)
      }
    });    
  }

  create(): void{
    this.escenario.enabled = true;//ponemos el atributo enable
    this.escenarioService.create(this.escenario)
    .subscribe(escenario => {
      this.router.navigate(['/escenarios'])
      Swal.fire('Nuevo Escenario', `Escenario ${escenario.nombreEscenario} creado con éxito!`, 'success')
    });
  }

  update(): void{
    this.escenarioService.update(this.escenario)
    .subscribe( escenario => {
      this.router.navigate(['/escenarios'])
      Swal.fire('Escenario Actualizado', `Escenario ${escenario.nombreEscenario} actualizado con éxito!`, 'success')
    });
  }

}
