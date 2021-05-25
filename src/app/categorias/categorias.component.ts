import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { AuthService } from '../usuarios/auth.service';
import { Categoria } from './categoria';
import { CategoriaService } from './categoria.service';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css']
})
export class CategoriasComponent implements OnInit {

  categorias: Categoria[];

  constructor(private categoriaService: CategoriaService,
    public authService: AuthService) { }

  ngOnInit(): void {
    this.categoriaService.getCategorias().subscribe(
      categorias => this.categorias = categorias
    );
  }

  delete(categoria: Categoria): void{
    Swal.fire({
      title: 'Está seguro?',
      text: `¿Seguro que desea eliminar la categoría ${categoria.nombreCategoria}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar!',
      cancelButtonText: 'No, cancelar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoriaService.delete(categoria.id).subscribe(
          response => {
            //quitamos del listado deporrte el objeto que se eliminó
            this.categorias = this.categorias.filter(cat => cat != categoria)
            Swal.fire(
              'Categoría eliminada!',
              `Categoría ${categoria.nombreCategoria} eliminada con éxito!`,
              'success'
            )
          }
        )
      }
    })
  }

}
