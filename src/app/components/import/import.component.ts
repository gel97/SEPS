import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.css'],
})
export class ImportComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  @Output() testEvent = new EventEmitter();
  @Output() importData = new EventEmitter();

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
}
