import { Component, EventEmitter, Input, NgZone, OnInit, Output, ViewChild } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { TaskSchema } from 'src/app/core/';
import { Users } from 'src/app/core/models/users';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { take } from 'rxjs/operators';
import { CdkConnectedOverlay } from '@angular/cdk/overlay';
import { IbartiService } from 'src/app/core/services/ibarti.service';
import { TaskService } from 'src/app/core/services/task.service';


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
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.scss'],
})
export class CreateTaskComponent implements OnInit {
  @Output() editTask: EventEmitter<TaskSchema> = new EventEmitter();
  @ViewChild('autosize') autosize!: CdkTextareaAutosize;
  @Input() connectedOverlay!: CdkConnectedOverlay;
  @Input() task?: TaskSchema;
  @Input() users: Users[] = [];
  @Input() listId?: string;

  formText: string = "Editar";
  createTask!: FormGroup;
  selectedUser: string | undefined = "";
  id: string = "";
  status:string | undefined = "";
  constructor(
    private fb: FormBuilder,
    private _ngZone: NgZone,
    private tasksService: TaskService,
    private ibartiService: IbartiService
    
  ) { }

  ngOnInit(): void {
    this.setForm();
    this.selectedUser = '';
    if (this.task && this.task.codigo &&  this.task.codigo.length > 0) {
      // this.setValuesOnForm(this.task);
      this.formText = 'Editar';
      this.selectedUser = this.task.cod_usuario;
      this.status = this.task.nov_status_kanban;
    } else {
      this.formText = 'Crear';
    } 
  }

  setForm(): void {
    this.createTask = this.fb.group({
      usuario: "1234",
      cod_usuario: [this.task?.cod_usuario ? this.task.cod_usuario : "", Validators.required],
      codigo : [this.task?.codigo],
      status: [this.task?.cod_nov_status_kanban ? this.task.cod_nov_status_kanban : ""],
      novedad: [this.task?.novedad ? this.task.novedad: ""],
    });
  }

  onFormAdd(): void {
   if (this.createTask.valid && this.task && this.listId){
      this.ibartiService.editTask(this.createTask.value)
      .subscribe(
        data => this.tasksService.updateTask(this.createTask.value, this.listId ?? ''), 
        error => console.log(error));
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
    alert("Datos Gurdados Con Exitos");
  }
  
}
