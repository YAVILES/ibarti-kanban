import { Injectable } from '@angular/core';
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
  public listauasuario: Users[]=[];
  constructor(private ibartiService: IbartiService) {
    this.loadInitialData();
    this.loadInitialDataUsuario();
  }

  /* Load initial data to render in a component */
  loadInitialData(): any {
    return this.ibartiService.getStatus().subscribe((status: any[]) => {
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
    });
  }
  loadInitialDataUsuario(): any {
    return this.ibartiService.getUsuarios().subscribe((data: any[]) => {
      if (!!data) {
        this.listauasuario= data;
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
      const task = this.list[elementsIndex].tasks.map((element) => {
        if (element.codigo === data.codigo) {
          element.cod_nov_status_kanban = listId
        }
        return element;
      });
    }
    this.loadInitialData();
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
