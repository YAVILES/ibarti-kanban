import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { ListSchema, TaskSchema, Histori,tiponovedad} from './../../../core';
import { CreateexcelComponent } from 'src/app/board/components/createexcel/createexcel.component';
import { FormBuilder, FormGroup,Validators} from '@angular/forms';
import { listaactividades} from './../../../core/models/listaactividades';
import { MatDialog } from '@angular/material/dialog';
import { TaskService } from 'src/app/core/services/task.service';
import { IbartiService } from 'src/app/core/services/ibarti.service';
import { environment as env } from '../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
interface Food {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit {
  @Input() task!: TaskSchema;
  @Input() tiponov!:tiponovedad;
  @Output() editTask: EventEmitter<TaskSchema> = new EventEmitter();
  selectedactividad: string | undefined = "";
  selectedValue?: string = "";
  createTaskA!: FormGroup;
  actividades:listaactividades[]= [];
  foods: tiponovedad[] = [];
  @Input() list?: ListSchema;
  @Input() users: Histori[] = [];
  public disabledSelectType: boolean = false;
  

  constructor(public dialog: MatDialog, public tasksService: TaskService,private ibartiService: IbartiService, private fb:FormBuilder,public toastr:ToastrService) {}

  
  ngOnInit(): void {
    this.getDataactividades();
    this.gettiponovedades();
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
  gettiponovedades(): void {
    if(this.foods){
       this.ibartiService.gettipos()
         .subscribe(
           (response: any) => {
            this.foods = response;
            if(this.foods.length > 0){
              this.selectedValue = this.foods[0]["codigo"];
              this.changeType();
            }
          },
           (error: string) => (console.log('Ups! we have an error: ', error))
       );
     }
     
   }
  setForm(): void {
    this.createTaskA= this.fb.group({
      usuario: `${env.USER_DEFAULT}`,
      actividad: ["", Validators.required],
      codigo: ["", Validators.required],
      editada:["1"],    
    });
  }
  handleEditTask(task: TaskSchema) {
    
    const dialogRef = this.dialog.open(CreateexcelComponent, {
      data: {task: this.task, listId: this.list?.codigo, users: this.users,tipoN:this.selectedValue},
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(`Dialog result: ${result}`);
    });
   
  }
  
  async changeType(){
    this.disabledSelectType = true;
    await this.tasksService.updateTypeNew(this.selectedValue);
    this.disabledSelectType = false;
  }
}
