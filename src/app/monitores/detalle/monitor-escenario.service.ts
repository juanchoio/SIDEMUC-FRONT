import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MonitorEscenarioService {

  monitor_escenario: boolean = false;

  constructor() { }

  openMonitorEscenario(){
    this.monitor_escenario = true;
  }

  closeMonitorEscenario(){
    this.monitor_escenario = false;
  }

}
