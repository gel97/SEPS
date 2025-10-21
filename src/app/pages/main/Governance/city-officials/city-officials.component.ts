import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  Renderer2,
} from '@angular/core';
import { CityOfficialService } from 'src/app/shared/Governance/city-official.service'; // import service
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';
import { ModifyCityMunService } from 'src/app/services/modify-city-mun.service';
import { ImportComponent } from 'src/app/components/import/import.component';
import { PdfComponent } from 'src/app/components/pdf/pdf.component';
import { PdfService } from 'src/app/services/pdf.service';
import { ReportsService } from 'src/app/shared/Tools/reports.service';
import {
  Router,
  Event as RouterEvent,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError,
} from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-city-officials',
  templateUrl: './city-officials.component.html',
  styleUrls: ['./city-officials.component.css'],
})
export class CityOfficialsComponent implements OnInit {
  isLoading: boolean = true;
  isCheck: boolean = false;
  visible: boolean = true;
  not_visible: boolean = true;
  // required: boolean = true;

  @ViewChild(ImportComponent)
  private importComponent!: ImportComponent;
  navigationInterceptor: any;
  @ViewChild(PdfComponent)
  private pdfComponent!: PdfComponent;
  latestTerm: any;

  constructor(
    private pdfService: PdfService,
    private reportService: ReportsService,
    private service: CityOfficialService,
    private auth: AuthService,
    private modifyService: ModifyCityMunService,
    private renderer: Renderer2,
    private closebuttons: ElementRef,
    private router: Router
  ) {
    router.events.subscribe((event: RouterEvent) => {
      this.navigationInterceptor(event);
    });
  } // private service: + name of service that you've created
  toValidate: any = {};
  Official: any = [];
  appointed: any = [];
  elected: any = [];
  city: any = {};
  city2: any = {};
  Edit: any = {};
  updateOfficial: any = {};
  editModal: any = {};
  AddModal: any = {};
  positions: any = [];
  munCityName: string = this.auth.munCityName;
  searchText = '';
  pageSize = 25;
  p: string | number | undefined;
  count: number = 0;
  tableSize: number = 5;
  tableSizes: any = [5, 10, 15, 25, 50, 100];
  data: any = {};

  selectedYear: number = new Date().getFullYear();
  years: number[] = [];
  termYear: number | null = null;
  isEditingYear = false;
  newYear: { termYear: string | null } = {
  termYear: null,
};
  termYears: any[] = [];

  


