import { DatePipe } from '@angular/common';
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { AuthService } from '../usuarios/auth.service';
import { Deportista } from './deportista';


@Injectable({
  providedIn: 'root'
})
export class DeportistaService {

  private urlEndpoint: string = 'http://localhost:9091/v1/poli/deportistas';

  /**httpHeaders es un objeto inmutable */
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
    if(e.status == 401){//401 no autorizado, 403 prohibido 'forbidden'
      this.router.navigate(['/login']);
      return true;
    }

    if(e.status == 403){//401 no autorizado, 403 prohibido 'forbidden'
      Swal.fire('Acceso denegado', `Hola ${this.authService.usuario.username} no tienes acceso a este recurso!`, 'warning');
      this.router.navigate(['/deportistas']);
      return true;
    }
    return false;
  }

  /**SE DEBE IMPLEMENTAR EL GET ESCENARIOS, IMPLEMENTOS PARA
   * LA LISTA SELECT CUANDO SE VAYAN A ASIGNAR CLASE 141
   */

  getDeportistas(page: number): Observable<any>{
    return this.http.get(this.urlEndpoint + "/page/" + page, {headers: this.addAuthorizationHeader()}).pipe(
      catchError(e => {
        if(this.isNoAuthorized(e)){
          return throwError(e);
        }
      }),
      tap((response: any) => { //con tap hacemos algo sin modificar los valores de los atributos
        
        console.log('DeportistaService: tap 1');
        (response.content as Deportista[]).forEach(deportista => {
        console.log(deportista.nombrePersona);
        })
      }),
      map((response: any) => {
        
         (response.content as Deportista[]).map(deportista =>{
          deportista.nombrePersona = deportista.nombrePersona.toUpperCase();
          deportista.apellidoPersona = deportista.apellidoPersona.toUpperCase();
          //deportista.apellidoPersona = deportista.apellidoPersona.toUpperCase();//upperCase en la vista, otra forma
          
          //let datePipe = new DatePipe('es');
          //deportista.fechaNacimiento = datePipe.transform(deportista.fechaNacimiento, 'EEEE dd, MMMM yyyy');
          // deportista.createAt = datePipe.transform(deportista.createAt, 'EEEE dd, MMMM yyyy');//formateamos con pipe en la vista
          
          return deportista;//retornamos cada deportista modificado del arreglo
        });
        return response;
      }),
      tap(response => { //con tap hacemos algo sin modificar los valores de los atributos
        //let deportistas = response as Deportista[];//el map devuelve el flijo como tipo deportista
        console.log('DeportistaService: tap 2');
        (response.content as Deportista[]).forEach(deportista => {
        console.log(deportista.nombrePersona);
        })
      })
    );
  }

  getDeportista(id): Observable<Deportista>{
    return this.http.get<Deportista>(`${this.urlEndpoint}/detalle/${id}`, {headers: this.addAuthorizationHeader()}).pipe(
      catchError(e => {//para manejar el error
        if(this.isNoAuthorized(e)){
          return throwError(e); 
        }
        this.router.navigate(['/deportistas']);
        console.error(e.error.mensaje);
        Swal.fire('Error al editar', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }

  create(deportista: Deportista): Observable<Deportista>{
    return this.http.post(`${this.urlEndpoint}/crear`, deportista, {headers: this.addAuthorizationHeader()}).pipe(
      map((response:any) => response.deportista as Deportista),
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

  update(deportista: Deportista): Observable<any>{
    return this.http.put<any>(`${this.urlEndpoint}/actualizar/${deportista.id}`, deportista, {headers: this.addAuthorizationHeader()}).pipe(
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

  delete(id: number): Observable<Deportista>{
    return this.http.delete<Deportista>(`${this.urlEndpoint}/eliminar/${id}`, {headers: this.addAuthorizationHeader()}).pipe(
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


    /**
     * .pipe(
      map((response: any) => response.deportista as Deportista),
      catchError(e => {
        console.error(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    )*/
     
  }

}
