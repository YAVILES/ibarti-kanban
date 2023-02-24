import { Component, EventEmitter, Inject, Input, NgZone, OnInit, Output, ViewChild } from '@angular/core';
import { TaskSchema } from 'src/app/core/';
import { Actividades } from 'src/app/core/models/activity';
import { IbartiService } from 'src/app/core/services/ibarti.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

type DropdownObject = {
  codigo: string;
  cedula?: string;
  nombre? :string;
  apellido?:string;
  login? :string;
  cod_perfil?: string;
  perfil?:string;
  email? : string;
  admin_kanban? :string;
};

@Component({
  selector: 'app-edit-activity-task',
  templateUrl: './edit-activity-task.component.html',
  styleUrls: ['./edit-activity-task.component.scss']
})
export class EditActivityTaskComponent implements OnInit {
  panelOpenState = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {task: TaskSchema, listId: string, historial: Actividades[]},
    private ibartiService: IbartiService
  ) { }

  ngOnInit(): void {
    this.getDataactividades();
  }
  
  getDataactividades(): void {
    this.ibartiService.getTasksEditActivity(this.data.task)
      .subscribe(
        (response: any) => this.data.historial = response,
        (error: string) => (console.log('Ups! we have an error: ', error))
    );
  }
}