  public showOverlay = false;
  importMethod() {
    this.showOverlay = true;
    this.service.Import().subscribe({
      next: (data) => {
        this.Init();
        if (data.length === 0) {
          this.showOverlay = false;
          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer);
              toast.addEventListener('mouseleave', Swal.resumeTimer);
            },
          });

          Toast.fire({
            icon: 'info',
            title: 'No data from previous year',
          });
        } else {
          this.showOverlay = false;
          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer);
              toast.addEventListener('mouseleave', Swal.resumeTimer);
            },
          });

          Toast.fire({
            icon: 'success',
            title: 'Imported Successfully',
          });
        }
      },
      error: (error) => {
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
          },
        });

        Toast.fire({
          icon: 'warning',
          title: 'Something went wrong',
        });
      },
      complete: () => {},
    });
  }
  setCategory(type: number) {
    this.category = type;
    this.city = {};
  }
  openModal(type: number) {
  this.category = type;
  this.city = {};
  this.toValidate = { name: false, contact: false };
  this.updateOfficial = true;
  $('#ModalAdd').modal('show');
}


  closeModal() {
    $('#ModalAdd').modal('hide');
  }

  reports: any = [];
  GeneratePDF() {
    let data: any = [];

    this.reportService
      .GetCityOfficialsReport(this.pdfComponent.data)
      .subscribe({
        next: (response) => {
          this.reports = <any>response;
          console.log(this.reports);

          data.push({
            text: 'List of Local Government Officials by Municipality/ City',
            bold: true,
            alignment: 'center',
          });

          const groupedData = this.reports.reduce((groups: any, item: any) => {
            const { munCityName, setYear } = item;
            const groupKey = `${munCityName}-${setYear}`;
            if (!groups[groupKey]) {
              groups[groupKey] = [];
            }
            groups[groupKey].push(item);
            return groups;
          }, {});

          // Iterate over each group and add it to the PDF
          for (const groupKey in groupedData) {
            const group = groupedData[groupKey];
            const [cityName, year] = groupKey.split('-');
            data.push({
              margin: [0, 50, 0, 0],
              columns: [
                {
                  text: cityName,
                  fontSize: 14,
                  bold: true,
                },
                {
                  text: `Year: ${year}`,
                  fontSize: 14,
                  bold: true,
                  alignment: 'right',
                },
              ],
            });

            // Create the table
            const tableData: any = [];
            tableData.push([
              {
                text: 'Position',
                fillColor: 'black',
                color: 'white',
                bold: true,
                alignment: 'center',
              },
              {
                text: 'Name',
                fillColor: 'black',
                color: 'white',
                bold: true,
                alignment: 'center',
              },
              {
                text: 'Term',
                fillColor: 'black',
                color: 'white',
                bold: true,
                alignment: 'center',
              },
              {
                text: 'Contact #',
                fillColor: 'black',
                color: 'white',
                bold: true,
                alignment: 'center',
              },
            ]);
            group.forEach((item: any, index: any) => {
              tableData.push([
                {
                  text: item.position,
                  fillColor: index % 2 === 0 ? '#FFFFFF' : '#9DB2BF',
                },
                {
                  text: item.name,
                  fillColor: index % 2 === 0 ? '#FFFFFF' : '#9DB2BF',
                },
                {
                  text: item.term,
                  fillColor: index % 2 === 0 ? '#FFFFFF' : '#9DB2BF',
                },
                {
                  text: item.contact,
                  fillColor: index % 2 === 0 ? '#FFFFFF' : '#9DB2BF',
                },
              ]);
            });
            const table = {
              margin: [0, 10, 0, 0],
              table: {
                widths: ['*', '*', '*', '*'],
                body: tableData,
              },
              layout: 'lightHorizontalLines',
            };

            data.push(table);
          }
        },
        error: (error) => {
          console.log(error);
        },
        complete: () => {
          let isPortrait = true;
          this.pdfService.GeneratePdf(data, isPortrait, '');
          console.log(data);
        },
      });
  }
  @ViewChild('closebutton')
  closebutton!: { nativeElement: { click: () => void } };

  onChange(isCheck: boolean) {
    this.isCheck = isCheck;
    console.log('isCheck:', this.isCheck);
  }

  date = new DatePipe('en-PH');
  ngOnInit(): void {
    this.Init();
     // For Add modal
  $('#ModalAdd').on('hidden.bs.modal', () => {
    this.editModal = {};
    this.city = {};
    this.category = 0;
    this.toValidate = { name: false, contact: false, term: false };
  });

  // For Edit modal
  $('#exampleModalLong').on('hidden.bs.modal', () => {
    this.editModal = {};
    this.toValidate = { name: false, contact: false, term: false };
    $('.modal-backdrop').remove();
    $('body').removeClass('modal-open');
  });
    const current = new Date().getFullYear();
    for (let i = current - 2; i <= current + 5; i++) {
      this.years.push(i);
    }
  }
 closeEditModal() {
  $('#exampleModalLong').modal('hide');
  $('.modal-backdrop').remove();
  $('body').removeClass('modal-open');
  this.editModal = {};
  this.toValidate = { name: false, contact: false, term: false };
}


  Init() {
    this.getPositions();
    this.getOfficials();
    this.getTermYears();
  }
  modifyCityMun(cityMunName: string) {
    return this.modifyService.ModifyText(cityMunName);
  }
  getOfficials() {
  this.service.GetOfficial().subscribe((data: any) => {
    this.Official = data;
    this.elected = data.filter((x: any) => x.category === 1);
    this.appointed = data
      .filter((x: any) => x.category === 2)
      .map((x: any) => ({ ...x, term: x.term || '' })); // ensure term exists
  });
}
getTermYears() {
  this.service.Term().subscribe({
    next: (data) => {
      if (data && data.length > 0) {
        const latest = data.sort(
          (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )[0];

        this.latestTerm = latest; // ✅ store the full object
        this.termYear = latest.termYear;
        this.newYear.termYear = latest.termYear;
      } else {
        this.termYear = null;
        this.newYear.termYear = null;
      }
    },
    error: (err) => {
      console.error('Error fetching term years:', err);
      Swal.fire('Error', 'Unable to load Term of Years.', 'error');
    },
  });
}





  message = 'City Officials';
  viewData: boolean = false;
  parentMethod() {
    this.data = {};
    this.viewData = true;
    this.not_visible = false;
    this.visible = false;
  }

   importData: string = 'City Official';
  import() {
    let importData = 'City Official';
    this.importComponent.import(importData);
  }

  getPositions() {
    this.service.GetMunPosition().subscribe((data) => {
      this.positions = <any>data;
    });
  }
  category: number = 0;
  addOfficial() {
  this.toValidate.name = !this.city.name;
  this.toValidate.contact = !this.city.contact;

  if (this.toValidate.name || this.toValidate.contact) {
    Swal.fire('Missing Data!', 'Please fill out the required fields', 'warning');
    return;
  }

  this.city.category = this.category;
  this.city.munCityId = this.auth.munCityId;
  this.city.setYear = this.auth.activeSetYear;
  this.city.transId = this.date.transform(Date.now(), 'YYMM');
  this.city.tag = 1;

  // Only set term for appointed
  if (this.city.category !== 2) {
    this.city.term = null;
  }

  this.service.AddOfficial(this.city).subscribe({
    next: (_data) => {
      $('#ModalAdd').modal('hide'); // close modal
      this.clearData();
      this.getOfficials();
      Swal.fire('Good job!', 'Data Added Successfully!', 'success');
      this.city = {};
    },
    error: (err) => {
      Swal.fire('ERROR!', 'Data Already Exist or Invalid Input', 'error');
    },
  });
}

addYear() {
  if (!this.newYear.termYear) {
    Swal.fire('Missing Data!', 'Please enter a year range (e.g. 2025–2028).', 'warning');
    return;
  }

  const yearText = String(this.newYear.termYear).trim();

  const payload = {
    setYear: this.auth.activeSetYear, // or parseInt(yearText.split('-')[0], 10)
    TermYear: yearText,
    munCityId: this.auth.munCityId,
  };

  console.log('Sending payload:', payload);

  this.service.AddYearTerm(payload).subscribe({
    next: (res) => {
      Swal.fire('Success!', 'New Term Year added successfully!', 'success');
      $('#ModalAddYear').modal('hide');

      // ✅ Auto-refresh the displayed term year
      this.getTermYears();

      // ✅ Reset input
      this.newYear.termYear = null;
    },
    error: (err) => {
      console.error('Error adding year:', err);
      Swal.fire('Error!', 'Year already exists or invalid input.', 'error');
    },
  });
}

editTerm() {
  if (!this.newYear.termYear) {
    Swal.fire('Missing Data!', 'Please enter a valid year range (e.g. 2025–2028).', 'warning');
    return;
  }

  // Build the payload your API expects
  const payload = {
    recNo: this.latestTerm?.recNo, // make sure `id` exists in your fetched data
    transId: this.latestTerm?.transId,
    userId: this.latestTerm?.userId,
    createdAt: this.latestTerm?.createdAt,
    tag: this.latestTerm?.tag,
    termYear: this.newYear.termYear.trim(),
    setYear: this.auth.activeSetYear,
    munCityId: this.auth.munCityId,
  };

  console.log('Updating term year with payload:', payload);

  this.service.UpdateTerm(payload).subscribe({
    next: (res) => {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Term Year updated successfully!',
        showConfirmButton: false,
        timer: 1200,
      });
      this.isEditingYear = false; // hide input after saving
      this.getTermYears(); // refresh data
    },
    error: (err) => {
      console.error('Update error:', err);
      Swal.fire('Error', 'Unable to update term year. Please check your input.', 'error');
    },
  });
}



