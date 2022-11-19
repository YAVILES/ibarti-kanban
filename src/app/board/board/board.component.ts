import { Component, OnInit } from '@angular/core';
import { IbartiService, ListSchema, TaskSchema, Users } from './../../core';
import { TaskService } from 'src/app/core/services/task.service';
import { CdkConnectedOverlay, ConnectedPosition } from '@angular/cdk/overlay';

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
  readonly overlayOptions: Partial<CdkConnectedOverlay> = {
    hasBackdrop: true,
    positions: [
      { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'top' },
    ],
  };
  listId!: string;

  constructor(private ibartiService: IbartiService, private taskService: TaskService) {
    this.task = initialValue;
    this.lists = [];
  }

  ngOnInit(): void {
    this.getDatausuarios();
    this.getDataStored();
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
    // console.log(event);
    this.isOverlayDisplayed = true;
    if (!!event) {
      this.task = {
        fec_us_ing: event.fec_us_ing,
        fec_vencimiento:event.fec_vencimiento,
        codigo: event.codigo,
        novedad: event.novedad,
        cod_usuario: event.cod_usuario,
        cod_nov_status_kanban: event.cod_nov_status_kanban,
      };
      if(event.listId){
        this.listId = event.listId;
      }
      
    } else {
      this.task = initialValue;
    }
  }

  hideOverlay(): void {
    this.isOverlayDisplayed = false;
  }
}
