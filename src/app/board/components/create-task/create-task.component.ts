import { Component, Input, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskSchema, ListSchema } from 'src/app/core/';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { take } from 'rxjs/operators';
import { CdkConnectedOverlay } from '@angular/cdk/overlay';
import { TaskService } from 'src/app/core/services/task.service';
import { generateUniqueId } from 'src/app/shared/utils/';

type DropdownObject = {
  value: string;
  viewValue: string;
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

  users: DropdownObject[] = [
    { value: 'urgent', viewValue: 'Urgente' },
    { value: 'moderate', viewValue: 'Moderado' },
    { value: 'low', viewValue: 'Bajo' },
  ];

  constructor(
    private fb: FormBuilder,
    private _ngZone: NgZone,
    private tasksService: TaskService
  ) {}

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
  }

  setForm(): void {
    this.createTask = this.fb.group({
      cod_usuario: [this.task?.cod_usuario ? this.task.cod_usuario : "", Validators.required],
      novedad: [this.task?.novedad ? this.task.novedad : ""],
    });
  }

  onFormAdd(form: TaskSchema): void {
   if (this.createTask.valid && this.task && this.listId){
      const findUser = this.users.find(
        (element) => form.cod_usuario === element.value
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
}
