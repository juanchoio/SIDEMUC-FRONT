import { Component, Input, OnInit } from '@angular/core';
import { Deportista } from '../deportista';
import { DeportistaHabilidadesService } from './deportista-habilidades.service';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {flatMap, map, startWith} from 'rxjs/operators';
import { HabilidadService } from 'src/app/habilidades/habilidad.service';
import { Habilidad } from 'src/app/habilidades/habilidad';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ExpressionStatement } from '@angular/compiler';
import Swal from 'sweetalert2';
import { DeportistaService } from '../deportista.service';

@Component({
  selector: 'deportista-habilidades',
  templateUrl: './deportista-habilidades.component.html',
  styleUrls: ['./deportista-habilidades.component.css']
})
export class DeportistaHabilidadesComponent implements OnInit {

  @Input() deportista: Deportista;

  autocompleteControl = new FormControl();
  // habilidades: string[] = ['Fuerza', 'Salto', 'Velocidad'];
  habilidadesFiltradas: Observable<Habilidad[]>;

  public errores: string[];

  constructor(public deportistaHabilidadesService: DeportistaHabilidadesService,
    public habilidadService: HabilidadService,
    public deportistaService: DeportistaService) { }

  ngOnInit(): void {
    this.habilidadesFiltradas = this.autocompleteControl.valueChanges
    .pipe(
      map(value => typeof value === 'string'? value: value.nombreHabilidad),
      flatMap(value => value ? this._filter(value): [])
    );
  }

  private _filter(value: string): Observable<Habilidad[]>{
    const filterValue = value.toLowerCase();

    return this.habilidadService.filtrarHabilidades(filterValue);
  }

  showName(habilidad?: Habilidad): string | undefined{
    return habilidad? habilidad.nombreHabilidad: undefined;
  }

  selectHabilidad(event: MatAutocompleteSelectedEvent): void{
    let habilidad = event.option.value as Habilidad;
    console.log(habilidad);

    if(!this.existHabilidad(habilidad.id)){
      this.deportista.habilidades.push(habilidad);

      this.autocompleteControl.setValue('');
      event.option.focus();
      event.option.deselect();
    } else{
      Swal.fire('Error al seleccionar habilidad', `La habilidad ${habilidad.nombreHabilidad} ya esta seleccionada para el deportista ${this.deportista.nombrePersona} ${this.deportista.apellidoPersona}!`, 'info');
    }
    // let deportistaHabilidades = new Habilidad();
    // deportistaHabilidades.
  }

  quitHabilidad(id: number): void{
    this.deportista.habilidades = this.deportista.habilidades
    .filter((habilidad: Habilidad) => id !== habilidad.id);
  }

  existHabilidad(id: number): boolean{
    let existe = false;

    this.deportista.habilidades.forEach((habilidad: Habilidad) => {
      if(id == habilidad.id){
        existe = true;
      }
    });
    return existe;
  }

  asignarHabilidadesDeportista(): void{
    console.log(this.deportista);//para ver categoria    
    this.deportistaService.update(this.deportista)
    .subscribe( json => {
      this.cerrarDeportistaHabilidades();
      Swal.fire('Habilidades Actualizadas', `${json.mensaje}`, 'success');
    },
    err =>{
      this.errores = err.error.errors as string[];
      console.error('Código del error desde el backend: ' + err.status);
      console.error(err.error.errors);
    }
    );
  }

  cerrarDeportistaHabilidades(){
    this.deportistaHabilidadesService.closeDeportistaHabilidades();
  }

}
