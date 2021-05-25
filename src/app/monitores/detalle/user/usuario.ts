import { Monitor } from "../../monitor";
import { Role } from "./role";

export class Usuario {
    id: number;
    username: string;
    password: string;
    enabled: boolean;
    monitor: Monitor;
    roles: Role[] = [];

    /**Ojo en la clase 142 se declara Monitor y Role
     * como string
     */
}
