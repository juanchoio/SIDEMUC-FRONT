import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { AuthService } from '../usuarios/auth.service';
import { Habilidad } from './habilidad';

@Injectable({
  providedIn: 'root'
})
export class HabilidadService {

  private urlEndpoint: string = 'http://localhost:9091/v1/poli/habilidades';

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
      this.router.navigate(['/habilidades']);
      return true;
    }

    return false;
  }


  /**Obtener tolas la habilidades con atributo enabled=true */
  getHabilidades(): Observable<Habilidad[]>{
    return this.http.get<Habilidad[]>(this.urlEndpoint, 
      {headers: this.addAuthorizationHeader()}).pipe(
      catchError(e => {
        this.isNoAuthorized(e);
        return throwError(e);
      })
    );
  }

  getHabilidad(id): Observable<Habilidad>{
    return this.http.get<Habilidad>(`${this.urlEndpoint}/detalle/${id}`, 
    {headers: this.addAuthorizationHeader()}).pipe(
      catchError(e => {
        this.isNoAuthorized(e);
        return throwError(e);
      })
    );
  }

  create(habilidad: Habilidad): Observable<Habilidad>{
    return this.http.post<Habilidad>(`${this.urlEndpoint}/crear`, habilidad, 
    {headers: this.addAuthorizationHeader()}).pipe(
      catchError(e => {
        this.isNoAuthorized(e);
        return throwError(e);
      })
    );
  }

  update(habilidad: Habilidad): Observable<Habilidad>{
    return this.http.put<Habilidad>(`${this.urlEndpoint}/actualizar/${habilidad.id}`, habilidad, 
    {headers: this.addAuthorizationHeader()}).pipe(
      catchError(e => {
        this.isNoAuthorized(e);
        return throwError(e);
      })
    );
  }

  delete(id: number): Observable<Habilidad>{
    return this.http.delete<Habilidad>(`${this.urlEndpoint}/eliminar/${id}`, 
    {headers: this.addAuthorizationHeader()}).pipe(
      catchError(e => {
        this.isNoAuthorized(e);
        return throwError(e);
      })
    );
  }
  
  filtrarHabilidades(termino: string): Observable<Habilidad[]>{
    return this.http.get<Habilidad[]>(`${this.urlEndpoint}/filtrar/${termino}`, 
    {headers: this.addAuthorizationHeader()}).pipe(
      catchError(e => {
        this.isNoAuthorized(e);
        return throwError(e);
      })
    );
  }

}
