import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Implemento } from './implemento';
import { ImplementoService } from './implemento.service';

@Component({
  selector: 'app-form-implemento',
  templateUrl: './form-implemento.component.html',
  styleUrls: ['./form-implemento.component.css']
})
export class FormImplementoComponent implements OnInit {

  public implemento: Implemento = new Implemento();

  public titulo = 'Crear Implemento';

  constructor(private implementoService: ImplementoService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.cargarImplemento();
  }

  cargarImplemento(): void{
    this.activatedRoute.params.subscribe(params => {
      let id = params['id']
      if(id){
        this.implementoService.getImplemento(id).subscribe((implemento) => this.implemento = implemento)
      }
    });    
  }

  create(): void{
    this.implemento.enabled = true;//ponemos el atributo enable
    this.implementoService.create(this.implemento)
    .subscribe(implemento => {
      this.router.navigate(['/implementos'])
      Swal.fire('Nuevo Implemento', `Implemento ${implemento.nombreImplemento} creado con éxito!`, 'success')
    });
  }

  update(): void{
    this.implementoService.update(this.implemento)
    .subscribe(implemento => {
      this.router.navigate(['/implementos'])
      Swal.fire('Implemento Actualizado', `Implemento ${implemento.nombreImplemento} actualizado con éxito!`, 'success')
    });
  }

}
