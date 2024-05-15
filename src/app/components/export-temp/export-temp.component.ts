import { Component, OnInit, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
// import { ManEstabService } from 'src/app/shared/Trade&_Industry/man-estab.service';
import { SepDataService } from 'src/app/shared/Tools/sep-data.service';

@Component({
  selector: 'app-export-temp',
  templateUrl: './export-temp.component.html',
  styleUrls: ['./export-temp.component.css']
})
export class ExportTempComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  @Output() myEvent = new EventEmitter();
  ExportTemplate() {
    this.myEvent.emit();
    }
}
