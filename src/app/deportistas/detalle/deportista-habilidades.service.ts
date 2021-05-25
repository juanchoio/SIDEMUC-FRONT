import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DeportistaHabilidadesService {

  deportista_habilidades: boolean = false;

  constructor() { }

  openDeportistaHabilidades(){
    this.deportista_habilidades = true;
  }

  closeDeportistaHabilidades(){
    this.deportista_habilidades = false;
  }

}
