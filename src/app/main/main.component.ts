import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { MainService } from './main.service';
import { Subscription } from 'rxjs';
import { HeaderComponent } from '../header/header.component';
import { DataService } from '../shared/loading-spinner/save-data/data.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {

  todoList: any = [];
  doneList: any = [];
  startedEditing: boolean = false;
  index!: number;

  private checkForChanges!: Subscription;
  private checkForIndex!: Subscription;

  todoValueControl = new FormControl('', [Validators.required]);

  todoForm = new FormGroup({
    'todo': this.todoValueControl
  });

  constructor(private mainService: MainService, private dataService: DataService){}

  ngOnInit(){
    if(this.dataService.hasValue){
      this.dataService.fetchList().subscribe(data => {
        this.mainService.setTodoList(data);
        this.todoList = this.mainService.getTodoList();
      });
    }
    this.checkForChanges = this.mainService.todoCanged.subscribe(todo => {
      this.todoList = todo;
    })
    this.checkForIndex = this.mainService.editing.subscribe(i => {
      this.index = i;
    })

  }

  onSubmit(){
    if(this.todoForm.valid){
      let todoValue = this.todoForm.value.todo as string;

      if(todoValue && !this.startedEditing){
        this.mainService.addValue(todoValue);
        
        this.todoForm.reset();
        this.todoValueControl.clearValidators();
        this.todoValueControl.updateValueAndValidity(); 
      }else if(this.startedEditing){
        this.mainService.editValue(this.index, todoValue);
        this.startedEditing = false;
      }
    } 
  }

  remove(index: number){
    this.mainService.removeValue(index);
  }

  edit(index: number){
    this.mainService.editing.next(index);
    this.startedEditing = true;
    this.todoForm.get('todo')?.setValue(this.mainService.todo[index]);
    
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }
}
