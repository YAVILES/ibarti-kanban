import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ListSchema, TaskSchema } from './../../../core';
import { MatDialog } from '@angular/material/dialog';
import { TaskService } from 'src/app/core/services/task.service';
import { getLocalStorage } from 'src/app/utils/localStorage';

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
  isAdmin: boolean = false;
  constructor(public dialog: MatDialog, public tasksService: TaskService) {}

  ngOnInit(): void {
    this.isAdmin = getLocalStorage('admin_kanban') == 'T'
  }

  handleEditTask(task: TaskSchema) {
    console.log(`POlicia Ucraniano${task.cod_nov_status_kanban}`);
    this.editTask.emit(task);
  }
}