openEditModal(official: any) {
  this.toValidate = { name: false, contact: false, term: false };
  this.editModal = {
    ...official,
    category: official.category ?? this.category,
  };
  $('.modal-backdrop').remove();
  $('body').removeClass('modal-open');
  setTimeout(() => {
    $('#exampleModalLong').modal('show');
  }, 0);
}






  //for modal
  update() {
  this.toValidate.name = !this.editModal.name;
  this.toValidate.contact = !this.editModal.contact;

  // Ensure category is always correct
  this.editModal.category = this.category || this.editModal.category;

  // For appointed (category = 2)
  if (this.editModal.category === 2) {
    this.toValidate.term = !this.editModal.term;
  } else {
    this.toValidate.term = false;
    this.editModal.term = null;
  }

  // Validation
  if (this.toValidate.name || this.toValidate.contact || this.toValidate.term) {
    Swal.fire('Missing Data!', 'Please fill out the required fields', 'warning');
    return;
  }

  this.service.UpdateOfficial(this.editModal).subscribe({
    next: (_data) => {
      this.closeEditModal(); // ✅ use our helper cleanup
      this.getOfficials();

      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Official updated successfully!',
        showConfirmButton: false,
        timer: 1000,
      });
    },
    error: (err) => {
      console.error('Update error:', err);
      Swal.fire('Error', 'Unable to update official.', 'error');
    },
  });
}




  delete(official2: any = {}) {
  Swal.fire({
    text: 'Do you want to remove this file?',
    icon: 'warning',
    showConfirmButton: true,
    showCancelButton: true,
    confirmButtonText: 'Yes, remove it!',
  }).then((result) => {
    if (result.value) {
      this.service.Delete_Officials(official2.transId).subscribe({
  next: (_data: any) => {
    Swal.fire({
      title: 'Deleted!',
      text: 'The record has been removed.',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false,
    });
    this.Init(); // refresh after deletion
    this.city = {};
  },
  error: (err) => {
    Swal.fire('Error', 'Something went wrong while deleting.', 'error');
    console.error(err);
  },
});
    }
  });
}

  onTableDataChange(page: any) {
    //paginate
    console.log(page);
    this.p = page;
    this.Init();
  }
  onTableSizeChange(event: any) {
    //paginate
    this.tableSize = event.target.value;
    this.p = 1;
    this.Init();
  }
  clearData() {
    this.city = {};
    this.not_visible = false;
    this.visible = true;
    // this.required = false;
  }
}
