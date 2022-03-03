import { Component, Inject, Input, OnInit } from '@angular/core';
import { Task } from 'src/app/faecher/global/interfaces/fach';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'faecher-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {
  
  @Input()
  tasks: Task[] | undefined = [];
  
  @Input()
  isAbleToAddTasks: boolean = true;

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {

  }

  public addTask(description: string, closed: boolean): void {
    this.tasks?.push({
      description: description,
      closed: closed
    })
  }

  public removeTask(task: Task): boolean {
    const index: number = this.tasks?.indexOf(task, 0) as number;
    if (index > -1) {
      this.tasks?.splice(index, 1);
      return true;
    }
    return false;
  }
  
  public openDialog(): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '270px',
      data: { description: '' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined && result != "") {
        this.addTask(result, false);
      }
    });
  }

}

export interface DialogData {
  description: string;
}

@Component({
  selector: 'faecher-task-dialog',
  styleUrls: ['tasks-dialog.scss'],
  templateUrl: 'tasks-dialog.html',
})
export class TaskDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<TaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}