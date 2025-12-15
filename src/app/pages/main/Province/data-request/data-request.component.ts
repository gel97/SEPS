import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { DataRequestService } from 'src/app/shared/Province/DataRequest.Service';
import Swal from 'sweetalert2';
import { ModifyCityMunService } from 'src/app/services/modify-city-mun.service';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { NgForm } from '@angular/forms';

interface Request {
  dataRequestId: number;
  title: string;
  details: string;        // 📌 File name to show in the table
  downloadUrl?: string;   // 📌 Actual download link
  setYear: number;
  templates?: { name: string };
  munCityId: string;
  [key: string]: any;
}



interface Template {
  templateId: number;
  coreElemId: number;
  coreElementName: string;
  name: string;
  link: string;
  downloadUrl: string;
}

interface YearGroup {
  coreElement: any;
  setYear: number;
  requests: Request[];
}

@Component({
  selector: 'app-data-request',
  templateUrl: './data-request.component.html',
  styleUrls: ['./data-request.component.css'],
})
export class DataRequestComponent implements OnInit {
  group: any;
  coreElements: any[] = [];
  yearGroup: any;
  template: any;
  constructor(
    private auth: AuthService,
    private service: DataRequestService,
    private modifyService: ModifyCityMunService
  ) {
    this.o_munCityId = this.auth.o_munCityId;
  }

  @ViewChild('templateForm') templateForm!: NgForm;
  @ViewChild('closebutton') closebutton!: ElementRef;

  // ---------------------- STATE -----------------------
  o_munCityId = this.auth.o_munCityId;
  munCityName: string = this.auth.munCityName;

  listMunCity: any[] = [];
  listData: any[] = [];
  listRequests: Request[] = [];
  list_sep_year: YearGroup[] = [];
  list_templates: Template[] = [];

  selectedMunCityId: string | null = null;
  selectedMunCityName: string = '';
  selectedRequests: Request[] = [];

  set_year: number | null = this.auth.setYear;
  templateSearchText: string = '';
  filteredTemplatesByGroup: { [key: string]: Template[] } = {};

  private templateSearchSubject = new Subject<string>();

  // ✅ Default newRequest
  newRequest: Partial<Request> = {
    coreElemId: null,
    templateId: null,
    setYear: this.auth.setYear,
    title: '',
    details: '',
    munCityId: '',
    recievedBy: 0,
    tag: 0,
  };

  // ---------------------- INIT -----------------------
  ngOnInit(): void {
    this.loadMunicipalities();
    this.loadSepYears();
    this.loadTemplates();
    this.Init();

    this.templateSearchSubject
      .pipe(debounceTime(300))
      .subscribe((search) => this.filterTemplates(search.toLowerCase()));
  }
  Init() {
    this.CoreElements();
  }
  CoreElements() {
    this.service.CoreElements().subscribe((response) => {
      const allCoreElements = (response as any[]).filter(
        (item) => item.createdAt !== null
      );

      // Map coreElements into yearGroups
      this.list_sep_year = this.list_sep_year.map((yearGroup) => {
        return {
          ...yearGroup,
          coreElements: allCoreElements.filter((ce) =>
            yearGroup.requests.some((req) => req['coreElementId'] === ce.id)
          ),
        };
      });

      console.log('Filter List Core Elements:', this.coreElements);
    });
  }

  // ---------------------- LOADERS -----------------------
  private groupByYear(requests: Request[]): YearGroup[] {
    const groups = Object.values(
      requests.reduce((acc: any, req: Request) => {
        const year = req.setYear ?? 'Unknown';
        const coreElement = req['coreElements']?.name || 'Unknown';
        const key = `${year}_${coreElement}`;

        if (!acc[key]) {
          acc[key] = {
            setYear: year,
            coreElement: req['coreElements'],
            requests: [],
          };
        }

        acc[key].requests.push(req);
        return acc;
      }, {})
    ) as YearGroup[];

    // Sort by year (descending)
    return groups.sort((a, b) => b.setYear - a.setYear);
  }

