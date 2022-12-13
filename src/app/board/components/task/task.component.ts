import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { ListSchema, TaskSchema, Histori} from './../../../core';
import { Actividades} from './../../../core/models/actividades';
import { FormBuilder, FormGroup,Validators} from '@angular/forms';
import { listaactividades} from './../../../core/models/listaactividades';
import { MatDialog } from '@angular/material/dialog';
import { TaskService } from 'src/app/core/services/task.service';
import { HistorialComponent } from '../historial/historial.component';
import { EditActivityTaskComponent } from '../edit-activity-task/edit-activity-task.component';
import {  CreateExcerciseTaskComponent } from '../create-excercise-task/create-excercise-task.component';
import { IbartiService } from 'src/app/core/services/ibarti.service';
import { environment as env } from '../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
})
export class TaskComponent implements OnInit {
  @Input()
  task!: TaskSchema;
  @Input() taskacti!: Actividades;
  @Output() editTask: EventEmitter<TaskSchema> = new EventEmitter();
  @Output() editActivity: EventEmitter<Actividades> = new EventEmitter();
  @Input() list?: ListSchema;
  @Input() users: Histori[] = [];
  panelOpenState = false;
  createTaskA!: FormGroup;
  actividades:listaactividades[]= [];
  selectedactividad: string | undefined = "";
  panelOpenStatedos = false;
  constructor(public dialog: MatDialog, public tasksService: TaskService,private ibartiService: IbartiService, private fb:FormBuilder,public toastr:ToastrService) {}

  ngOnInit(): void {
   
    this.getDataactividades();
    this.selectedactividad = '';
    this.setForm();
  }

  handleEditTask(task: TaskSchema) {
    
    this.editTask.emit(task);
  }

  handleHistorialTask(task:TaskSchema): void {
    const dialogRef = this.dialog.open(HistorialComponent, {
      data: {task: this.task, listId: this.list?.codigo, users: this.users, panelClass: "panelModal"},
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(`Dialog result: ${result}`);
    });
  }
  handleEditactivityTask(task:TaskSchema): void {
    const dialogRef = this.dialog.open(EditActivityTaskComponent, {
      data: {task: this.task, listId: this.list?.codigo, users: this.users},
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(`Dialog result: ${result}`);
    });
  }
  handleExecersiTask(taskacti:Actividades): void {
    const dialogRef = this.dialog.open(CreateExcerciseTaskComponent, {
      data: {task: this.task,  taskacti: this.taskacti,listId: this.list?.codigo, users: this.users},
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(`Dialog result: ${result}`);
    });
  }
  getDataactividades(): void {
   
    this.ibartiService.getTasksEditActivity(this.task)
      .subscribe(
        (response: any) => this.actividades = response,
        (error: string) => (console.log('Ups! we have an error: ', error))
    );
    
  }
  setForm(): void {
    this.createTaskA= this.fb.group({
      usuario: `${env.USER_DEFAULT}`,
      actividad: ["", Validators.required],
      codigo: ["", Validators.required],
      editada:["1"],    
    });
  }

  handleModificarctivityTask(): void {
    
    if ( this.createTaskA.valid){
      this.ibartiService.CrearUpdateActividadTask(this.createTaskA.value)
      .subscribe(
        (data): void => {
          this.toastr.info("Datos Guardados con Exitos!.");
          this.tasksService.updateTask(this.createTaskA.value, this.task.listId ?? '')
        },
        error => {
          this.toastr.error("Error , Cargando Datos del Task");
          
        });
    }
  }
 
}
