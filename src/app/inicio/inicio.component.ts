import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {


  listaDeporte: string[] = ['Baloncesto', 'Fútbol', 'Voleibol', 'Atletismo'];

  habilitar: boolean = true;

  constructor() { }

  ngOnInit(): void {
  }

  setHabilitar(): void{
    this.habilitar = (this.habilitar==true)? false: true;
  }

}
