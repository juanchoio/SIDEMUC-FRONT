import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Deporte } from '../deportes/deporte';
import { DeporteService } from '../deportes/deporte.service';
import { Deportista } from './deportista';
import { DeportistaService } from './deportista.service';

@Component({
  selector: 'app-form-deportista',
  templateUrl: './form-deportista.component.html',
  styleUrls: ['./form-deportista.component.css']
})
export class FormDeportistaComponent implements OnInit {

  public deportista: Deportista = new Deportista();

  deportes: Deporte[];

  public titulo: string = 'Crear Deportista';

  public errores: string[];

  constructor(private deportistaService: DeportistaService,
    private deporteService: DeporteService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.cargarDeportista();
  }

  cargarDeportista(): void{
    this.activatedRoute.params.subscribe(params => {
      let id = params['id']
      if(id){
        this.deportistaService.getDeportista(id).subscribe((deportista) => this.deportista = deportista);
      }
    });
    this.deporteService.getDeportes().subscribe(deportes => this.deportes = deportes);
  }

  /**aca se maneja el retorno del deporotista con el operador map
   * en la clase service
   */
  create(): void{
    this.deportista.enabled = true;//ponemos el atributo enable
    //calculamos edad
    if(this.deportista.fechaNacimiento != null || this.deportista.fechaNacimiento != undefined){         
    this.deportista.edad = this.calcularEdad(this.deportista.fechaNacimiento);
    }
    
    console.log(this.deportista);//para ver la edad
    this.deportistaService.create(this.deportista)
    .subscribe(deportista => {
      this.router.navigate(['/deportistas']);
      Swal.fire('Nuevo Deportista', `El deportista ${deportista.nombrePersona} ha sido creado con éxito!`, 'success');
    },
    err =>{
      this.errores = err.error.errors as string[];
      console.error('Código del error desde el backend: ' + err.status);
      console.error(err.error.errors);
    }
    );
  }

  update(): void{
    console.log(this.deportista);
    this.deportistaService.update(this.deportista)
    .subscribe( json => {
      this.router.navigate(['/deportistas']);
      Swal.fire('Deportista Actualizado', `${json.mensaje}: ${json.deportista.nombrePersona}`, 'success');
    },
    err =>{
      this.errores = err.error.errors as string[];
      console.error('Código del error desde el backend: ' + err.status);
      console.error(err.error.errors);
    }
    );
  }

  
  calcularEdad(birthday): number { 

    birthday=new Date(birthday.split('/').reverse().join('-'));
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs); 
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  /**para establecer el deporte en el editar */
  compararDeporte(o1: Deporte, o2: Deporte): boolean{
    if(o1 === undefined && o2 == undefined){
      return true;
    }
    return o1 === null || o2 === null || o1 === undefined || o2 === undefined? false: o1.id === o2.id;  
  }  


}
