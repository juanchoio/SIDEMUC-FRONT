import { Deporte } from "./deporte";

// lo difinimos como una constante
export const DEPORTES: Deporte[] = [
    {id: 1, nombreDeporte: 'Baloncesto', modalidadDeporte: 'Conjunto', enabled: true, createAt: '2017-01-22'},
    {id: 2, nombreDeporte: 'Ajedrez', modalidadDeporte: 'Individual', enabled: true, createAt: '2012-03-17'},
    {id: 3, nombreDeporte: 'Futbol', modalidadDeporte: 'Conjunto', enabled: true, createAt: '2009-09-03'},
    {id: 4, nombreDeporte: 'Ciclismo', modalidadDeporte: 'Individual', enabled: true, createAt: '2015-09-28'},
    {id: 5, nombreDeporte: 'Voleibol', modalidadDeporte: 'Conjunto', enabled: true, createAt: '2018-07-04'},
    {id: 6, nombreDeporte: 'Atletismo', modalidadDeporte: 'Conjunto', enabled: true, createAt: '2017-10-02'},
    {id: 7, nombreDeporte: 'Ciclismo', modalidadDeporte: 'Conjunto', enabled: false, createAt: '2021-11-17'}
  ];