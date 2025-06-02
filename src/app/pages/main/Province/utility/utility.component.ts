import { Component, OnInit, ViewChild } from '@angular/core';
import { TemplateService } from 'src/app/shared/Province/Template.Service';
import { AuthService } from 'src/app/services/auth.service';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { ModifyCityMunService } from 'src/app/services/modify-city-mun.service';
import { ImportComponent } from 'src/app/components/import/import.component';
import { PdfComponent } from 'src/app/components/pdf/pdf.component';
import { PdfService } from 'src/app/services/pdf.service';
import { ReportsService } from 'src/app/shared/Tools/reports.service';
import { request, response } from 'express';
import { isEmptyObject } from 'jquery';

@Component({
  selector: 'app-utility',
  templateUrl: './utility.component.html',
  styleUrls: ['./utility.component.css'],
})
export class UtilityComponent implements OnInit {
  constructor(
    private auth: AuthService,
    private Service: TemplateService,
    private modifyService: ModifyCityMunService
  ) {}
  modifyCityMun(cityMunName: string) {
    return this.modifyService.ModifyText(cityMunName);
  }
  munCityName: string = this.auth.munCityName;
  coreElements: any = [];

  ngOnInit(): void {
    this.CoreElements();
  }
  Init() {
    this.CoreElements();
  }
  CoreElements() {
    this.Service.CoreElements().subscribe((response) => {
      console.log('CoreElements Response:', response);
      // Filter out entries where createdAt is null
      this.coreElements = (<any>response).filter(
        (item: any) => item.createdAt !== null
      );
      console.log('Filter List Core Elements:', this.coreElements);
    });
  }
}
