import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { PdfService } from 'src/app/services/pdf.service';

@Component({
  selector: 'app-pdf',
  templateUrl: './pdf.component.html',
  styleUrls: ['./pdf.component.css']
})
export class PdfComponent implements OnInit {

  ngOnInit(): void {
  }

  constructor(private pdfService: PdfService) {}

  generatePdf() {
    this.pdfService.generatePdf();
  }

}
