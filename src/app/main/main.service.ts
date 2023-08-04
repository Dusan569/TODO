import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({providedIn: 'root'})
export class MainService {
    todoCanged = new Subject<string[]>();
    // doneCanged = new Subject<[]>()
    editing = new Subject<number>();

    todo: string[] = [];
    done = [];

    setTodoList(todoList: string[]) {
        this.todo = todoList;
        this.todoCanged.next(this.todo);
    }

    getTodoList(){
        return this.todo.slice();
    }

    // getDoneList(){
    //     return this.done.slice();
    // }

    addValue(value: string){
        this.todo.push(value);
        this.todoCanged.next(this.todo.slice());
    }

    removeValue(index: number){
        this.todo.splice(index, 1);
        this.todoCanged.next(this.todo.slice());
    }

    editValue(index: number, value: string){
        this.todo[index] = value;
        this.todoCanged.next(this.todo.slice());
    }
}