import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { AuthService } from "../auth/auth.service";
import { DataService } from "../shared/loading-spinner/save-data/data.service";

@Injectable({providedIn: 'root'})
export class MainService {
    todoChanged = new Subject<string[]>();
    doneChanged = new Subject<string[]>();

    editing = new Subject<number>();

    todo: string[] = [];
    done: string[] = [];

    constructor(private authService: AuthService) {}

    //Todo list
    setTodoList(todoList: string[]) {
        const userId = this.authService.currentUserId;
        if (userId) {
            this.todo = todoList;
            this.todoChanged.next(this.todo);
        }
    }

    getTodoList() {
        const userId = this.authService.currentUserId;
        if (userId) {
            return this.todo ? this.todo.slice() : [];
        }
        return [];
    }

    //Done list
    setDoneList(doneList: string[]) {
        const userId = this.authService.currentUserId;
        if (userId) {
          this.done = doneList;
          this.doneChanged.next(this.done);
        }
    }

    getDoneList() {
        const userId = this.authService.currentUserId;
        if (userId) {
          return this.done ? this.done.slice() : [];
        }
        return [];
      }

    addValue(value: string){
        this.todo = this.todo || [];
        this.todo.push(value);
        this.todoChanged.next(this.todo.slice());
    }

    removeValue(index: number){
        this.todo.splice(index, 1);
        this.todoChanged.next(this.todo.slice());
    }

    editValue(index: number, value: string){
        this.todo[index] = value;
        this.todoChanged.next(this.todo.slice());
    }

    //clear data so the new user wont take the data from last user
    clearData() {
        this.todo = [];
        this.done = [];
        this.todoChanged.next([]);
        this.doneChanged.next([]);
      }
}