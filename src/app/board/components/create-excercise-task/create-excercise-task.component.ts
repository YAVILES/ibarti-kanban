import { Component, EventEmitter, Inject, Input, NgZone, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskSchema } from 'src/app/core/';
import { Actividades } from 'src/app/core/models/actividades';
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


@Component({
  selector: 'app-create-excercise-task',
  templateUrl: './create-excercise-task.component.html',
  styleUrls: ['./create-excercise-task.component.scss']
})
export class CreateExcerciseTaskComponent implements OnInit {
 @Output() editActivity: EventEmitter<Actividades> = new EventEmitter();
  @ViewChild('autosize') autosize!: CdkTextareaAutosize;
  @Input() connectedOverlay!: CdkConnectedOverlay;
  @Input() users: Users[] = [];
  fechavence :string="" ;
  formText: string = "Editar";
  createTaskA!: FormGroup;
  selectedUser: string | undefined = "";
  id: string = "";
  errort: boolean=false;
  status:string | undefined = "";
  actividad:string | undefined = ""; ;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {task:TaskSchema, taskacti: Actividades, listId: string, users: Users[]},
    private fb: FormBuilder,public toastr:ToastrService,
    private _ngZone: NgZone,private miDatePipe: DatePipe,
    private tasksService: TaskService,
    private ibartiService: IbartiService
  ) { }

  ngOnInit(): void {
    this.setForm();
    this.selectedUser = '';
    if (this.data.taskacti) {
      // this.setValuesOnForm(this.task);
      this.formText = 'Actividad';
      this.status = this.data.task.nov_status_kanban; 
      
    } else {
      this.formText = 'Crear';
    } 
  }
  setForm(): void {
    this.createTaskA= this.fb.group({
      usuario: `${env.USER_DEFAULT}`,
      actividad: [this.data.taskacti?.actividad ? this.data.taskacti.actividad: ""],
      codigo : [this.data.task?.codigo],
           
    });
   
  }

  onFormAdd(): void {
    console.log(`ojo${this.data.task}`);
   if (this.createTaskA.valid && this.data.task && this.data.listId){
      this.ibartiService.CrearExcerciseTask(this.createTaskA.value)
      .subscribe(
        (data): void => {
          this.toastr.info("Datos Guardados con Exitos!.");
          this.tasksService.updateTask(this.createTaskA.value, this.data.listId ?? '')
        },
        error => {
          this.toastr.error("Error , Cargando Datos del Task");
          this.errort=true;
        });
    }
  }
  
  setValuesOnForm(form: Actividades): void {
    this.createTaskA.setValue({
      cod_usuario: form.usuario
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
        (response: any) => this.users = response,
        (error: string) => (console.log('Ups! we have an error: ', error))
    );
 }
  formatearFecha(fecha: string) {
    const fechaArray = new Date(fecha);

    // Pasamos fecha a milisegundos
    
    const fechaFormateada = this.miDatePipe.transform(fechaArray, 'yyyy-MM-dd HH:mm:ss-SS');

    return `${fechaFormateada} ${fecha.split(/[\s]/g)[1]}-00`;
  }
}
