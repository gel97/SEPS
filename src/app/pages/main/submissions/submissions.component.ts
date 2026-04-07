import { Component, OnInit, ElementRef, ViewChild  } from '@angular/core';
import { SubmitService } from 'src/app/shared/Submissions/Submit.service';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { GmapComponent } from 'src/app/components/gmap/gmap.component';
import { PdfService } from 'src/app/services/pdf.service';
import { PdfComponent } from 'src/app/components/pdf/pdf.component';
import { ReportsService } from 'src/app/shared/Tools/reports.service';
import { ImportComponent } from 'src/app/components/import/import.component';
import { MajorEconomicService } from 'src/app/shared/Trade&_Industry/major-economic.service';
import { ManEstabService } from 'src/app/shared/Trade&_Industry/man-estab.service';
import { CommercialEstablishmentService } from 'src/app/shared/Trade&_Industry/commercial-establishment.service';
import { IndustrialEstatesService } from 'src/app/shared/Trade&_Industry/industrial-estates.service';
import { FinancialInstitutionsService } from 'src/app/shared/Trade&_Industry/financial-institutions.service';
import { TourismService } from 'src/app/shared/Socio-Economic/Tourism/tourism.service';
import { AgricultureService } from 'src/app/shared/Socio-Economic/Agriculture/agriculture.service';




@Component({
  selector: 'app-submissions',
  templateUrl: './submissions.component.html',
  styleUrls: ['./submissions.component.css']
})
export class SubmissionsComponent implements OnInit {

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  selectedFile: File | null = null;
  @ViewChild('moduleFileInput', { static: false })
moduleFileInput!: ElementRef;

  data = {
  name: '',
  setYear: new Date().getFullYear(),
  munCityId: ''  // ✅ default, update this from session/login
};
  munCityName: string = ''

  SubmitFiles: any[] = [];
  attributes: any[] = [];
  attributeKeys: string[] = [];
  archiveFiles: string[] = [];
  datasets: Record<string, string[]> = {};
  objectKeys = Object.keys;

  reuploadRecord: any = null;
  showArchiveModal = false;
  showDatasetsModal = false;
  showAttributesModal = false;
  selectedDatasetName: string = '';
  currentRecNo: number | null = null;
  municipalities: any[] = [];
  selectedMunicipality: string = '';
  mainFile: File | null = null;        // para sa CPDC submit
  moduleFile: File | null = null;      // para sa modal upload
  reuploadFile: File | null = null;    // para sa reupload
  selectedModule: string = '';
  f: any;
  MajorAct: any = [];
  activeUpload: number | null = null;
  ManEstab: any;
  ComEstab: any;
  Industrial: any;
  Financial: any;
  menuId = '1';
  dataList: any;
  setYear = this.auth.setYear;
  munCityId = this.auth.munCityId;
  

  //moduleFileInput: any;

  constructor(private SubmitService: SubmitService, 
              private auth: AuthService, 
              private reportService: ReportsService,  
              private majorEcoService: MajorEconomicService, // 🔥 para MajorEco
              private manEstabService: ManEstabService,
              private comestabService: CommercialEstablishmentService,
              private indstateService: IndustrialEstatesService,
              private finInsService:   FinancialInstitutionsService,
              private resortsService:  TourismService,
              private agriService: AgricultureService) { }

