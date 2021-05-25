import { Injectable } from '@angular/core';
import { Deporte } from 'src/app/deportes/deporte';

@Injectable({
  providedIn: 'root'
})
export class DeportistaCategoriaService {

  deportista_categoria: boolean = false;

  constructor() { }

  openDeportistaCategoria(){
    this.deportista_categoria = true;
  }

  closeDeportistaCategoria(){
    this.deportista_categoria = false;
  }
}
