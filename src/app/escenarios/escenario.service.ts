import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { AuthService } from '../usuarios/auth.service';
import { Escenario } from './escenario';

@Injectable({
  providedIn: 'root'
})
export class EscenarioService {

  private urlEndpoint: string = 'http://localhost:9091/v1/poli/escenarios';

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
    this.router.navigate(['/login']);
    return true;
  }

  //manejamos el 403 -> acceso prohibido
  if(e.status == 403){//401 no autorizado, 403 prohibido 'forbidden'
    Swal.fire('Acceso denegado', `Hola ${this.authService.usuario.username} no tienes acceso a este recurso!`, 'warning');
    this.router.navigate(['/escenarios']);
    return true;
  }
  return false;
}


  getEscenarios(): Observable<Escenario[]>{
    return this.http.get<Escenario[]>(this.urlEndpoint, 
      {headers: this.addAuthorizationHeader()}).pipe(
      catchError(e => {
        this.isNoAuthorized(e);
        return throwError(e);
      })
    );
  }

  getEscenario(id): Observable<Escenario>{
    return this.http.get<Escenario>(`${this.urlEndpoint}/detalle/${id}`, 
    {headers: this.addAuthorizationHeader()}).pipe(
      catchError(e => {
        this.isNoAuthorized(e);
        return throwError(e);
      })
    );
  }

  create(escenario: Escenario): Observable<Escenario>{
    return this.http.post<Escenario>(`${this.urlEndpoint}/crear`, escenario, 
    {headers: this.addAuthorizationHeader()});
  }

  update(escenario: Escenario): Observable<Escenario>{
    return this.http.put<Escenario>(`${this.urlEndpoint}/actualizar/${escenario.id}`, escenario, 
    {headers: this.addAuthorizationHeader()}).pipe(
      catchError(e => {
        this.isNoAuthorized(e);
        return throwError(e);
      })
    );
  }

  delete(id: number): Observable<Escenario>{
    return this.http.delete<Escenario>(`${this.urlEndpoint}/eliminar/${id}`, 
    {headers: this.addAuthorizationHeader()}).pipe(
      catchError(e => {
        this.isNoAuthorized(e);
        return throwError(e);
      })
    );
  }

}
