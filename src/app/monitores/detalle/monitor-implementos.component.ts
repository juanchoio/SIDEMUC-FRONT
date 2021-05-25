import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';
import { Implemento } from 'src/app/implementos/implemento';
import { ImplementoService } from 'src/app/implementos/implemento.service';
import Swal from 'sweetalert2';
import { Monitor } from '../monitor';
import { MonitorService } from '../monitor.service';
import { MonitorImplementosService } from './monitor-implementos.service';

@Component({
  selector: 'monitor-implementos',
  templateUrl: './monitor-implementos.component.html',
  styleUrls: ['./monitor-implementos.component.css']
})
export class MonitorImplementosComponent implements OnInit {

  @Input() monitor: Monitor;

  autocompleteControl = new FormControl();

  implementosFiltrados: Observable<Implemento[]>;

  public errores: string[];

  constructor(public monitorImplementosService: MonitorImplementosService,
    public implementoService: ImplementoService,
    public monitorService: MonitorService) { }

  ngOnInit(): void {
    this.implementosFiltrados = this.autocompleteControl.valueChanges
    .pipe(
      map(value => typeof value === 'string'? value: value.nombreImplemento),
      flatMap(value => value ? this._filter(value): [])
    );
  }

  private _filter(value: string): Observable<Implemento[]>{
    const filterValue = value.toLowerCase();

    return this.implementoService.filtrarImplementos(filterValue);
  }

  showName(implemento?: Implemento): string | undefined{
    return implemento? implemento.nombreImplemento: undefined;
  }

  selectImplemento(event: MatAutocompleteSelectedEvent): void{
    let implemento = event.option.value as Implemento;
    console.log(implemento);

    if(!this.existImplemento(implemento.id)){
      this.monitor.implementos.push(implemento);

      this.autocompleteControl.setValue('');
      event.option.focus();
      event.option.deselect();
    } else{
      Swal.fire('Error al seleccionar implemento', `El implemento ${implemento.nombreImplemento} ya esta seleccionado para el monitor ${this.monitor.nombrePersona} ${this.monitor.apellidoPersona}!`, 'info');
    }
  }

  quitImplemento(id: number): void{
    this.monitor.implementos = this.monitor.implementos
    .filter((implemento: Implemento) => id !== implemento.id);
  }

  existImplemento(id: number): boolean{
    let existe = false;

    this.monitor.implementos.forEach((implemento: Implemento) => {
      if(id == implemento.id){
        existe = true;
      }
    });
    return existe;
  }

  asignarImplementosMonitor(): void{
    console.log(this.monitor);//para ver implemento    
    this.monitorService.update(this.monitor)
    .subscribe( json => {
      this.cerrarMonitorImplementos();
      Swal.fire('Implementos Actualizados', `${json.mensaje}`, 'success');
    },
    err =>{
      this.errores = err.error.errors as string[];
      console.error('Código del error desde el backend: ' + err.status);
      console.error(err.error.errors);
    }
    );
  }

  cerrarMonitorImplementos(){
    this.monitorImplementosService.closeMonitorImplementos();
  }

}
