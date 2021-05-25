import { Deporte } from "../deportes/deporte";
import { Escenario } from "../escenarios/escenario";
import { Implemento } from "../implementos/implemento";

export class Monitor {
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
    implementos: Implemento[];
    escenario: Escenario;
}
