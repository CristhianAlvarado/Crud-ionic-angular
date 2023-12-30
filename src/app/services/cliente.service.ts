import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import {Cliente} from '../models/cliente';


@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private url='http://localhost:8081/api/clientes/';

  constructor(private http: HttpClient ) {}

  public ObtenerClientes(){
    return this.http.get<Cliente[]>(this.url);
  }

  Guardar(cliente: Cliente){
    const formData=new FormData();
    formData.append('nombres',cliente.nombres);
    formData.append('apellidos',cliente.apellidos);
    formData.append('ruc_dni',cliente.ruc_dni);
    formData.append('direccion',cliente.direccion);
    formData.append('email',cliente.email);
    formData.append('imagenURL', cliente.imagenURL);
    return this.http.post(this.url,formData);
  }

  GetCliente(id: any){
    return this.http.get(`${this.url}?id=${id}`);
  }
 
  Editar(cliente: Cliente){
    const formData=new FormData();
    formData.append('cliente_id', cliente.cliente_id.toString());
    formData.append('nombres',cliente.nombres);
    formData.append('apellidos',cliente.apellidos);
    formData.append('ruc_dni',cliente.ruc_dni);
    formData.append('direccion',cliente.direccion);
    formData.append('email',cliente.email);
    formData.append('imagenURL', cliente.imagenURL);
    return this.http.post(this.url,formData);
  }

  Eliminar(cliente: Cliente){
    const formData=new FormData();
    formData.append('cliente_id', cliente.cliente_id.toString());
    return this.http.post(`${this.url}delete/`, formData)
  }
}
  
