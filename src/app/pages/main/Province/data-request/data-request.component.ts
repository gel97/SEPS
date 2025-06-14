import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { DataRequestService } from 'src/app/shared/Province/DataRequest.Service';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { isEmptyObject } from 'jquery';
import { ModifyCityMunService } from 'src/app/services/modify-city-mun.service';
import { response } from 'express';

@Component({
  selector: 'app-data-request',
  templateUrl: './data-request.component.html',
  styleUrls: ['./data-request.component.css'],
})
export class DataRequestComponent implements OnInit {
  constructor(
    private auth: AuthService,
    private Service: DataRequestService,
    private modifyService: ModifyCityMunService
  ) {
    this.o_munCityId = this.auth.o_munCityId;
  }

  DataRequestId: any;
  o_munCityId: any = this.auth.o_munCityId;
  munCityName: string = this.auth.munCityName;

  listMunCity: any[] = [];
  listData: any[] = [];
  listrequest: any[] = [];
  list_sep_year: any[] = [];
  list_templates: any[] = [];

  selectedMunCityId: any = null;
  selectedMunCityName: string = '';
  selectedRequests: any[] = [];

  set_year: any = this.auth.setYear;
  selectedTemplate: any = { name: '', details: '' };
  templateSearchText: string = '';

  ngOnInit(): void {
    this.loadMunicipalities();
    this.loadSepYears();
    this.loadTemplates();
    this.loadRequests(); // <- Must provide DataRequestId if needed
  }

  loadMunicipalities() {
    this.Service.ListOfMunicipality().subscribe({
      next: (response) => (this.listData = response || []),
      error: (err) => console.error('Error loading municipalities', err),
    });
  }

  loadSepYears() {
    this.Service.GetSepYears().subscribe({
      next: (res) => {
        this.list_sep_year = res || [];
        if (this.list_sep_year.length > 0) {
          this.set_year = this.list_sep_year[0].setYear;
        }
      },
      error: (err) => console.error('Error loading SEP years', err),
    });
  }

  loadTemplates() {
    this.Service.GetAllTemplates().subscribe({
      next: (res) => (this.list_templates = res || []),
      error: (err) => console.error('Error loading templates', err),
    });
  }

  loadRequests() {
    if (!this.DataRequestId) return;
    this.Service.GetListRequest(this.DataRequestId).subscribe({
      next: (res) => (this.listrequest = res || []),
      error: (err) => console.error('Error loading requests', err),
    });
  }

  selectMunicipality(item: any) {
    this.selectedMunCityId = item.munCityId;
    this.selectedMunCityName = item.munCityName;
  }

  selectedTemplateName: string = '';
  selectedTemplateId: string = '';

  selectTemplate(template: any) {
    this.selectedTemplateName = template.name;
    this.templateSearchText = template.name; // Auto-fills the input with the template name
    console.log('Selected template:', template);
    console.log('templateSearchText:', this.templateSearchText);
  }

  get filteredRequests() {
    return this.listrequest.filter(
      (req) =>
        req.munCityId === this.selectedMunCityId &&
        (!this.templateSearchText ||
          req.template?.templateName
            ?.toLowerCase()
            .includes(this.templateSearchText.toLowerCase()))
    );
  }

  get filteredTemplatesGroupedByCoreElement() {
    const grouped: { [key: string]: any[] } = {};
    const search = this.templateSearchText.toLowerCase();

    console.log('Filtering templates using search text:', search);

    for (const template of this.list_templates) {
      const nameMatch = template.name?.toLowerCase().includes(search);
      const coreMatch = template.coreElementName
        ?.toLowerCase()
        .includes(search);

      if (nameMatch || coreMatch) {
        const key = template.coreElementName || 'Others';
        if (!grouped[key]) {
          grouped[key] = [];
        }
        grouped[key].push(template);
      }
    }

    console.log('Grouped templates:', grouped);

    return grouped;
  }
}
