import { Component, Input, OnInit } from '@angular/core';
import { Escenario } from 'src/app/escenarios/escenario';
import { EscenarioService } from 'src/app/escenarios/escenario.service';
import Swal from 'sweetalert2';
import { Monitor } from '../monitor';
import { MonitorService } from '../monitor.service';
import { MonitorEscenarioService } from './monitor-escenario.service';

@Component({
  selector: 'monitor-escenario',
  templateUrl: './monitor-escenario.component.html',
  styleUrls: ['./monitor-escenario.component.css']
})
export class MonitorEscenarioComponent implements OnInit {

  @Input() monitor: Monitor;

  titulo: string = 'Registro de escenario';

  escenarios: Escenario[];

  public errores: string[];

  constructor(public monitorEscenarioService: MonitorEscenarioService,
    private escenarioService: EscenarioService,
    private monitorService: MonitorService) { }

  ngOnInit(): void {
    this.cargarEscenarios();
  }

  cargarEscenarios(){
    this.escenarioService.getEscenarios().subscribe(escenarios => this.escenarios = escenarios);
  }

  asignarEscenarioMonitor(): void{
    console.log(this.monitor);//para ver categoria    
    this.monitorService.update(this.monitor)
    .subscribe( json => {
      this.cerrarMonitorEscenario();
      Swal.fire('Escenario Actualizado', `${json.mensaje}: Escenario ${json.monitor.escenario.nombreEscenario}`, 'success');
    },
    err =>{
      this.errores = err.error.errors as string[];
      console.error('Código del error desde el backend: ' + err.status);
      console.error(err.error.errors);
    }
    );
  }

  cerrarMonitorEscenario(){
    this.monitorEscenarioService.closeMonitorEscenario();
  }

  compararEscenario(e1: Escenario, e2: Escenario): boolean{
    if(e1 === undefined && e2 === undefined){
      return true;
    }
    return e1 === null || e2 === null || e1 === undefined || e2 === undefined? false: e1.id === e2.id;
  }

}
