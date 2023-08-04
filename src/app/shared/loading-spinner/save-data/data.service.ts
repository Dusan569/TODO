import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, catchError, tap } from "rxjs";
import { MainService } from "src/app/main/main.service";

@Injectable({providedIn: 'root'})
export class DataService{
    todoChanged = new BehaviorSubject<any[]>([]);
    hasValue: boolean = false;

    constructor(private http: HttpClient, private mainService: MainService){}

    saveList(){
        const todoData = this.mainService.getTodoList();
        this.http.put('https://todo-35ca2-default-rtdb.firebaseio.com/todo.json',todoData).subscribe(response => {            
            console.log(response);
            this.hasValue = true; 
        })
    }

    fetchList(){
        return this.http.get<string[]>('https://todo-35ca2-default-rtdb.firebaseio.com/todo.json').pipe(tap(todoList => {
            this.mainService.setTodoList(todoList);
        }), catchError(error => {
            console.error("Error", error);
            return[];
        }))
            
    }
}