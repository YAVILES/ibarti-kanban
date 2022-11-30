import { Component, EventEmitter, Inject, Input, NgZone, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskSchema } from 'src/app/core/';
import { Users } from 'src/app/core/models/users';
import { Actividades } from 'src/app/core/models/activity';

import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { take } from 'rxjs/operators';
import { CdkConnectedOverlay } from '@angular/cdk/overlay';
import { IbartiService } from 'src/app/core/services/ibarti.service';
import { TaskService } from 'src/app/core/services/task.service';
import { ToastrService } from 'ngx-toastr';
import { environment as env } from '../../../../environments/environment';
import { DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { getLocalStorage } from 'src/app/utils/localStorage';

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
  selector: 'app-edit-activity-task',
  templateUrl: './edit-activity-task.component.html',
  styleUrls: ['./edit-activity-task.component.scss']
})
export class EditActivityTaskComponent implements OnInit {

  @Output() editTask: EventEmitter<TaskSchema> = new EventEmitter();
  @ViewChild('autosize') autosize!: CdkTextareaAutosize;
  @Input() connectedOverlay!: CdkConnectedOverlay;
  @Input() users: Actividades[] = [];
  fechavence :string="" ;
  formText: string = "Edit Actividades";
  createTask!: FormGroup;
  selectedUser: string | undefined = "";
  id: string = "";
  errort: boolean=false;
  status:string | undefined = "";
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {task: TaskSchema, listId: string, historial: Actividades[]},
    private fb: FormBuilder,public toastr:ToastrService,
    private _ngZone: NgZone,private miDatePipe: DatePipe,
    private tasksService: TaskService,
    private ibartiService: IbartiService
  ) { }

  ngOnInit(): void {
    this.setForm();
    this.selectedUser = '';
    if (this.data.task && this.data.task.codigo &&  this.data.task.codigo.length > 0) {
      // this.setValuesOnForm(this.task);
      this.formText = 'Actividades';
      this.selectedUser = this.data.task.cod_usuario;
      this.status = this.data.task.nov_status_kanban;
       
    } else {
      this.formText = 'Crear';
    } 
    
  }

  setForm(): void {
    this.createTask = this.fb.group({
      usuario: `${getLocalStorage('userIbartiKanban')}`,
      cod_usuario: [this.data.task?.cod_usuario ? this.data.task.cod_usuario : ""],
      codigo : [this.data.task?.codigo],
      status: [this.data.task?.cod_nov_status_kanban ? this.data.task.cod_nov_status_kanban : ""],
      novedad: [this.data.task?.novedad ? this.data.task.novedad: ""],
      fec_vencimiento:[this.data.task?.fec_vencimiento ? this.data.task.fec_vencimiento:this.data.task.fec_vencimiento]
    });
     this.getDataactividades();
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

  
  getDatausuarios(): void {
    this.ibartiService.getUsuarios()
      .subscribe(
        (response: any) => this.data.historial = response,
        (error: string) => (console.log('Ups! we have an error: ', error))
    );
 }
 getDataactividades(): void {
  this.ibartiService.getTasksEditActivity(this.data.task)
    .subscribe(
      (response: any) => this.data.historial = response,
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
