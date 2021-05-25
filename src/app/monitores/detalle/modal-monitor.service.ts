import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalMonitorService {

  modalMonitor:boolean = false;

  private _notificarUpload = new EventEmitter<any>();

  constructor() { }

  get notificarUpload(): EventEmitter<any>{
    return this._notificarUpload;
  }

  openModalMonitor(){
    this.modalMonitor = true;
  }

  closeModalMonitor(){
    this.modalMonitor = false;
  }

}
