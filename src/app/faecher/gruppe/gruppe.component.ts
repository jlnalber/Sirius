import { MatDialog } from '@angular/material/dialog';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MappenManagerService } from '../global/services/mappen-manager.service';
import { AcceptDialogComponent } from '../accept-dialog/accept-dialog.component';
import {Gruppe} from '../global/interfaces/fach';
import { DialogData, MappenDialogComponent } from '../mappen.component';

@Component({
  selector: 'faecher-gruppe',
  templateUrl: './gruppe.component.html',
  styleUrls: ['./gruppe.component.scss']
})
export class GruppeComponent implements OnInit {

  @Input()
  gruppe?: Gruppe;

  constructor(private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly faecherService: MappenManagerService,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: any) => {
      this.gruppe = this.faecherService.getGruppeById(params.gruppeid);
      if (this.gruppe == undefined) {
        this.router.navigateByUrl('/mappen')
      }
    });
  }

  onDeleteClick(): void {
    // open the dialog to delete
    const dialogRef = this.dialog.open(AcceptDialogComponent, {
      data: {
        header: `Gruppe '${(this.gruppe as Gruppe).name}' wirklich löschen?`,
        description: `Durch das Bestätigen dieses Dialogs wird die Gruppe '${(this.gruppe as Gruppe).name}' unwiderruflich gelöscht.`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined && result != "" && this.gruppe) {
        this.faecherService.removeGruppe(this.gruppe)
        this.router.navigateByUrl('/mappen');
      }
    })
  }

  onEditClick(): void {
    // open the dialog to edit
    if (this.gruppe) {
      const dialogRef = this.dialog.open(MappenDialogComponent, {
        width: '500px',
        data: {
          name: this.gruppe.name,
          description: this.gruppe.description,
          edit: true
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result != undefined && result != "" && this.gruppe) {
          let res = result as DialogData;
          this.gruppe.name = res.name;
          this.gruppe.description = res.description;
        }
      });
    }
  }

}
