import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.css'],
})
export class ImportComponent implements OnInit {

  munCityId:any;
  constructor(private auth:AuthService) {}

  ngOnInit(): void {
    this.munCityId = this.auth.munCityId;
    console.log("ImportComponent" ,this.munCityId )
  }

  @Output() testEvent = new EventEmitter();
  @Output() importData = new EventEmitter();
  @Output() myEvent = new EventEmitter();

  @Input() data: string | any;

  stringImport: string = '';
  import(stringData: string) {
    this.stringImport = stringData;
  }

  childMethod() {
    this.testEvent.emit();
  }

  importMethod() {
    this.importData.emit();
  }
  
  ImportTemplate() {
    this.myEvent.emit();
    }
 
}
