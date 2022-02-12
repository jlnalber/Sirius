import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Fach } from 'src/app/interfaces/fach';
import { FaecherManagerService } from 'src/app/shared/faecher-manager.service';

@Component({
  selector: 'app-fach',
  templateUrl: './fach.component.html',
  styleUrls: ['./fach.component.scss']
})
export class FachComponent implements OnInit {

  @Input()
  fach: Fach | any;

  constructor(private readonly router: Router, private readonly activatedRoute: ActivatedRoute, private readonly faecherService: FaecherManagerService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: any) => {
      this.fach = this.faecherService.getFachById(params.id);
      if (this.fach == undefined) {
        this.router.navigateByUrl('/faecher')
      }
    });
  }

}
