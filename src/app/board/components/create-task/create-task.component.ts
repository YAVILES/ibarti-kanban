import { Component, Input, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskSchema } from 'src/app/core/';
import { Users } from 'src/app/core/models/users';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { take } from 'rxjs/operators';
import { CdkConnectedOverlay } from '@angular/cdk/overlay';
import { IbartiService } from 'src/app/core/services/ibarti.service';
import { TaskService } from 'src/app/core/services/task.service';
import { generateUniqueId } from 'src/app/shared/utils/';


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
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.scss'],
})
export class CreateTaskComponent implements OnInit {
  @ViewChild('autosize') autosize!: CdkTextareaAutosize;
  @Input() connectedOverlay!: CdkConnectedOverlay;
  @Input() task?: TaskSchema;
  @Input() listId?: string;

  formText: string = "Editar";
  createTask!: FormGroup;
  selectedUser: string | undefined = "";
  users: Users[] = [ ];
  

  constructor(
    private fb: FormBuilder,
    private _ngZone: NgZone,
    private tasksService: TaskService,
    private ibartiService: IbartiService
  ) { }

  ngOnInit(): void {
   this.setForm();
    this.selectedUser = '';
    if (this.task && this.task.codigo &&  this.task.codigo.length > 0) {
      // this.setValuesOnForm(this.task);
      this.formText = 'Editar';
      this.selectedUser = this.task.cod_usuario;
      
    } else {
      this.formText = 'Crear';
    } 
    this.getDatausuarios();
  }

  setForm(): void {
    this.createTask = this.fb.group({
      cod_usuario: [this.task?.cod_usuario ? this.task.cod_usuario : "", Validators.required],
      novedad: [this.task?.novedad ? this.task.novedad : ""],
    });
  }
  getDatausuarios(): void {
    this.ibartiService.getUsuarios()
      .subscribe(
        (response: any) => this.users = response,
        (error: string) => (console.log('Ups! we have an error: ', error))
    );
   
  }
  onFormAdd(form: TaskSchema): void {
   if (this.createTask.valid && this.task && this.listId){
      const findUser = this.users.find(
        (element) => form.cod_usuario === element.codigo
      );
      form.codigo = this.task.codigo;
      form.cod_usuario = !findUser ? this.task.cod_usuario : form.cod_usuario;
      if (form.cod_usuario) {
        this.tasksService.updateTask(form, this.listId);
      }
      this.close();
    }
  }

  setValuesOnForm(form: TaskSchema): void {
    this.createTask.setValue({
      cod_usuario: form.cod_usuario
    });
  }

  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable
      .pipe(take(1))
      .subscribe(() => this.autosize.resizeToFitContent(true));
  }

  close(): void {
    this.connectedOverlay.overlayRef.detach();
  }
  save(): void {
    this.formText="aajaja";
    console.log(this.formText);
  }
}
