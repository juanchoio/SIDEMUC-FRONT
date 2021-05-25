import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Categoria } from './categoria';
import { CategoriaService } from './categoria.service';

@Component({
  selector: 'app-form-categoria',
  templateUrl: './form-categoria.component.html',
  styleUrls: ['./form-categoria.component.css']
})
export class FormCategoriaComponent implements OnInit {

  public categoria: Categoria = new Categoria();

  public titulo: string = 'Crear Categoria';

  constructor(private categoriaService: CategoriaService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.cargarCategoria();
  }

  cargarCategoria(): void{
    this.activatedRoute.params.subscribe(params => {
      let id = params['id']
      if(id){
        this.categoriaService.getCategoria(id).subscribe((categoria) => this.categoria = categoria)
      }
    });
  }

  create(): void{
    this.categoria.enabled = true;//ponemos el atributo enable
    this.categoriaService.create(this.categoria)
    .subscribe(categoria => {
      this.router.navigate(['/categorias'])
      Swal.fire('Nueva Categoría', `Categoría ${categoria.nombreCategoria} creada con éxito!`, 'success')
    });
  }

  update(): void{
    this.categoriaService.update(this.categoria)
    .subscribe( categoria => {
      this.router.navigate(['/categorias'])
      Swal.fire('Categoría Actualizada', `Categoría ${categoria.nombreCategoria} actualizada con éxito!`, 'success')
    });
  }
  
}
