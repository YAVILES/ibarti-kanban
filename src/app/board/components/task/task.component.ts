import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { ListSchema, TaskSchema, Histori} from './../../../core';
import { Actividades} from './../../../core/models/actividades';
import { MatDialog } from '@angular/material/dialog';
import { TaskService } from 'src/app/core/services/task.service';
import { HistorialComponent } from '../historial/historial.component';
import { EditActivityTaskComponent } from '../edit-activity-task/edit-activity-task.component';
import {  CreateExcerciseTaskComponent } from '../create-excercise-task/create-excercise-task.component';
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
  
  constructor(public dialog: MatDialog, public tasksService: TaskService) {}

  ngOnInit(): void {}

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
      data: {task: this.task, listId: this.list?.codigo, users: this.users, panelClass: "panelModal"},
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(`Dialog result: ${result}`);
    });
  }
  handleExecersiTask(taskacti:Actividades): void {
    const dialogRef = this.dialog.open(CreateExcerciseTaskComponent, {
      data: {task: this.task,  taskacti: this.taskacti,listId: this.list?.codigo, users: this.users, panelClass: "panelModal"},
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
