import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {  NgZone} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListSchema, TaskSchema, Users } from './../../../core';
import { IbartiService } from 'src/app/core/services/ibarti.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { TaskService } from 'src/app/core/services/task.service';
import { ToastrService } from 'ngx-toastr';
import { environment as env } from '../../../../environments/environment';

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
  users: Users[] = [ ];
  
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
      fec_vencimiento: [this.task?.fec_vencimiento ? this.task.fec_vencimiento : "01/10/2022", Validators.required],
      status: [this.task?.cod_nov_status_kanban ? this.task.cod_nov_status_kanban : ""],
      novedad: [this.task?.novedad ? this.task.novedad: ""],
    });
   
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
        usuario: `${env.USER_DEFAULT}`, 
        cod_usuario: task.cod_usuario, 
        codigo: task.codigo,
        fec_vencimiento:task.fec_vencimiento,
        status: task.cod_nov_status_kanban ,
        
      })
      .subscribe(
        (response: any) => {
          this.toastr.info("Datos Guardados con Exitos!.");
          const index = this.list.tasks.findIndex(t => t.codigo == task.codigo);
          this.list.tasks[index].cod_nov_status_kanban = task.cod_nov_status_kanban;
          this.list.tasks[index].cod_usuario = task.cod_usuario;
          let user = this.users.find(u => u.codigo == task.cod_usuario);
          if(user) this.list.tasks[index].usuario = `${user.nombre} ${user.apellido}`;
        },
        (error: string) => (this.toastr.error("Error al Cargar los datos."))
      );
    }
  }
}
