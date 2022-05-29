import { AcceptDialogComponent } from './../accept-dialog/accept-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { FaecherManagerService } from 'src/app/faecher/global/services/faecher-manager.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';
import { Einheit, Fach } from '../global/interfaces/fach';
import { DialogData, EinheitenDialogComponent } from '../einheiten/einheiten.component';

@Component({
  selector: 'app-einheit',
  templateUrl: './einheit.component.html',
  styleUrls: ['./einheit.component.scss']
})
export class EinheitComponent implements OnInit {

  @Input()
  einheit?: Einheit;

  fach?: Fach;

  constructor(private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly faecherService: FaecherManagerService,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: any) => {
      this.fach = this.faecherService.getFachById(params.fachid);
      this.einheit = this.faecherService.getEinheitById(params.fachid, params.einheitid);
      if (this.einheit == undefined || this.fach == undefined) {
        this.router.navigateByUrl('/faecher/' + params.fachid);
      }
    })
  }

  onDeleteClick(): void {
    // open the dialog to delete
    const dialogRef = this.dialog.open(AcceptDialogComponent, {
      data: {
        header: `Einheit '${(this.einheit as Einheit).topic}' wirklich löschen?`,
        description: `Durch das Bestätigen dieses Dialogs wird die Einheit '${(this.einheit as Einheit).topic}' des Fachs '${(this.fach as Fach).name}' unwiderruflich gelöscht.`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined && result != "" && this.fach && this.einheit) {
        this.faecherService.removeEinheit(this.fach, this.einheit)
        this.router.navigateByUrl('faecher/' + this.fach.id);
      }
    })
  }

  onEditClick(): void {
    // open the dialog to edit
    if (this.einheit) {
      const dialogRef = this.dialog.open(EinheitenDialogComponent, {
        width: '500px',
        data: { 
          topic: this.einheit.topic,
          description: this.einheit.description,
          edit: true
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result != undefined && result != "" && this.einheit) {
          let res = result as DialogData;
          this.einheit.topic = res.topic;
          this.einheit.description = res.description;
        }
      });
    }
  }

}
