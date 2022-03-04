import { AcceptDialogComponent } from './../accept-dialog/accept-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { FaecherManagerService } from 'src/app/faecher/global/services/faecher-manager.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';
import { Einheit, Fach } from '../global/interfaces/fach';

@Component({
  selector: 'app-einheit',
  templateUrl: './einheit.component.html',
  styleUrls: ['./einheit.component.scss']
})
export class EinheitComponent implements OnInit {

  @Input()
  einheit: Einheit | any;

  fach: Fach | any;

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
    const dialogRef = this.dialog.open(AcceptDialogComponent, {
      data: {
        header: `Einheit '${(this.einheit as Einheit).topic}' wirklich löschen?`,
        description: `Durch das Bestätigen dieses Dialogs wird die Einheit '${(this.einheit as Einheit).topic}' des Fach '${(this.fach as Fach).name}' unwiderruflich gelöscht.`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined && result != "" && this.fach && this.einheit) {
        this.faecherService.removeEinheit(this.fach, this.einheit)
        this.router.navigateByUrl('faecher/' + this.fach.id);
      }
    })
  }

}
