import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-paginador',
  templateUrl: './paginador.component.html',
  styleUrls: ['./paginador.component.css']
})
export class PaginadorComponent implements OnInit, OnChanges {

  //este es el atributo del selector, la anotacion es para inyectar
  @Input() paginador: any; //en mismo que tenemos en la clase padre 'DeportistaComponent'

  @Input() enlacePaginador: string;

  paginas: number[];

  desde: number;
  hasta: number;
  
  constructor() { }


  ngOnInit(): void {
    this.initPaginador();

  }

  ngOnChanges(changes: SimpleChanges): void {    
    let paginadorActualizado = changes['paginador'];
    if(paginadorActualizado.previousValue){
      this.initPaginador();
    }
  }

  private initPaginador(): void{
    this.desde = Math.min(Math.max(1, this.paginador.number-4), this.paginador.totalPages-5);
    this.hasta = Math.max(Math.min(this.paginador.totalPages, this.paginador.number+4), 6);

    if(this.paginador.totalPages>5){
      this.paginas = new Array(this.hasta-this.desde+1).fill(0).map((_valor, indice) => indice + this.desde);
    }else{
      this.paginas = new Array(this.paginador.totalPages).fill(0).map((_valor, indice) => indice + 1);
    }
  }


}
