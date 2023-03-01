import { EventEmitter, Injectable, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { IbartiService, TaskSchema, ListSchema} from '../';
import { Users} from '../models/users' 

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  
  private readonly boardList = new BehaviorSubject<ListSchema[]>([]);
  readonly list$ = this.boardList.asObservable();
  readonly getBoardList$ = this.list$.pipe(map((list) => list));
  private readonly boardUsers = new BehaviorSubject<Users[]>([]);
  readonly users$ = this.boardUsers.asObservable();
  readonly getBoardUsers$ = this.users$.pipe(map((users) => users));
  @Output() change: EventEmitter<any> = new EventEmitter();
  public listauasuario: Users[]=[];
  
  constructor(private ibartiService: IbartiService, public toastr: ToastrService) {
    this.loadInitialData();
    this.loadInitialDataUsuario();
  }

  /* Load initial data to render in a component */
  loadInitialData(): any {
    return this.ibartiService.getStatus().subscribe((status: any) => {
      if(status.error){
        this.toastr.error(`${status.error}`);
      }else{
        if (!!status) {
          this.ibartiService.getTasks().subscribe((tasks: any[]) => {
            if (!!tasks) {
              for (let index = 0; index < status.length; index++) {
                status[index].tasks = tasks.filter(t => t.cod_nov_status_kanban == status[index].codigo);
              }
              this.boardList.next(status);
            }
          });
        }
      }
    });
  }

  loadInitialDataUsuario(): any {
    return this.ibartiService.getUsuarios().subscribe((data: any) => {
      if(data.error){
        this.toastr.error(`${data.error}`);
      }else{
        if (!!data) {
          this.listauasuario= data;
        }
      }
    });
   
  }
  /* getter list of Board */
  get list(): ListSchema[] {
    return this.boardList.getValue();
  }

  /* setter list of Board */
  set list(value: ListSchema[]) {
    this.boardList.next(value);
  }

  /* Edit card on list */
  updateTask(data: TaskSchema, listId: string): void {
    if (data) {
      const elementsIndex = this.list.findIndex(
        (element) => element.codigo === listId
      );
      let indexTask = this.list[elementsIndex]?.tasks.findIndex((t) => t.codigo == data.codigo);
      let task = {...this.list[elementsIndex].tasks[indexTask]};
      task.cod_nov_status_kanban = listId;
      task.cod_usuario = data.cod_usuario;
      let user = this.listauasuario.find(u => u.codigo == data.cod_usuario)
      if(user) task.usuario = `${user.nombre} ${user?.apellido}`;
      this.list[elementsIndex].tasks[indexTask] = task;
      this.change.emit();
    }
      // this.loadInitialData();
  }
  removeTask(dataId: string, list: ListSchema): void {
    const elementsIndex = this.list.findIndex(
      (element) => element.codigo== list.codigo
    );
    const tasks = this.list[elementsIndex].tasks.filter(
      (task) => task.codigo !== dataId
    );
    this.list[elementsIndex].tasks = tasks;
  }
}
