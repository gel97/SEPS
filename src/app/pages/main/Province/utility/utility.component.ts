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
  coreElements: any[] = [];
  templatesByCoreElement: { [key: string]: any[] } = {};
  newTemplate: any = {
    coreElemId: null, // Match updated backend model
    name: '',
    link: '',
    sequence: null,
    tag: 1,
    isActive: false,
  };

  ngOnInit(): void {
    this.CoreElements();
    this.loadCoreElementsAndTemplates();
    console.log('Component initialized');
  }
  loadCoreElementsAndTemplates(): void {
    this.Service.CoreElements().subscribe((coreElementsResponse) => {
      console.log('Raw Core Elements Response:', coreElementsResponse);

      this.coreElements = coreElementsResponse.filter(
        (item: any) => item.createdAt !== null
      );
      console.log('Filtered Core Elements:', this.coreElements);

      this.Service.getAllTemplates().subscribe((templatesResponse) => {
        console.log('Raw Templates Response:', templatesResponse);

        // Reset grouped templates
        this.templatesByCoreElement = {};

        templatesResponse.forEach((template: any) => {
          const coreElementName = template.coreElementName || 'Uncategorized';
          if (!this.templatesByCoreElement[coreElementName]) {
            this.templatesByCoreElement[coreElementName] = [];
          }
          this.templatesByCoreElement[coreElementName].push(template);
        });

        console.log(
          'Grouped Templates by Core Element:',
          this.templatesByCoreElement
        );
      });
    });
  }

  saveTemplate(): void {
    console.log('Saving Template:', this.newTemplate);
    this.newTemplate.coreElemId = Number(this.newTemplate.coreElemId);
    this.Service.saveTemplate(this.newTemplate).subscribe({
      next: (response) => {
        console.log('Template saved successfully:', response);

        // Reload core elements and templates after save
        this.loadCoreElementsAndTemplates();

        // Reset form
        this.newTemplate = {
          coreElemId: null,
          name: '',
          link: '',
          sequence: null,
          tag: 1,
          isActive: false,
        };

        Swal.fire({
          icon: 'success',
          title: 'Saved!',
          text: 'Template has been saved successfully.',
          confirmButtonColor: '#3085d6',
          timer: 1500,
          showConfirmButton: false,
        });

        const closeBtn: HTMLElement | null =
          document.getElementById('closeModal');
        if (closeBtn) closeBtn.click();
      },
      error: (err) => {
        console.error('Error saving template:', err);

        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong while saving!',
          confirmButtonColor: '#d33',
        });
      },
    });
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
