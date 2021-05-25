import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Usuario } from '../monitores/detalle/user/usuario';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  titulo: string = 'Por favor inicie sesión!';
  usuario: Usuario;

  constructor(private authService: AuthService,
    private router: Router) {
    this.usuario = new Usuario();
  }

  ngOnInit(): void {
    if(this.authService.isAuthenticated()){
      Swal.fire('Login', `Hola ${this.authService.usuario.username} ya estas autenticado!`, 'info');
      this.router.navigate(['/inicio']);
    }
  }

  login(): void{
    console.log(this.usuario);
    if(this.usuario.username == null || this.usuario.password == null){
      Swal.fire('Error Login', 'El usuario o contraseña no puede estar vacío!', 'error');
      return;//nos salimos
    }

    this.authService.login(this.usuario).subscribe(
      response => {
        console.log(response);
        //para sacar la informacion del token
        //split convierte la cadena en arreglo. dividiendo por los puntos
        //el username tambien lo podemos sacar de InfoAdicionalToken(backend)
        //let payload = JSON.parse(atob(response.access_token.split(".")[1]));
        //console.log(payload);
        //lo estamos manejando en la clase AuthService
       

        //guardamos los datos del usuario y el token en el session storage
        this.authService.guardarUsuario(response.access_token);
        this.authService.guardarToken(response.access_token);

        let usuario = this.authService.usuario;//parece un atributo pero es un metodo

        this.router.navigate(['/inicio']);
        Swal.fire('Login', `Bienvenido ${usuario.username}, has iniciado sesión con éxito!`, 'success');
      }, error => {
        if(error.status == 400){
          Swal.fire('Error Login', 'Usuario o contraseña incorrectas!', 'error');
        }
      }
      );//cierra subscribe
  }

}
