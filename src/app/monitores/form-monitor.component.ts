import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Deporte } from '../deportes/deporte';
import { DeporteService } from '../deportes/deporte.service';
import { Monitor } from './monitor';
import { MonitorService } from './monitor.service';

@Component({
  selector: 'app-form-monitor',
  templateUrl: './form-monitor.component.html',
  styleUrls: ['./form-monitor.component.css']
})
export class FormMonitorComponent implements OnInit {

  public monitor: Monitor = new Monitor();

  deportes: Deporte[];

  public titulo: string = 'Crear Monitor';

  public errores: string[];

  constructor(private monitorService: MonitorService,
    private deporteService: DeporteService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.cargarMonitor();
  }

  cargarMonitor(): void{
    this.activatedRoute.params.subscribe(params => {
      let id = params['id']
      if(id){
        this.monitorService.getMonitor(id).subscribe((monitor) => this.monitor = monitor);
      }
    });
    this.deporteService.getDeportes().subscribe(deportes => this.deportes = deportes);
  }

  create(): void{
    this.monitor.enabled = true;//ponemos el atributo enable
    //calculamos edad
    if(this.monitor.fechaNacimiento != null || this.monitor.fechaNacimiento != undefined){         
    this.monitor.edad = this.calcularEdad(this.monitor.fechaNacimiento);
    }
    
    console.log(this.monitor);//para ver la edad
    this.monitorService.create(this.monitor)
    .subscribe(monitor => {
      this.router.navigate(['/monitores'])
      Swal.fire('Nuevo Monitor', `El monitor ${monitor.nombrePersona} ha sido creado con éxito!`, 'success');
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

  update(): void{
    console.log(this.monitor);
    this.monitorService.update(this.monitor)
    .subscribe( json => {
      this.router.navigate(['/monitores']);
      Swal.fire('Monitor Actualizado', `${json.mensaje}: ${json.monitor.nombrePersona}`, 'success');
    },
    err =>{
      this.errores = err.error.errors as string[];
      console.error('Código del error desde el backend: ' + err.status);
      console.error(err.error.errors);
    }
    );
  }

  compararDeporte(o1: Deporte, o2: Deporte): boolean{
    if(o1 === undefined && o2 == undefined){
      return true;
    }
    return o1 === null || o2 === null || o1 === undefined || o2 === undefined? false: o1.id === o2.id;  
  }

}
