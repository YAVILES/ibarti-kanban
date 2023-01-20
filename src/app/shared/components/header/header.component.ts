import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { ListSchema, TaskSchema, Histori} from './../../../core';
import { CreateexcelComponent } from 'src/app/board/components/createexcel/createexcel.component';
import { FormBuilder, FormGroup,Validators} from '@angular/forms';
import { listaactividades} from './../../../core/models/listaactividades';
import { MatDialog } from '@angular/material/dialog';
import { TaskService } from 'src/app/core/services/task.service';
import { IbartiService } from 'src/app/core/services/ibarti.service';
import { ToastrService } from 'ngx-toastr';
import { getLocalStorage } from 'src/app/utils/localStorage';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() task!: TaskSchema;
  @Output() editTask: EventEmitter<TaskSchema> = new EventEmitter();
  selectedactividad: string | undefined = "";
  createTaskA!: FormGroup;
  actividades:listaactividades[]= [];
  @Input() list?: ListSchema;
  @Input() users: Histori[] = [];
  constructor(public dialog: MatDialog, public tasksService: TaskService,private ibartiService: IbartiService, private fb:FormBuilder,public toastr:ToastrService) {}


  ngOnInit(): void {
    this.getDataactividades();
    this.selectedactividad = '';
    this.setForm();
  }

  getDataactividades(): void {
   if(this.task){
      this.ibartiService.getTasksEditActivity(this.task)
        .subscribe(
          (response: any) => this.actividades = response,
          (error: string) => (console.log('Ups! we have an error: ', error))
      );
    }
  }
  setForm(): void {
    this.createTaskA= this.fb.group({
      usuario: getLocalStorage('userIbartiKanban'),
      actividad: ["", Validators.required],
      codigo: ["", Validators.required],
      editada:["1"],    
    });
  }
  handleEditTask(task: TaskSchema) {
    
    const dialogRef = this.dialog.open(CreateexcelComponent, {
      data: {task: this.task, listId: this.list?.codigo, users: this.users},
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(`Dialog result: ${result}`);
    });
  }
  
}
