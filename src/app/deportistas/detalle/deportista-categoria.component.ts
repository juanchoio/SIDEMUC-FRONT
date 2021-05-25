import { Component, Input, OnInit } from '@angular/core';
import { Categoria } from 'src/app/categorias/categoria';
import { CategoriaService } from 'src/app/categorias/categoria.service';
import { DeporteService } from 'src/app/deportes/deporte.service';
import Swal from 'sweetalert2';
import { Deportista } from '../deportista';
import { DeportistaService } from '../deportista.service';
import { DeportistaCategoriaService } from './deportista-categoria.service';

@Component({
  selector: 'deportista-categoria',
  templateUrl: './deportista-categoria.component.html',
  styleUrls: ['./deportista-categoria.component.css']
})
export class DeportistaCategoriaComponent implements OnInit {

  @Input() deportista: Deportista;

  titulo: string = 'Registro de categoría';

  categorias: Categoria[];

  public errores: string[];

  constructor(public deportistaCategoriaService: DeportistaCategoriaService,
    private categoriaService: CategoriaService,
    private deportistaService: DeportistaService) { }

  ngOnInit(): void {
    this.cargarCategorias();
  }

  cargarCategorias(){
    this.categoriaService.getCategorias().subscribe(categorias => this.categorias = categorias);
  }

  asignarCategoriaDeportista(): void{
    console.log(this.deportista);//para ver categoria    
    this.deportistaService.update(this.deportista)
    .subscribe( json => {
      this.cerrarDeportistaCategoria();
      Swal.fire('Categoría Actualizada', `${json.mensaje}: Categoría ${json.deportista.categoria.nombreCategoria}`, 'success');
    },
    err =>{
      this.errores = err.error.errors as string[];
      console.error('Código del error desde el backend: ' + err.status);
      console.error(err.error.errors);
    }
    );
  }

  // updateCategoriaDeportista(){
  //   console.log(this.deportista);
  //   this.deportistaService.update(this.deportista)
  //   .subscribe( json => {
  //     this.cerrarDeportistaCategoria();
  //     Swal.fire('Categoría Actualizada', `${json.mensaje}: Categoría ${json.deportista.categoria.nombreCategoria}`, 'success')
  //   },
  //   err =>{
  //     this.errores = err.error.errors as string[];
  //     console.error('Código del error desde el backend: ' + err.status)
  //     console.error(err.error.errors)
  //   }
  //   );
  // }

  cerrarDeportistaCategoria(){
    this.deportistaCategoriaService.closeDeportistaCategoria();
  }

  compararCategoria(c1: Categoria, c2: Categoria): boolean{
    if(c1 === undefined && c2 === undefined){
      return true;
    }
    return c1 === null || c2 === null || c1 === undefined || c2 === undefined? false: c1.id === c2.id;
  }


}
