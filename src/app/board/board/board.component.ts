import { Component, OnInit } from '@angular/core';
import { IbartiService, ListSchema, TaskSchema, Users } from './../../core';
import { TaskService } from 'src/app/core/services/task.service';
import { CreateTaskComponent } from '../components/create-task/create-task.component';
import { MatDialog } from '@angular/material/dialog';

const initialValue = {
  codigo: '',
  novedad: '',
  fec_us_ing: '',
  fec_vencimiento: '',
  cod_usuario: '',
  cod_nov_status_kanban :'',
};

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  lists: ListSchema[];
  users: Users[] = [];
  task: TaskSchema;
  isOverlayDisplayed = false;
  listId!: string;

  constructor(private ibartiService: IbartiService, private taskService: TaskService, public dialog: MatDialog) {
    this.task = initialValue;
    this.lists = [];
  }

  ngOnInit(): void {
    this.getDatausuarios();
    this.getDataStored();
    this.taskService.change.subscribe(() =>this.getDataStored());
  }

  getDatausuarios(): void {
    this.ibartiService.getUsuarios()
      .subscribe(
        (response: any) => this.users = response,
        (error: string) => (console.log('Ups! we have an error: ', error))
    );
   
  }

  getDataStored(): void {
    this.taskService.getBoardList$
      .subscribe(
        (response: any) => this.lists = [...response],
        (error: string) => (console.log('Ups! we have an error: ', error))
        
    );
    
  }

  displayOverlay(event?: TaskSchema): void {
    if (!!event) {
      this.task = {
        fec_us_ing: event.fec_us_ing,
        fec_vencimiento:event.fec_vencimiento,
        codigo: event.codigo,
        novedad: event.novedad,
        cod_usuario: event.cod_usuario,
        cod_nov_status_kanban: event.cod_nov_status_kanban,
        fec_cierre:event.fec_cierre,
      };
      if(event.listId){
        this.listId = event.listId;
      }
      const dialogRef = this.dialog.open(CreateTaskComponent, {
        data: {task: this.task, listId: this.listId, users: this.users},
      });
      dialogRef.afterClosed().subscribe((result: any) => {
        console.log(`Dialog result: ${result}`);
      });
    } else {
      this.task = initialValue;
    }
  }

  hideOverlay(): void {
    this.isOverlayDisplayed = false;
  }
}
