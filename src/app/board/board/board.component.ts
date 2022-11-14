import { Component, OnInit } from '@angular/core';
import { IbartiService, ListSchema, TaskSchema } from './../../core';
import { TaskService } from 'src/app/core/services/task.service';
import { CdkConnectedOverlay, ConnectedPosition } from '@angular/cdk/overlay';

interface PartialCdkConnectedOverlay {
  hasBackdrop: boolean,
  positions: ConnectedPosition[]
}

const initialValue = {
  codigo: '',
  novedad: '',
  fec_us_ing: '',
};
@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  lists: ListSchema[];
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
    this.getDataStored();
    
  }

  getDataStored(): void {
    this.taskService.getBoardList$
      .subscribe(
        (response: any) => this.lists = response,
        (error: string) => (console.log('Ups! we have an error: ', error))
        
    );
    
  }

  displayOverlay(event?: TaskSchema): void {
    this.isOverlayDisplayed = true;
    if (!!event) {
      this.task = {
        fec_us_ing: event.fec_us_ing,
        codigo: event.codigo,
        novedad: event.novedad,
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
