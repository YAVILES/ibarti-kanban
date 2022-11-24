import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ListSchema, TaskSchema, Histori } from './../../../core';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { TaskService } from 'src/app/core/services/task.service';
import { HistorialComponent } from '../historial/historial.component';
@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
})
export class TaskComponent implements OnInit {
  @Input()
  task!: TaskSchema;
  @Output() editTask: EventEmitter<TaskSchema> = new EventEmitter();
  @Input() list?: ListSchema;
  @Input() users: Histori[] = [];
  constructor(public dialog: MatDialog, public tasksService: TaskService) {}

  ngOnInit(): void {}

  handleEditTask(task: TaskSchema) {
    
    this.editTask.emit(task);
  }
  removeTask(task:TaskSchema): void {
    const dialogRef = this.dialog.open(HistorialComponent, {
      data: {task: this.task, listId: this.list?.codigo,users: this.users},
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
