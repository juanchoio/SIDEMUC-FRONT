import { Categoria } from "../categorias/categoria";
import { Deporte } from "../deportes/deporte";
import { Habilidad } from "../habilidades/habilidad";

export class Deportista {
    id: number;
    numeroDocumento: number;
    nombrePersona: string;
    apellidoPersona: string;
    fechaNacimiento: string;
    edad: number;
    direccion: string;
    telefono: number;
    sexo: string;
    correo: string;
    foto: string;
    enabled: boolean;
    createAt: string;
    deporte: Deporte;
    categoria: Categoria;
    habilidades: Habilidad[] = [];
}
