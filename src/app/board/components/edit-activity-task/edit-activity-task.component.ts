import { Component, EventEmitter, Inject, Input, NgZone, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskSchema } from 'src/app/core/';
import { Users } from 'src/app/core/models/users';
import { Actividades } from 'src/app/core/models/activity';

import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { take } from 'rxjs/operators';
import { CdkConnectedOverlay } from '@angular/cdk/overlay';
import { IbartiService } from 'src/app/core/services/ibarti.service';
import { TaskService } from 'src/app/core/services/task.service';
import { ToastrService } from 'ngx-toastr';
import { environment as env } from '../../../../environments/environment';
import { DatePipe } from '@angular/common';
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
