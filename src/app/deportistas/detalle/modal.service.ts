import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  modal: boolean = false;

  private _notificarUpload = new EventEmitter<any>();

  constructor() { }

  get notificarUpload(): EventEmitter<any>{
    return this._notificarUpload;
  }

  openModal(){
    this.modal = true;
  }

  closeModal(){
    this.modal = false;
  }

  /** vamos a inyectar esta clase en deportista.component.ts y detalle.component.ts
   * en deportista para abrir el modal y en detalle para cerrar el modal
   */

}
