import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { URL_BACKEND } from '../config/config';
import { Role } from '../monitores/detalle/user/role';
import { Usuario } from '../monitores/detalle/user/usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _usuario: Usuario;//gion bajo porque va a tener un método accesor
  private _token: string;

  /**Este atributo de la clase permitirá preguntar el usuario
   * autenticado que roles tiene
   */
  private _role: string[];

  constructor(private http: HttpClient) { }

  /**Metodos get para obtener la informacion
   * desde otras clases
   * estos tienen una nomenclatura específica!
   * -> sin el guion
   */
  public get usuario(): Usuario{
    if(this._usuario != null){
      return this._usuario;
    } else if(this._usuario == null && sessionStorage.getItem('usuario') != null){
      this._usuario = JSON.parse(sessionStorage.getItem('usuario')) as Usuario;
      return this._usuario;
    }
    return new Usuario();//si no existe nada
  }

  public get token(): string{
    if(this._token != null){
      return this._token;
    } else if(this._usuario == null && sessionStorage.getItem('token') != null){
      this._token = sessionStorage.getItem('token');
      return this._token;
    }
    return null;
  }

  /**se obtendran los roles */
  public get role(): string[]{
    if(this._role != null){
      return this._role;
    } else if(this._role == null && sessionStorage.getItem('roles') != null){
      this._role = JSON.parse(sessionStorage.getItem('roles'));
      return this._role;
    }
    return null;
  }


  login(usuario: Usuario): Observable<any>{
    // const urlEndpoint = 'http://localhost:9091/v1/poli/oauth/token';

    const urlEndpoint = URL_BACKEND + '/v1/poli/oauth/token';

    //de la aplicacion (se encriptan en base64)
    const credenciales = btoa('sidemucapp' + ':' + '12345');

    const httpHeaders = new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': 'Basic ' + credenciales});

    let params = new URLSearchParams();
    params.set('grant_type', 'password');
    params.set('username', usuario.username);
    params.set('password', usuario.password);

    console.log(params.toString);
    
    return this.http.post<any>(urlEndpoint, params.toString(), {headers: httpHeaders});
  }

  guardarUsuario(accessToken: string): void{
    let payload = this.obtenerInfoToken(accessToken);
    this._usuario = new Usuario();
    this._usuario.username = payload.nombre_usuario;
    this._usuario.roles = payload.authorities;//authorities -> asi lo maneja spring

    this._role = payload.authorities;

    console.log(payload.authorities);

    //stringify() -> convierte un Json a un string
    //parse() -> un string a Json
    sessionStorage.setItem('usuario', JSON.stringify(this._usuario));
    sessionStorage.setItem('roles', JSON.stringify(this.role));
  }

  guardarToken(accessToken: string): void{
    this._token = accessToken;
    sessionStorage.setItem('token', accessToken);
    //como accessToken ya viene en string entonces no lo convertimos
  }

  obtenerInfoToken(accessToken: string):any{//any porque retorna un Json
    if(accessToken != null){
      return JSON.parse(atob(accessToken.split(".")[1]));
    }
    return null;
  }

  isAuthenticated(): boolean{
    let payload = this.obtenerInfoToken(this.token);
    if(payload != null && payload.nombre_usuario && payload.nombre_usuario.length>0){
      return true;
    }
    return false;
  }

  logout(): void{
    this._token = null;
    this._usuario = null;
    sessionStorage.clear();

    //si queremos eliminar los elementos por separado
    // sessionStorage.removeItem('token');
    // sessionStorage.removeItem('usuario');
  }

  /**Con este metodo preguntamos el usuario autenticado que
   * Role tiene para ocultar las vistas y los botones
   */

  hasRole(rol: string): boolean{
    if(this.usuario != null && this.role != null && this.role.includes(rol)){
      return true;
    }
    return false;
  }

}
