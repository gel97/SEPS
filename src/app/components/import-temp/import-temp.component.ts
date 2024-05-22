import { Component, OnInit, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
// import { ManEstabService } from 'src/app/shared/Trade&_Industry/man-estab.service';
import { SepDataService } from 'src/app/shared/Tools/sep-data.service';

@Component({
  selector: 'app-import-temp',
  templateUrl: './import-temp.component.html',
  styleUrls: ['./import-temp.component.css']
})
export class ImportTempComponent implements OnInit {
  @Output() excelFile = new EventEmitter<any>();
  @Output() myEvent   = new EventEmitter<any>();

  file:any = null;
  constructor() { }

  ngOnInit(): void {
  }
  ImportTemplate(){
    this.myEvent.emit(this.file);
  }
  fileChangeEvent(event: any): void {
    this.file = event;
  }
}
