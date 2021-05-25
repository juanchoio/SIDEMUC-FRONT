import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { AuthService } from '../usuarios/auth.service';
import { Monitor } from './monitor';

@Injectable({
  providedIn: 'root'
})
export class MonitorService {

  private urlEndpoint: string = 'http://localhost:9091/v1/poli/monitores';

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

  /**Este metodo verifica que el usuario este autorizado para acceder
   * a los recursos que tienen permiso, si no los tiene, sera redirigido
   * al componente de login.
   * Igualmente este metodo se implementa en los otros metodos de la clase
   * para efectuar las validaciones
  */
  private isNoAuthorized(e): boolean{
    //manejamos 401 -> cuando no está autenticado
    if(e.status == 401){//401 no autorizado, 403 prohibido 'forbidden'
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
  
  getMonitores(page: number): Observable<any>{
    return this.http.get(`${this.urlEndpoint}/page/${page}`, {headers: this.addAuthorizationHeader()}).pipe(
      catchError(e => {
        if(this.isNoAuthorized(e)){
          return throwError(e);
        }
      }),
      tap((response: any) => { //con tap hacemos algo sin modificar los valores de los atributos
      
        console.log('MonitorService: tap 1');
        (response.content as Monitor[]).forEach(monitor => {
        console.log(monitor.nombrePersona);
        })
      }),
      map((response: any) => {
        
         (response.content as Monitor[]).map(monitor =>{
          monitor.nombrePersona = monitor.nombrePersona.toUpperCase();
          monitor.apellidoPersona = monitor.apellidoPersona.toUpperCase();

          return monitor;//retornamos cada deportista modificado del arreglo
        });
        return response;
      }),
      tap(response => { //con tap hacemos algo sin modificar los valores de los atributos
        //let deportistas = response as Deportista[];//el map devuelve el flijo como tipo deportista
        console.log('MonitorService: tap 2');
        (response.content as Monitor[]).forEach(monitor => {
        console.log(monitor.nombrePersona);
        })
      })
    );
  }

  getMonitor(id): Observable<any>{
    return this.http.get<Monitor>(`${this.urlEndpoint}/detalle/${id}`, {headers: this.addAuthorizationHeader()}).pipe(
      catchError(e => {//para manejar el error
        if(this.isNoAuthorized(e)){
          return throwError(e); 
        }
        this.router.navigate(['/monitores']);
        console.error(e.error.mensaje);
        Swal.fire('Error al editar', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }

  create(monitor: Monitor): Observable<Monitor>{
    return this.http.post(`${this.urlEndpoint}/crear`, monitor, 
    {headers: this.addAuthorizationHeader()}).pipe(
      map((response:any) => response.monitor as Monitor),
      catchError(e => {

        if(this.isNoAuthorized(e)){
          return throwError(e); 
        }

        if(e.status == 400){//preguntamos si viene un error
          return throwError(e);
        }
        console.error(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  update(monitor: Monitor): Observable<any>{
    return this.http.put<any>(`${this.urlEndpoint}/actualizar/${monitor.id}`, monitor, {headers: this.addAuthorizationHeader()}).pipe(
      catchError(e => {
        if(this.isNoAuthorized(e)){
          return throwError(e); 
        }
        if(e.status == 400){
          return throwError(e);
        }
        console.error(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  delete(id: number): Observable<Monitor>{
    return this.http.delete<Monitor>(`${this.urlEndpoint}/eliminar/${id}`, {headers: this.addAuthorizationHeader()}).pipe(
      catchError(e => {
        if(this.isNoAuthorized(e)){
          return throwError(e); 
        }
        console.error(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  uploadPhoto(archivo: File, id): Observable<HttpEvent<{}>>{
    let formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("id", id);

    let httpHeaders = new HttpHeaders();
    let token = this.authService.token;
    if(token != null){
      httpHeaders = httpHeaders.append('Authorization', 'Bearer ' + token);
    }

    const req = new HttpRequest('POST', `${this.urlEndpoint}/upload`, formData, {
      reportProgress: true,
      headers: httpHeaders
    });
    
    return this.http.request(req).pipe(
      catchError(e => {
        this.isNoAuthorized(e);
        return throwError(e);
      })
    );
  }

}
