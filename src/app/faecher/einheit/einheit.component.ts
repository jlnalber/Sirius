import { MatDialog } from '@angular/material/dialog';
import { FaecherManagerService } from 'src/app/faecher/global/services/faecher-manager.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';
import { Einheit } from '../global/interfaces/fach';

@Component({
  selector: 'app-einheit',
  templateUrl: './einheit.component.html',
  styleUrls: ['./einheit.component.scss']
})
export class EinheitComponent implements OnInit {

  @Input()
  einheit: Einheit | undefined;

  constructor(private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly faecherService: FaecherManagerService,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: any) => {
      let fach = this.faecherService.getEinheitById(params.fachid, params.einheitid);
      console.log(this.faecherService);
      if (fach == undefined) {
        console.log('möp')
        this.router.navigateByUrl('/faecher');
      }
    })
  }

}