  loadRequestsByMunicipality(munCityId: string): void {
    this.selectedMunCityId = munCityId;

   
    this.service.GetRequestsByMunicipality(munCityId).subscribe({
      next: (res: Request[]) => {
        const requests = res || [];

     
        this.service.GetAllTemplates().subscribe({
          next: (templates: Template[]) => {
            const templateMap = new Map(
              templates.map(t => [t.templateId, t])
            );

            // Enrich requests with template data
            this.selectedRequests = requests.map(req => {
              const template = templateMap.get(req['templateId']);

              return {
                ...req,
                // If details is missing, use template’s URL
                details: req.details || template?.downloadUrl || '',
                templates: template ? { name: template.name } : req.templates,
                downloadUrl: template?.downloadUrl // optional convenience field
              };
            });

            // Group them into yearGroup
            this.list_sep_year = this.groupByYear(this.selectedRequests);

            console.log('Requests with downloadUrl:', this.selectedRequests);
          },
          error: (err) => console.error('Error loading templates', err),
        });
      },
      error: (err) => {
        console.error('Error loading requests:', err);
        this.selectedRequests = [];
        this.list_sep_year = [];
      },
    });
  }


  loadMunicipalities(): void {
    this.service.ListOfMunicipality().subscribe({
      next: (response) => (this.listData = response || []),
      error: (err) => console.error('Error loading municipalities', err),
    });
  }

  loadSepYears(): void {
    this.service.GetSepYears().subscribe({
      next: (res: any[]) => {
        this.list_sep_year = res || [];
        if (this.list_sep_year.length > 0) {
          this.set_year = this.list_sep_year[0].setYear;
        }
      },
      error: (err) => console.error('Error loading SEP years', err),
    });
  }

  loadTemplates(): void {
    this.service.GetAllTemplates().subscribe({
      next: (res: Template[]) => {
        console.log('Example template from API:', res[0]);
        this.list_templates = res || [];
        this.filterTemplates(this.templateSearchText.toLowerCase());
      },
      error: (err) => console.error('Error loading templates', err),
    });
  }

  // ---------------------- ACTIONS -----------------------
  selectMunicipality(item: any): void {
    this.selectedMunCityId = item.munCityId;
    this.selectedMunCityName = item.munCityName;
    this.newRequest.munCityId = item.munCityId;

    this.loadRequestsByMunicipality(item.munCityId);
  }

  selectTemplate(template: Template): void {
    this.templateSearchText = template.name;
    this.newRequest = {
      ...this.newRequest,
      templateId: template.templateId,
      coreElemId: template.coreElemId,
      coreElementName: template.coreElementName,
      setYear: this.auth.setYear,
      title: template.name,
      details: template.link,           // Human-readable name
      downloadUrl: template.downloadUrl, // Actual file URL
      userId: this.auth.userId,
    };

    console.log('Selected template:', this.newRequest);
  }




  saveDataRequest(): void {
    if (!this.newRequest['coreElemId'] || !this.newRequest['templateId']) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Data',
        text: 'Please select a Core Element and Template before saving.',
      });
      return;
    }

    if (!this.newRequest.munCityId) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Municipality',
        text: 'Please select a Municipality/City before saving.',
      });
      return;
    }

    const payload = {
      ...this.newRequest,
      dataRequestId: 0,
      setYear: this.auth.setYear,
      userId: this.auth.userId,
    };

    console.log('Sending payload to API:', payload);

    this.service.SaveRequest(payload).subscribe({
      next: (response) => {
        console.log('Saved successfully:', response);
        Swal.fire({
          icon: 'success',
          title: 'Saved!',
          text: 'Data request has been saved successfully.',
          timer: 1500,
          showConfirmButton: false,
        });

        this.templateForm.resetForm();
        this.newRequest = { setYear: this.auth.setYear, recievedBy: 0, tag: 0 };
        this.templateSearchText = '';

        this.closebutton.nativeElement.click();
      },
      error: (err) => {
        console.error('Error saving data request:', err);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong while saving!',
        });
      },
    });
  }

  // ---------------------- TEMPLATE SEARCH -----------------------
  onTemplateSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.templateSearchText = input?.value || '';
    this.templateSearchSubject.next(this.templateSearchText);
  }

  private filterTemplates(search: string): void {
    const grouped: { [key: string]: Template[] } = {};
    for (const template of this.list_templates) {
      const nameMatch = template.name?.toLowerCase().includes(search);
      const coreMatch = template.coreElementName
        ?.toLowerCase()
        .includes(search);

      if (nameMatch || coreMatch) {
        const key = template.coreElementName || 'Others';
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(template);
      }
    }
    this.filteredTemplatesByGroup = grouped;
  }
}
