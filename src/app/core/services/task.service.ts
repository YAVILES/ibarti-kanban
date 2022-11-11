import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { IbartiService, TaskSchema, ListSchema } from '../';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly boardList = new BehaviorSubject<ListSchema[]>([]);
  readonly list$ = this.boardList.asObservable();
  readonly getBoardList$ = this.list$.pipe(map((list) => list));

  constructor(private ibartiService: IbartiService) {
    this.loadInitialData();
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
          element.fec_us_ing = new Date(data.fec_us_ing);
        }
        return element;
      });
    }
  }
}
