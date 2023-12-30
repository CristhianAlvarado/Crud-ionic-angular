import { Component, OnInit,Input } from '@angular/core';
import { NgForm, FormControl } from '@angular/forms';
import { ClienteService} from '../services/cliente.service';
import { Cliente} from '../models/cliente';
import { ModalController, NavParams } from '@ionic/angular';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.page.html',
  styleUrls: ['./agregar.page.scss'],
})
export class AgregarPage implements OnInit {

  @Input() cliente:Cliente;

  public previsualizacion: String;
  public archivos: any = [];
  edit=false;

  datos={
    nombres:'',
    apellidos:'',
    ruc_dni:'',
    direccion:'',
    email:'',
    imagenURL:'',
  }

  createFormGroup(){
    return new FormGroup({
      cliente_id: new FormControl(''),
      imagenURL: new FormControl(''),
      nombres: new FormControl('',[Validators.required,Validators.minLength(5)]),
      apellidos: new FormControl('',[Validators.required,Validators.minLength(5)]),
      ruc_dni: new FormControl('',[Validators.required,Validators.maxLength(8)]),
      direccion: new FormControl('',[Validators.required,Validators.maxLength(100)]),
      email: new FormControl('',[Validators.required, Validators.pattern("^[a-zA-Z0-9._%-]+@[a-zA-Z0-9*-]+.[a-zAZ]{2,4}$")]),
      
    });
  }
  
  validation_messages = {
      'nombres': [
        { type: 'required', message: 'Escriba Nombre.' },
        { type: 'minlength', message: 'Nombre maximo de 5 caracteres' }
      ],
      'apellidos': [
        { type: 'required', message: 'Escriba Apellido.' },
        { type: 'minlength', message: 'Apellido maximo de 5 caracteres' }
      ],
      'ruc_dni': [
        { type: 'required', message: 'Escriba RUC/DNI' },
        { type: 'maxlength', message: 'RUC/DNI es de 8 caracteres' }
      ],
      'direccion': [
        { type: 'required', message: 'Escriba direccion' },
        { type: 'maxlength', message: 'No puede escribir mas de 100 caracteres' }
      ],
      'email': [
        { type: 'required', message: 'Escribir correo' },
        { type: 'pattern', message: 'No es un formato de correo' }
      ],
  }

  get nombres() {
    return this.registrarForm.get('nombres');
  }
  get apellidos() {
    return this.registrarForm.get('apellidos');
  }
  get ruc_dni(){
    return this.registrarForm.get('ruc_dni');
  }
  get direccion(){
    return this.registrarForm.get('direccion');
  }
  get email(){
    return this.registrarForm.get('email');
  }
  get cliente_id(){
    return this.registrarForm.get('cliente_id');
  }
  get imagenURL(){
    return this.registrarForm.get('imagenURL')
  }
  
  registrarForm : FormGroup;

  constructor(private sanitizer: DomSanitizer, private service:ClienteService, private modalCtrl:ModalController, public formBuilder:FormBuilder, public navParams:NavParams){
    this.registrarForm=this.createFormGroup();    
  }

  capturarFile(event: any){
    const imgCapturada = event.target.files[0];
    this.extraerBase64(imgCapturada).then((imagen: any) => {
      this.previsualizacion = imagen.base;
      console.log(this.previsualizacion.length);
    })
    this.archivos.push(imgCapturada);
  }

  extraerBase64 = async ($event: any) => new Promise((resolve, reject) => {
    try {
      const unsafeImg = window.URL.createObjectURL($event);
      const image = this.sanitizer.bypassSecurityTrustUrl(unsafeImg);
      const reader = new FileReader();
      reader.readAsDataURL($event);
      reader.onload = () => {
        resolve({
          base: reader.result
        });
      };
      reader.onerror = error => {
        resolve({
          base: null
        });
      };
      return image;
    } catch (e) {
      return null;
    }
  })

  ngOnInit() {
    this.cliente = this.navParams.get('data');

    if (this.cliente){
      this.edit=true;
      console.log(this.cliente);
      this.registrarForm.setValue({
        cliente_id: this.cliente.cliente_id,
        nombres: this.cliente.nombres,
        apellidos: this.cliente.apellidos,
        ruc_dni: this.cliente.ruc_dni,
        direccion: this.cliente.direccion,
        email: this.cliente.email,
        imagenURL: this.cliente.imagenURL,
      })
      this.previsualizacion = this.cliente.imagenURL;
    }
  }
  cancel(){
    this.modalCtrl.dismiss(null,'cerrado');
  }
    
  onSubmit(){

    if(this.edit){
      const cliente=this.registrarForm.value;
      cliente.imagenURL = this.previsualizacion;
      this.service.Editar(cliente).subscribe(response => {
        this.modalCtrl.dismiss(response, 'actualizar')
      })

    } else{
      const cliente=this.registrarForm.value;
      cliente.imagenURL = this.previsualizacion;
      this.service.Guardar(cliente).subscribe(response=> {
        this.modalCtrl.dismiss(response,'guardar');
      });
    }
  }
}
