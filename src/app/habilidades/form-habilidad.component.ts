import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Habilidad } from './habilidad';
import { HabilidadService } from './habilidad.service';

@Component({
  selector: 'app-form-habilidad',
  templateUrl: './form-habilidad.component.html',
  styleUrls: ['./form-habilidad.component.css']
})
export class FormHabilidadComponent implements OnInit {

  public habilidad: Habilidad = new Habilidad();

  public titulo: string = 'Crear Habilidad';

  constructor(private habilidadService: HabilidadService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.cargarHabilidad();
  }

  cargarHabilidad(): void{
    this.activatedRoute.params.subscribe(params => {
      let id = params['id']
      if(id){
        this.habilidadService.getHabilidad(id).subscribe((habilidad) => this.habilidad = habilidad)
      }
    });
  }

  create(): void{
    this.habilidad.enabled = true; //ponemos activo antes de guardar en la BD
    this.habilidadService.create(this.habilidad)
    .subscribe(habilidad => {
      this.router.navigate(['/habilidades'])
      Swal.fire('Nueva Habilidad', `Habilidad ${habilidad.nombreHabilidad} creada con éxito!`, 'success')
    });
  }

  update(): void{
    this.habilidadService.update(this.habilidad)
    .subscribe(habilidad => {
      this.router.navigate(['/habilidades'])
      Swal.fire('Habilidad Actualizada', `Habilidad ${habilidad.nombreHabilidad} actualizada con éxito!`, 'success')
    });
  }

}