  ngOnInit(): void {
    this.data.munCityId = this.auth.munCityId;  
    this.munCityName = this.auth.munCityName;  

    if (this.data.munCityId === 'DDN') { 
    this.loadMunicipalities();
  }

  this.loadSubmit();
  }
  onMainFileSelected(event: any) {
  this.mainFile = event.target.files[0];
}
  loadMunicipalities() {
  this.SubmitService.ListMunCity().subscribe({
    next: (res: any) => {
      console.log("Municipalities response:", res);

      if (Array.isArray(res)) {
        this.municipalities = res;
      } else if (res?.data && Array.isArray(res.data)) {
        this.municipalities = res.data;
      } else {
        console.warn("Unexpected municipalities response format", res);
        this.municipalities = [];
      }

      // ✅ Trim names just in case
      this.municipalities = this.municipalities.map((m: any) => ({
        munCityId: m.munCityId,
        munCityName: (m.munCityName || '').trim()
      }));
    },
    error: (err) => console.error("Failed to load municipalities", err)
  });
}
loadSubmit() {
  const filterId = this.data.munCityId === 'DDN' 
    ? this.selectedMunicipality 
    : this.data.munCityId;

  this.SubmitService.getAllSubmit(filterId).subscribe({
    next: (files) => this.SubmitFiles = files,
    error: (err) => console.error('Failed to load shapefiles', err)
  });
}
  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    (event.currentTarget as HTMLElement).classList.add("drag-over");
  }
  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    (event.currentTarget as HTMLElement).classList.remove("drag-over");
  }
  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    (event.currentTarget as HTMLElement).classList.remove("drag-over");

    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      this.selectedFile = event.dataTransfer.files[0];
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(this.selectedFile);
      this.fileInput.nativeElement.files = dataTransfer.files;
    }
  }
   onFileSelected(event: any) {
  this.selectedFile = event.target.files[0];


  if (this.reuploadRecord && this.selectedFile) {
    this.processReupload();
  }
}
processReupload() {
  if (!this.selectedFile || !this.reuploadRecord) return;

  Swal.fire({
    title: 'Confirm Re-upload',
    text: `Are you sure you want to replace the file for ${this.reuploadRecord.fileName}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, replace it!',
    cancelButtonColor: '#d33'
  }).then((result) => {
    if (result.isConfirmed) {
   
      this.SubmitService.uploadSubmit(
        this.selectedFile!,
        this.reuploadRecord.setYear,
        this.reuploadRecord.munCityId
      ).subscribe({
        next: (res) => {
          Swal.fire("Success", "File replaced successfully!", "success");
          this.loadSubmit(); // Refresh table
          this.reuploadRecord = null; // Reset
          this.selectedFile = null;
        },
        error: (err) => {
          console.error("Re-upload error:", err);
          Swal.fire("Error", "Replacement failed.", "error");
        }
      });
    } else {
      this.reuploadRecord = null;
      this.selectedFile = null;
    }
  });
}
   onUpload() {
  if (!this.mainFile) {
    Swal.fire("Error", "Please select a file first.", "error");
    return;
  }

  this.SubmitService.uploadSubmit(
    this.mainFile,
    this.data.setYear,
    this.data.munCityId
  ).subscribe({
    next: (res) => {
      Swal.fire("Success", "File uploaded successfully!", "success");

      this.loadSubmit();
      this.mainFile = null;

      if (this.fileInput) {
        this.fileInput.nativeElement.value = '';
      }
    },
    error: (err) => {
      Swal.fire("Error", "Upload failed", "error");
    }
  });
}
  
   onReupload(file: any) {
  console.log("Re-uploading for:", file.recNo);
  this.reuploadRecord = file; 
  this.fileInput.nativeElement.click(); 
}
onCancel(recNo: number) {
  Swal.fire({
    title: "Are you sure?",
    text: "Do you want to cancel this Submissions? This action cannot be undone.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    confirmButtonText: "Yes, Cancel it!",
    cancelButtonText: "No, keep it"
  }).then((result) => {
    if (result.isConfirmed) {
      this.SubmitService.cancelSubmit(recNo).subscribe({
        next: (res) => {
          Swal.fire("Cancelled", "Your submission has been successfully cancelled.", "success");
          this.loadSubmit(); // Kani para mo-refresh ang table dayon
        },
        error: (err) => {
          Swal.fire("Error", "Unable to cancel. The report may have already been processed.", "error");
        }
      });
    }
  });
}
toggleUpload(recNo: number){
  if (this.activeUpload === recNo) {
    this.activeUpload = null;
  } else {
    this.activeUpload = recNo;
  }
}
uploadCategory(event: any, file: any) {
  const category = event.target.value;

  console.log("Uploading", file.fileName, "to", category);

  // call your API here
}
openModal(file: any) {
  this.selectedFile = file;
}
closeModal() {
  this.selectedFile = null;
}
uploadModule(module: string, id?: string) {

  if (module === 'Tourism' && !id) {
    this.showTourismOptions = !this.showTourismOptions; // Toggle ang menu
    return;
  }
if (id) {
    this.menuId = id;
    this.selectedModule = module; // e.g., "Resorts"
    this.showTourismOptions = false; // Itago ang menu human mapili
  } else {
    this.selectedModule = module; // e.g., "Economic Activity"
  }
  console.log('Selected Module:', module);
  console.log('File:', this.selectedFile);


  this.selectedModule = module;

  Swal.fire({
    title: 'Are you sure?',
    text: `You are about to import data to "${module}"`,
    icon: 'info',
    showCancelButton: true,
    confirmButtonText: 'Yes, submit it!',
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33'
  }).then((result) => {

    if (!result.isConfirmed) return;

    // ⏳ wait sa DOM (important)
    setTimeout(() => {

      if (!this.moduleFileInput) {
        Swal.fire('Error', 'File input not found.', 'error');
        return;
      }

      this.moduleFileInput.nativeElement.value = '';
      this.moduleFileInput.nativeElement.click();

    }, 100);

  });
}
onImportModule(e: any) {
  const file = e.target.files[0];
  if (!file) return;

  const moduleCode = this.mapModuleToCode(this.selectedModule);

  // --- LOGIC INTEGRATION START ---
  // I-check nato kung ang module kay Tourism o Agriculture
  // Kay kining duha naggamit og Sub-Menu ID
  const isSubMenuModule = moduleCode === 'Tourism' || moduleCode === 'Agriculture';

  const importObservable = isSubMenuModule 
    ? this.reportService.PostImportWithMenuId(
        file, 
        this.auth.setYear, 
        this.auth.munCityId, 
        moduleCode, 
        this.menuId // Dynamic ID (e.g., '1' para sa Resorts o '1' para sa Rice Production)
      )
    : this.reportService.Get_ExImport(
        file, 
        this.auth.setYear, 
        this.auth.munCityId, 
        moduleCode
      );
  // --- LOGIC INTEGRATION END ---

  // I-subscribe ang pinili nga observable
  importObservable.subscribe((success) => {
    Swal.fire({
      title: 'Importing Data',
      html: 'Please wait for a moment.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();

        setTimeout(() => {
          Swal.close();

          if (success) {
            Swal.fire({
              icon: 'success',
              title: 'File imported successfully'
            });

            // Refresh ang table depende sa moduleCode
            this.reloadModuleData(moduleCode);

          } else {
            Swal.fire({
              icon: 'error',
              title: 'Invalid file or import failed'
            });
          }
        }, 2000);
      }
    });
  }, (error) => {
    // Handle kung naay error sa server connection
    Swal.close();
    Swal.fire('Error', 'Something went wrong with the server connection.', 'error');
  });
}
reloadModuleData(code: string) {
  switch (code) {
    case 'MjrEcoAct':
      this.GetListMjrcoAct(); // 🔥 imong existing function
      break;
    case 'ManEstab':
      this.GetListManEstab();
      break;
    case 'ComEstab':
      this.GetListCommercialEstab();
      break;
    case 'IndEst':
      this.GetIndustrialEstates();
      break;
    case 'FinIns':
      this.GetListFinancial();
      break;
    // case 'Tourism':
    //       if (this.menuId === '1'){
    //         this.GetListTourism();
    //       }
    //   break;
    default:
      console.log('No reload handler for:', code);
  }
}
GetListMjrcoAct() {
  this.majorEcoService.GetMajorEco().subscribe((data) => {
    this.MajorAct = <any>data;
    this.MajorAct = this.MajorAct.filter((s: any) => s.tag == 1);
    console.log(this.MajorAct);
  });
}
GetListTourism() {
    this.resortsService.GetListTourism(
      this.menuId,
      this.setYear,
      this.munCityId
    ).subscribe((response) => {
      this.dataList = <any>response;
      console.log('check', response);
    });
  }
  GetListAgriculture() {
    this.agriService.GetListAgriculture(
      this.menuId,
      this.setYear,
      this.munCityId
    ).subscribe((response) => {
      this.dataList = <any>response;
      console.log('check', response);
    });
  }


  GetListManEstab() {
  this.manEstabService.GetManEstab().subscribe((data) => {
    this.ManEstab = <any>data;
   
  });
}
GetListCommercialEstab() {
    this.comestabService.Get_Com_Estab().subscribe((data) => {
      this.ComEstab = <any>data;
    });
  }
GetIndustrialEstates() {
    this.indstateService.GetIndustrial().subscribe((data) => {
      console.log(data);
      this.Industrial = <any>data;
    });
  }
  GetListFinancial() {
    this.finInsService.GetFinancial().subscribe((data) => {
      this.Financial = <any>data;
    });
  }


  mapModuleToCode(module: string): string {
  // 1. I-check kung ang module name naa ba sa imong tourismCategories array
  const isTourism = this.tourismCategories.some(cat => cat.name === module);
  
  if (isTourism || module === 'Tourism') {
    return 'Tourism';
  }

  const isAgriculture = this.agricultureCategories.some(cat => cat.name === module);

  if (isAgriculture || module === 'Agriculture'){
    return 'Agriculture';
  }

  // 2. Para sa ubang modules
  const map: any = {
    'Economic Activity': 'MjrEcoAct',
    'Manufacturing Establishments': 'ManEstab',
    'Commercial Establishments': 'ComEstab',
    'Industrial Estate' : 'IndEst',
    'Financial Institutions': 'FinIns'
  };

  return map[module] || 'DefaultModule';
}
selectMainModule(moduleName: string) {
  if (moduleName === 'Tourism') {
    this.showTourismOptions = !this.showTourismOptions;
    this.showAgricultureOptions = false; // Isira ang Agriculture kung Tourism ang gi-click
  } else if (moduleName === 'Agriculture') {
    this.showAgricultureOptions = !this.showAgricultureOptions;
    this.showTourismOptions = false; // Isira ang Tourism kung Agriculture ang gi-click
  } else {
    this.showTourismOptions = false;
    this.showAgricultureOptions = false;
    this.uploadModule(moduleName);
  }
}
tourismCategories = [
  { id: '1', name: 'Resorts' },
  { id: '2', name: 'Recreation Facilities' },
  { id: '3', name: 'Lodging Houses' },
  { id: '4', name: 'Cinema/ Movie Houses' },
  { id: '5', name: 'Natural/ Man-made Tourist Attractions' },
  { id: '6', name: 'Cultural/ Religious Attractions' },
  { id: '7', name: 'Fiestas and Festivals' }
];
agricultureCategories = [
  { id: '2', name: 'Rice/ Crops Production' },
  { id: '3', name: 'Fisheries/ Aquaculture' },
  { id: '4', name: 'Livestock / Poultry' },
  { id: '5', name: 'Ricemills' },
  { id: '6', name: 'Warehouses' },
  { id: '7', name: 'Slaughterhouses' }
];

showTourismOptions = false; // Flag para ipakita ang sub-menu
showAgricultureOptions = false;

showSocialProfile: boolean = true;
showEducationOptions: boolean = true;

toggleSocialProfile() {
  this.showSocialProfile = !this.showSocialProfile;
}

toggleEducation() {
  this.showEducationOptions = !this.showEducationOptions;
}

}
