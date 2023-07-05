import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-import-loading',
  templateUrl: './import-loading.component.html',
  styleUrls: ['./import-loading.component.css'],
})
export class ImportLoadingComponent implements OnInit {
  constructor() {}

  @ViewChild('myModal')
  modalElement!: ElementRef;

  ngOnInit(): void {
    // const modal = new this.modalElement.nativeElement();
    // modal.show();
    // Open the modal using data-toggle and data-target attributes
    const modalElement = this.modalElement.nativeElement;
    modalElement.setAttribute('data-toggle', 'modal');
    modalElement.setAttribute('data-target', '#myModal');

    // Trigger the modal manually
    // $(modalElement).modal('show');
  }
}
