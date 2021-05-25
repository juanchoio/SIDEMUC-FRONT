import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { Deporte } from './deporte';
import { DEPORTES } from './deportes.json';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../usuarios/auth.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class DeporteService {

  private urlEndpoint: string = 'http://localhost:9091/v1/poli/deportes';

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
      this.router.navigate(['/deportes']);
      return true;
    }
    return false;
  }

  /**Obtener todos los deportes */
  getDeportes(): Observable<Deporte[]> {
    //return of(DEPORTES);//aqui convertimos nuestro listado de clientes en un observable
    return this.http.get<Deporte[]>(this.urlEndpoint, 
      {headers: this.addAuthorizationHeader()}).pipe(
      catchError(e => {
        this.isNoAuthorized(e);
        return throwError(e);
      })
    );
  }

  /**Va a recibir el objeto deporte en Json
  */
  create(deporte: Deporte): Observable<Deporte>{
    return this.http.post<Deporte>(`${this.urlEndpoint}/crear`, deporte, 
    {headers: this.addAuthorizationHeader()}).pipe(
      catchError(e => {
        this.isNoAuthorized(e);
        return throwError(e);
      })
    );
  }

  /**Obtener deporte por id */
  getDeporte(id): Observable<Deporte>{
    return this.http.get<Deporte>(`${this.urlEndpoint}/detalle/${id}`, 
    {headers: this.addAuthorizationHeader()}).pipe(
      catchError(e => {
        this.isNoAuthorized(e);
        return throwError(e);
      })
    );
  }

  update(deporte: Deporte): Observable<Deporte>{
    return this.http.put<Deporte>(`${this.urlEndpoint}/actualizar/${deporte.id}`, deporte, 
    {headers: this.addAuthorizationHeader()}).pipe(
      catchError(e => {
        this.isNoAuthorized(e);
        return throwError(e);
      })
    );
  }

  delete(id: number): Observable<Deporte>{
    return this.http.delete<Deporte>(`${this.urlEndpoint}/eliminar/${id}`, 
    {headers: this.addAuthorizationHeader()}).pipe(
      catchError(e => {
        this.isNoAuthorized(e);
        return throwError(e);
      })
    );
  }

}
