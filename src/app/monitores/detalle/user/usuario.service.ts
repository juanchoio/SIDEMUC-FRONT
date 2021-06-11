import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { URL_BACKEND } from 'src/app/config/config';
import { AuthService } from 'src/app/usuarios/auth.service';
import Swal from 'sweetalert2';
import { Role } from './role';
import { Usuario } from './usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  // private urlEndpoint: string = 'http://localhost:9091/v1/poli/usuarios';

  private urlEndpoint: string = URL_BACKEND + '/v1/poli/usuarios';

  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(private http: HttpClient,
    private router: Router,
    private authService: AuthService) { }

  /**Este metodo lo llamamos en cada peticion
   * hacia nuestras rutas protegidas
   */
   private addAuthorizationHeader(){
    let token = this.authService.token;
    if(token != null){
      return this.httpHeaders.append('Authorization', 'Bearer ' + token);
    }
    return this.httpHeaders
  }

  private isNoAuthorized(e): boolean{
    if(e.status == 401){//401 no autorizado, 403 prohibido 'forbidden'
      /**preguntamos si estamos autenticados o si el token
      * expiro el token*/
      if(this.authService.isAuthenticated){
        this.authService.logout();
      }
      this.router.navigate(['/login']);
      return true;
    }

    //manejamos el 403 -> acceso prohibido
    if(e.status == 403){//401 no autorizado, 403 prohibido 'forbidden'
      Swal.fire('Acceso denegado', `Hola ${this.authService.usuario.username} no tienes acceso a este recurso!`, 'warning');
      this.router.navigate(['/monitores']);
      return true;
    }
    return false;
  }

  getUsuarioPorIdMonitor(idMonitor): Observable<Usuario>{
    return this.http.get<Usuario>(`${this.urlEndpoint}/detalle-usuario-monitor/${idMonitor}`, 
    {headers: this.addAuthorizationHeader()}).pipe(
      catchError(e => {
        this.isNoAuthorized(e);
        return throwError(e);
      })
    );
  }

  getUsuarioPorIdUsuario(idUsuario): Observable<Usuario>{
    return this.http.get<Usuario>(`${this.urlEndpoint}/detalle/${idUsuario}`, 
    {headers: this.addAuthorizationHeader()}).pipe(
      catchError(e => {
        this.isNoAuthorized(e);
        return throwError(e);
      })
    );
  }

  create(usuario: Usuario): Observable<Usuario>{
    return this.http.post<Usuario>(`${this.urlEndpoint}/crear`, usuario, 
    {headers: this.addAuthorizationHeader()}).pipe(
      catchError(e => {
        this.isNoAuthorized(e);
        return throwError(e);
      })
    );
  }

  update(usuario: Usuario): Observable<Usuario>{
    return this.http.put<Usuario>(`${this.urlEndpoint}/actualizar/${usuario.id}`, usuario, 
    {headers: this.addAuthorizationHeader()}).pipe(
      catchError(e => {
        this.isNoAuthorized(e);
        return throwError(e);
      })
    );
  }

  getRoles(): Observable<Role[]>{
    return this.http.get<Role[]>(`${this.urlEndpoint}/roles`, 
    {headers: this.addAuthorizationHeader()}).pipe(
      catchError(e => {
        this.isNoAuthorized(e);
        return throwError(e);
      })
    );
  }

  getRole(idRole): Observable<Role>{
    return this.http.get<Role>(`${this.urlEndpoint}/role/${idRole}`, 
    {headers: this.addAuthorizationHeader()}).pipe(
      catchError(e => {
        this.isNoAuthorized(e);
        return throwError(e);
      })
    );
  }

  filtrarRoles(term: string): Observable<Role[]>{
    return this.http.get<Role[]>(`${this.urlEndpoint}/filtrar/${term}`, 
    {headers: this.addAuthorizationHeader()}).pipe(
      catchError(e => {
        this.isNoAuthorized(e);
        return throwError(e);
      })
    );
  }

}
