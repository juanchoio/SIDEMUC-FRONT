import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { flatMap, map, startWith } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Monitor } from '../../monitor';
import { Role } from './role';
import { UserService } from './user.service';
import { Usuario } from './usuario';
import { UsuarioService } from './usuario.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit, OnChanges {

  @Input() monitor: Monitor;

  titulo: string = 'Asignacion de credenciales';

  @Input() usuario: Usuario; 

  public usuarioNew: Usuario = new Usuario();

  public roles: Role[];

  public role: Role = new Role();

  autocompleteControl = new FormControl();

  rolesFiltrados: Observable<Role[]>;

  constructor(private activatedRoute: ActivatedRoute,
    public usuarioService: UsuarioService,
    public userService: UserService) { }

  ngOnInit(): void {
    this.rolesFiltrados = this.autocompleteControl.valueChanges
    .pipe(
      map(value => typeof value === 'string'? value: value.nombre),
      flatMap(value => value ? this._filter(value): [])
    );
    this.cargarRoles(); 
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    console.log(changes);
    console.log(this.monitor);
    console.log(this.usuario);
    //this.cargarUsuario();
    console.log(this.usuario);
    // if(!this.usuario){
    //   this.usuario = this.usuarioNew;
    // }

    
  }

  /*falta la implementacion*/
  asignarCredencialesMonitor(): void{
    this.usuario.enabled = true;
    this.usuario.monitor = this.monitor;
    console.log(this.usuario); 
    this.usuarioService.create(this.usuario)
    .subscribe(usuario => {
      this.cerrarMonitorUsuario();
      Swal.fire('Credenciales Actualizadas', `Nombre de ususrio: ${usuario.username}`, 'success')
    });   
  }

  cerrarMonitorUsuario(){
    this.userService.closeMonitorUsuario();    
    console.log(this.usuario);
  }


  compararRole(r1: Role, r2: Role): boolean{
    if(r1 === undefined && r2 === undefined){
      return true;
    }
    return r1 === null || r2 === null || r1 === undefined || r2 === undefined? false: r1.id === r2.id;
  }

  /*carga los roles del atributo roles[] */
  cargarRoles(): void{
    this.usuarioService.getRoles().subscribe(roles => this.roles = roles);
  }

  // cargarUsuario(): void{
  //   this.usuarioService.getUsuarioPorIdMonitor(this.monitor.id).subscribe(usuario => {
  //     if(usuario){
  //       this.usuario  = usuario;
  //     }else{//lineas nuevas
  //       this.usuario = new Usuario();
  //     }
  //   });
  // }

  cargarUsuario(): void{
    if(!this.usuario){
      this.usuario = new Usuario();
    }
  }

  /**Metodos autoComplete */
  private _filter(value: string): Observable<Role[]>{
    const filterValue = value.toLowerCase();

    return this.usuarioService.filtrarRoles(filterValue);
  }

  showName(role?: Role): string | undefined{
    return role? role.nombre: undefined;
  }

  selectRole(event: MatAutocompleteSelectedEvent): void{
    let role = event.option.value as Role;
    console.log(role);

    if(!this.existRole(role.id)){
      this.usuario.roles.push(role);

      this.autocompleteControl.setValue('');
      event.option.focus();
      event.option.deselect();
    } else{
      Swal.fire('Error al seleccionar Rol', `El Rol ${role.nombre} ya esta seleccionado para el monitor ${this.monitor.nombrePersona} ${this.monitor.apellidoPersona}!`, 'info');
    }
  }

  quitRole(id: number): void{
    this.usuario.roles = this.usuario.roles
    .filter((role: Role) => id !== role.id);
  }

  existRole(id: number): boolean{
    let existe = false;

    if(this.usuario.roles){
      this.usuario.roles.forEach((role: Role) => {
        if(id == role.id){
          existe = true;
        }
      });
    } else{
      this.usuario.roles = [];
    }
    return existe;
  }

}
