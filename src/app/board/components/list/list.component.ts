import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {  NgZone} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListSchema, TaskSchema } from './../../../core';
import { IbartiService } from 'src/app/core/services/ibarti.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { TaskService } from 'src/app/core/services/task.service';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})

export class ListComponent implements OnInit {
  @Input()
  list!: ListSchema;
  @Input() task?: TaskSchema;
  @Output() editTask: EventEmitter<TaskSchema> = new EventEmitter();
  createTask!: FormGroup;
  users: TaskSchema[] = [ ];
  
  constructor(  private fb: FormBuilder,
    private _ngZone: NgZone, public tasksService: TaskService,public ibartiService:IbartiService) {}

  ngOnInit(): void { 
    this.setForm(); 

  }

  drop(event: CdkDragDrop<TaskSchema[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }
    this.actualizartask();
  }
  setForm(): void {
    this.createTask = this.fb.group({
      usuario:this.task?.usuario,
      cod_usuario: [this.task?.cod_usuario ? this.task.cod_usuario : "", Validators.required],
      codigo : this.task?.codigo,
      status: [this.task?.cod_nov_status_kanban ? this.task.cod_nov_status_kanban : ""],
      novedad: [this.task?.novedad ? this.task.novedad: ""],
    });
    console.log("POlicia Vivo"+ this.createTask.controls["usuario"].value);
  }
  handleEdit(task: TaskSchema){
    
    if (this.list) {
    
      task.listId = this.list.codigo;
      this.editTask.emit(task);
      }
   
  }
  
  actualizartask(): void {
   
   
    if (this.list) {
       this.ibartiService.editTask(this.createTask.value)
      .subscribe(
        (response: any) => this.users = response,
        (error: string) => (console.log('Ups! we have an error: ', error))
    );

      }
  
  
  }
}
