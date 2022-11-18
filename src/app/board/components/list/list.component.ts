import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {  NgZone} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListSchema, TaskSchema } from './../../../core';
import { IbartiService } from 'src/app/core/services/ibarti.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { TaskService } from 'src/app/core/services/task.service';
import {  ToastrService } from 'ngx-toastr';
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
  
  constructor(  private fb: FormBuilder,public toastr:ToastrService,
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
    this.list.tasks[event.currentIndex].cod_nov_status_kanban = this.list.codigo;
    this.actualizartask(this.list.tasks[event.currentIndex]);
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
    console.log(task, this.list);
    if (this.list) {
      task.listId = this.list.codigo;
      this.editTask.emit(task);
    }
  }
  
  actualizartask(task: TaskSchema): void {   
    if (this.list) {
       this.ibartiService.editTask({
        usuario: "1234", 
        cod_usuario: task.cod_usuario, 
        codigo: task.codigo,
        status: task.cod_nov_status_kanban 
      })
      .subscribe(
        (response: any) => (this.toastr.info("Datos Guardados con Exitos!.")),
        (error: string) => (this.toastr.error("Error al Cargar los datos."))
      );
    }
  }
}
