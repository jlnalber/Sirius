import { MatDialog } from '@angular/material/dialog';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FaecherManagerService } from 'src/app/faecher/global/services/faecher-manager.service';
import { AcceptDialogComponent } from '../accept-dialog/accept-dialog.component';
import { Fach } from '../global/interfaces/fach';
import { DialogData, FaecherDialogComponent } from '../faecher.component';

@Component({
  selector: 'faecher-fach',
  templateUrl: './fach.component.html',
  styleUrls: ['./fach.component.scss']
})
export class FachComponent implements OnInit {

  @Input()
  fach?: Fach;

  constructor(private readonly router: Router, 
    private readonly activatedRoute: ActivatedRoute, 
    private readonly faecherService: FaecherManagerService,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: any) => {
      this.fach = this.faecherService.getFachById(params.fachid);
      if (this.fach == undefined) {
        this.router.navigateByUrl('/faecher')
      }
    });
  }

  onDeleteClick(): void {
    // open the dialog to delete
    const dialogRef = this.dialog.open(AcceptDialogComponent, {
      data: {
        header: `Fach '${(this.fach as Fach).name}' wirklich löschen?`,
        description: `Durch das Bestätigen dieses Dialogs wird das Fach '${(this.fach as Fach).name}' unwiderruflich gelöscht.`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined && result != "" && this.fach) {
        this.faecherService.removeFach(this.fach)
        this.router.navigateByUrl('faecher');
      }
    })
  }

  onEditClick(): void {
    // open the dialog to edit
    if (this.fach) {
      const dialogRef = this.dialog.open(FaecherDialogComponent, {
        width: '500px',
        data: { 
          name: this.fach.name,
          description: this.fach.description,
          edit: true
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result != undefined && result != "" && this.fach) {
          let res = result as DialogData;
          this.fach.name = res.name;
          this.fach.description = res.description;
        }
      });
    }
  }

}
