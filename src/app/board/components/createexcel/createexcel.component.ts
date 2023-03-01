import { Component, EventEmitter, Inject, Input, NgZone, OnInit, Output, ViewChild } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { TaskSchema } from 'src/app/core/';
import { Users } from 'src/app/core/models/users';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { take } from 'rxjs/operators';
import { CdkConnectedOverlay } from '@angular/cdk/overlay';
import { IbartiService } from 'src/app/core/services/ibarti.service';
import { TaskService } from 'src/app/core/services/task.service';
import { ToastrService } from 'ngx-toastr';
import { environment as env } from '../../../../environments/environment';
import { DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TableUtil } from "src/app/board/components/createexcel/tableutil";
import * as XLSX from "xlsx";
type DropdownObject = {
  codigo: string;
  cedula?: string;
  nombre? :string;
  apellido?:string;
  login? :string;
  cod_perfil?: string;
  perfil?:string;
  email? : string;
  admin_kanban? :string;
};
export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: "Hydrogen", weight: 1.0079, symbol: "H" },
  { position: 2, name: "Helium", weight: 4.0026, symbol: "He" },
  { position: 3, name: "Lithium", weight: 6.941, symbol: "Li" },
  { position: 4, name: "Beryllium", weight: 9.0122, symbol: "Be" },
  { position: 5, name: "Boron", weight: 10.811, symbol: "B" },
  { position: 6, name: "Carbon", weight: 12.0107, symbol: "C" },
  { position: 7, name: "Nitrogen", weight: 14.0067, symbol: "N" },
  { position: 8, name: "Oxygen", weight: 15.9994, symbol: "O" },
  { position: 9, name: "Fluorine", weight: 18.9984, symbol: "F" },
  { position: 10, name: "Neon", weight: 20.1797, symbol: "Ne" }
];

@Component({
  selector: 'app-createexcel',
  templateUrl: './createexcel.component.html',
  styleUrls: ['./createexcel.component.scss']
})
export class CreateexcelComponent implements OnInit {
  @Output() editTask: EventEmitter<TaskSchema> = new EventEmitter();
  @ViewChild('autosize') autosize!: CdkTextareaAutosize;
  @Input() connectedOverlay!: CdkConnectedOverlay;
  @Input() users: Users[] = [];
  fechavence :string="" ;
  isChecked :boolean= true;
  formText: string = "Editar";
  createTask!: FormGroup;
  selectedUser: string | undefined = "";
  id: string = "";
  errort: boolean=false;
  status:string | undefined = "";
  displayedColumns: string[] = ["position", "name", "weight", "symbol"];
  matColumns: string[] = ["name", "symbol"];
  dataSource = ELEMENT_DATA;
  reverseDataSource = [...ELEMENT_DATA].reverse();
  PeriodicElement:any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {task: TaskSchema, listId: string, users: Users[]},
    private fb: FormBuilder,public toastr:ToastrService,
    private _ngZone: NgZone,private miDatePipe: DatePipe,
    private tasksService: TaskService,
    private ibartiService: IbartiService,
   
  ) { }

  ngOnInit(): void {
    this.setForm();
    this.selectedUser = '';
    if (this.data.task && this.data.task.codigo &&  this.data.task.codigo.length > 0) {
      // this.setValuesOnForm(this.task);
      this.formText = 'Crear';
      this.selectedUser = this.data.task.cod_usuario;
      this.status = this.data.task.nov_status_kanban;
       
    } else {
      this.formText = 'Crear';
    } 
    
  }

  setForm(): void {
    this.createTask = this.fb.group({
      usuario: `${env.USER_DEFAULT}`,
      fecha_desde:[this.data.task?.fec_vencimiento ? this.data.task.fec_vencimiento: "null"],
      fecha_hasta:[this.data.task?.fec_vencimiento ? this.data.task.fec_vencimiento: "null"],
      detalle :[this.data.task?.respuesta ? this.data.task.respuesta: false],
    });
    console.log("Valor Detalle"+ this.createTask.controls['detalle'].value);
  }

  onFormAdd(): void {
    console.log(this.createTask.value && this.data.task, this.data.listId);
   if (this.createTask.valid && this.data.task && this.data.listId){
      this.ibartiService.editTask(this.createTask.value)
      .subscribe(
        data => {
          this.toastr.info("Datos Guardados con Exitos!.");
          this.tasksService.updateTask(this.createTask.value, this.data.listId ?? '')
        },
        error => {
          this.toastr.error("Error , Cargando Datos del Task");
          this.errort=true;
        });
    }
  }
  
  setValuesOnForm(form: TaskSchema): void {
    this.createTask.setValue({
      cod_usuario: form.cod_usuario
     });
  }

  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable
      .pipe(take(1))
      .subscribe(() => this.autosize.resizeToFitContent(true));
  }

  close(): void {
    this.connectedOverlay.overlayRef.detach();
  }

  save(){
    this.onFormAdd();
  }
  getDatausuarios(): void {
    this.ibartiService.getUsuarios()
      .subscribe(
        (response: any) => this.dataSource = response,
        (error: string) => (console.log('Ups! we have an error: ', error))
    );
 }
  formatearFecha(fecha: string) {
    const fechaArray = new Date(fecha);

    // Pasamos fecha a milisegundos
    
    const fechaFormateada = this.miDatePipe.transform(fechaArray, 'yyyy-MM-dd HH:mm:ss-SS');

    return `${fechaFormateada} ${fecha.split(/[\s]/g)[1]}-00`;
  }
  exportArray() {
    console.log("Descargando..");
    const filename = 'reporte_${Math.random()}.xlsx' ;
    this.ibartiService.getreport(this.createTask.value).subscribe(response =>{
      // this.manageExcelfile(response,filename);
      this.toastr.info("Archivo Excel Generado con exito!.");
    })

   
  }
  manageExcelfile(response:any,filename:string) {
    const datatype =response.type;
    const binaryData =[];
    binaryData.push(response);
    const filePath=window.URL.createObjectURL(new Blob(binaryData,{type:datatype}));
    const dowloandlink = document.createElement('a');
    dowloandlink.href=filePath;
    dowloandlink.setAttribute('download', 'report-tareas');
    document.body.appendChild(dowloandlink);
    dowloandlink.click();
  }
  changed(enable: boolean){
    if (enable) {
      this.createTask.controls['detalle'].disable;
    } 
  }
  
  }
