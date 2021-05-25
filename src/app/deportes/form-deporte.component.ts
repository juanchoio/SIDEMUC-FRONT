import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Deporte } from './deporte';
import { DeporteService } from './deporte.service';

@Component({
  selector: 'app-form-deporte',
  templateUrl: './form-deporte.component.html',
  styleUrls: ['./form-deporte.component.css']
})
export class FormDeporteComponent implements OnInit {

  /*la directiva ngModel rellena los atributos de este objeto*/
  public deporte: Deporte = new Deporte();

  public titulo: string = 'Crear Deporte';

  constructor(private deporteService: DeporteService,
    private router: Router,
    private activadRoute: ActivatedRoute) { }

  ngOnInit(): void { 
    this.cargarDeporte();       
  }

  /**Cargar deporte -> asigna la respuesta al attributo Deporte*/
  cargarDeporte(): void{
    this.activadRoute.params.subscribe(params => {
      let id = params['id']
      if(id){
        this.deporteService.getDeporte(id).subscribe( (deporte) => this.deporte = deporte)
      }
    });
  }

  /**implementamos create inyectando la clase service */
  public create(): void{
    this.deporte.enabled = true; //verificar que esta linea si es correcta
    // console.log("Clicked!");
    // console.log(this.deporte);
    this.deporteService.create(this.deporte)
    .subscribe(deporte => {
      this.router.navigate(['/deportes'])
      Swal.fire('Nuevo Deporte', `Deporte ${deporte.nombreDeporte} en la modalidad 
        ${deporte.modalidadDeporte} creado con éxito!`, 'success')
    });
  }

  update(): void{
    this.deporteService.update(this.deporte)
    .subscribe( deporte => {
      this.router.navigate(['/deportes'])
      Swal.fire('Deporte Actualizado', `Deporte ${deporte.nombreDeporte} actualizado con éxito!`, 'success')
    });
  }

}