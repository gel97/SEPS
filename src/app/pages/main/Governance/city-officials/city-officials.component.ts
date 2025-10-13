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
    this.city = {}; // reset form

    // Ensure Angular re-renders
    setTimeout(() => {
      $('#ModalAdd').modal('show'); // open Bootstrap modal
    });
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
  }

  Init() {
    this.getPositions();
    this.getOfficials();
  }
  modifyCityMun(cityMunName: string) {
    return this.modifyService.ModifyText(cityMunName);
  }
  getOfficials() {
    // this.elected = [];
    // this.appointed = [];
    this.service.GetOfficial().subscribe((data: any) => {
      this.Official = <any>data;
      this.elected = [];
      this.appointed = [];
      data.forEach((element: any) => {
        if (element.category == 1) {
          this.elected.push(element);
        } else {
          this.appointed.push(element);
        }
      });
      // this.import();
    });
    console.log(this.elected);
    console.log(this.appointed);
  }

  message = 'City Officials';

  // importData: string = 'City Official';
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
    this.toValidate.name =
      this.city.name == '' || this.city.name == null ? true : false;
    // this.toValidate.seqNo =
    //   this.city.seqNo == '' || this.city.seqNo == undefined ? true : false;
    // this.toValidate.term =
    //   this.city.term == '' || this.city.term == null ? true : false;
    this.toValidate.contact =
      this.city.contact == '' || this.city.contact == undefined ? true : false;
    if (
      this.toValidate.name == true ||
      // this.toValidate.seqNo == true ||
      this.toValidate.term == true ||
      this.toValidate.contact == true
    ) {
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields',
        'warning'
      );
    } else {
      this.city.category = this.category;
      this.city.munCityId = this.auth.munCityId;
      this.city.setYear = this.auth.activeSetYear;
      this.city.transId = this.date.transform(Date.now(), 'YYMM');
      this.city.tag = 1;
      this.city.setYear = this.auth.activeSetYear;
      //this.city.position = '';
      this.service.AddOfficial(this.city).subscribe(
        (_data) => {
          if (!this.isCheck) {
            this.closebutton.nativeElement.click();
          }
          console.log(_data);
          this.clearData();
          this.getOfficials();
          Swal.fire('Good job!', 'Data Added Successfully!', 'success');
          this.getOfficials();
          this.city = {};
        },
        (err) => {
          Swal.fire('ERROR!', 'Data Already Exist', 'error');
        }
      );
    }
  }

  //for modal
  update() {
    this.toValidate.name =
      this.editModal.name == '' || this.editModal.name == null ? true : false;
    // this.toValidate.seqNo =
    //   this.editModal.seqNo == '' || this.editModal.seqNo == undefined
    //     ? true
    //     : false;
    // this.toValidate.term =
    //   this.editModal.term == '' || this.editModal.term == null ? true : false;
    this.toValidate.contact =
      this.editModal.contact == '' || this.editModal.contact == undefined
        ? true
        : false;
    if (
      this.toValidate.name == true ||
      // this.toValidate.seqNo == true ||
      this.toValidate.term == true ||
      this.toValidate.contact == true
    ) {
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields',
        'warning'
      );
    } else {
      this.service.UpdateOfficial(this.editModal).subscribe({
        next: (_data) => {
          this.getOfficials();
          this.editModal = {};
        },
      });

      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Your work has been updated',
        showConfirmButton: false,
        timer: 1000,
      });
      document.getElementById('exampleModalLong')?.click();
      this.getOfficials();
    }
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
        next: (_data) => {
          Swal.fire({
            title: 'Deleted!',
            text: 'Your file has been removed.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
          }).then(() => {
            this.Init(); // refresh after Swal closes
            this.city = {};
          });
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
