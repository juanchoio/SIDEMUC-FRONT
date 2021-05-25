import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MonitorImplementosService {

  monitor_implementos: boolean = false;

  constructor() { }

  openMonitorImplementos(){
    this.monitor_implementos = true;
  }

  closeMonitorImplementos(){
    this.monitor_implementos = false;
  }

}
