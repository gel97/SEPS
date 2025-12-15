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
  isEditmode: boolean = false;

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

  selectedFile: File | null = null;

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0] || null;
  }

  saveTemplate(): void {
  this.newTemplate.coreElemId = Number(this.newTemplate.coreElemId);
  this.newTemplate.tag = 1;

  const formData = new FormData();
  formData.append('Name', this.newTemplate.name);
  formData.append('CoreElemId', this.newTemplate.coreElemId.toString());
  formData.append('ParentId', this.newTemplate.parentId ?? 0);
  formData.append('Sequence', this.newTemplate.sequence ?? 0);
  formData.append('IsActive', this.newTemplate.isActive ? 'true' : 'false');

  // REQUIRED BY BACKEND
  formData.append('Link', this.newTemplate.link ?? '');

  // REQUIRED BY BACKEND
  if (this.selectedFile) {
    formData.append('ExcelFile', this.selectedFile, this.selectedFile.name);
  }

  this.Service.saveTemplate(formData).subscribe({
    next: (response) => {
      console.log("Saved:", response);
      Swal.fire({ icon: 'success', title: 'Saved!' });
      const closeBtn = document.getElementById("closeModal");
      if (closeBtn) closeBtn.click();
      this.loadCoreElementsAndTemplates();
    },
    error: (err) => {
      console.error(err);
      Swal.fire({ icon: 'error', title: 'Error saving template!' });
    }
  });
}


  editTemplate(template: any): void {
    this.isEditmode = true;
    this.newTemplate = { ...template }; // clone to avoid mutating original

    // Show the modal manually using Bootstrap's JS
    setTimeout(() => {
      ($('#ModalAdd') as any).modal('show');
    }, 0);
  }
  resetForm(): void {
    this.newTemplate = {
      coreElemId: null,
      name: '',
      link: '',
      sequence: null,
      tag: 1,
      isActive: false,
      several: false,
    };
    this.isEditmode = false;
  }

  updateTemplate(): void {
    this.newTemplate.coreElemId = Number(this.newTemplate.coreElemId);
    this.newTemplate.tag = 1;

    this.Service.updateTemplate(this.newTemplate).subscribe({
      next: (response) => {
        console.log('Template updated successfully:', response);
        this.loadCoreElementsAndTemplates(); // Refresh list

        this.newTemplate = {
          coreElemId: null,
          name: '',
          link: '',
          sequence: null,
          tag: 1,
          isActive: false,
          several: false,
        };
        this.isEditmode = false;

        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'Template has been updated.',
          confirmButtonColor: '#3085d6',
          timer: 1500,
          showConfirmButton: false,
        });

        // Close modal
        const closeBtn: HTMLElement | null =
          document.getElementById('closeModal');
        if (closeBtn) closeBtn.click();
      },
      error: (err) => {
        console.error('Error updating template:', err);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong while updating!',
          confirmButtonColor: '#d33',
        });
      },
    });
  }

  deleteTemplate(templateId: number) {
    if (!templateId) {
      console.error('templateId is undefined!');
      return;
    }

    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this template?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        console.log('Deleting template with ID:', templateId);

        this.Service.deleteTemplate(templateId).subscribe({
          next: (response) => {
            this.loadCoreElementsAndTemplates();
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'Template has been deleted.',
              confirmButtonColor: '#3085d6',
              timer: 1500,
              showConfirmButton: false,
            });
          },
          error: (err) => {
            console.error('Error deleting template:', err);
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Something went wrong while deleting!',
              confirmButtonColor: '#d33',
            });
          },
        });
      }
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
