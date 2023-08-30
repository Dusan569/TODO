import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, catchError, tap } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";
import { MainService } from "src/app/main/main.service";

@Injectable({providedIn: 'root'})
export class DataService{
    todoChanged = new BehaviorSubject<any[]>([]);

    constructor(private http: HttpClient, private mainService: MainService, private authService:AuthService){}

    saveList(){
        const userId = this.authService.currentUserId;
        const todoData = this.mainService.getTodoList();
        const doneData = this.mainService.getDoneList();    

        const data = {
            todo: todoData,
            done: doneData
          };

        const url = `https://todo-35ca2-default-rtdb.firebaseio.com/${userId}/todo.json`;

        this.http.put(url, data).subscribe(response => {
            console.log(response);
        });
    }

    fetchList() {
        const userId = this.authService.currentUserId;  // Get the user ID
        const url = `https://todo-35ca2-default-rtdb.firebaseio.com/${userId}/todo.json`;  // Update the URL
        
        return this.http.get<{ todo: string[], done: string[] }>(url).pipe(
            tap(lists => {
                if (lists) {
                    this.mainService.setTodoList(lists.todo);
                    this.mainService.setDoneList(lists.done);
                }
            }), 
            catchError(error => {
                console.error("Error", error);
                return [];
            })
        );
    }
    
}