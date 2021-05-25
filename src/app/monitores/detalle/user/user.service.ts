import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  monitor_usuario: boolean = false;

  constructor() { }

  openMonitorUsuario(){
    this.monitor_usuario = true;
  }

  closeMonitorUsuario(){
    this.monitor_usuario = false;
  }
  
}
