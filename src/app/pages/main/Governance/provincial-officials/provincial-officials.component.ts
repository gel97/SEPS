import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ProvOfficialService } from 'src/app/shared/Governance/prov-official.service';
import Swal from 'sweetalert2';
import { ImportComponent } from 'src/app/components/import/import.component';
import { PdfComponent } from 'src/app/components/pdf/pdf.component';
import { PdfService } from 'src/app/services/pdf.service';
import { ReportsService } from 'src/app/shared/Tools/reports.service';

@Component({
  selector: 'app-provincial-officials',
  templateUrl: './provincial-officials.component.html',
  styleUrls: ['./provincial-officials.component.css'],
})
export class ProvincialOfficialsComponent implements OnInit {
  constructor(
    private pdfService: PdfService,
    private reportService: ReportsService,
    private service: ProvOfficialService,
    private auth: AuthService
  ) {}

  isLoading: boolean = true;
  toValidate: any = {};
  ProOfficial: any = [];
  Prov: any = {};
  Edit: any = {};
  updateOfficial: any = {};
  editModal: any = {};
  AddModal: any = {};
  positions: any = [];

  pageSize = 25;
  p: string | number | undefined;
  count: number = 0;
  tableSize: number = 5;
  tableSizes: any = [5, 10, 15, 25, 50, 100];

  isCheck: boolean = false;
  visible: boolean = true;
  not_visible: boolean = true;

  @ViewChild('closebutton')
  closebutton!: { nativeElement: { click: () => void } };

  @ViewChild(ImportComponent)
  private importComponent!: ImportComponent;

  @ViewChild(PdfComponent)
  private pdfComponent!: PdfComponent;

  onChange(isCheck: boolean) {
    this.isCheck = isCheck;
    console.log('isCheck:', this.isCheck);
  }

  clearData() {
    this.Prov = {};
    this.not_visible = false;
    this.visible = true;
    // this.required = false;
  }

  date = new DatePipe('en-PH');
  ngOnInit(): void {
   this.Init();
  }

  Init() {
    this.getOfficials();
    this.getPositions();
  }

  reports: any = [];
  GeneratePDF() {
    let data: any = [];

    this.reportService.GetProvOfficialReport(this.pdfComponent.data).subscribe({
      next: (response) => {
        this.reports = <any>response;
        console.log(this.reports)

        const groupedData = this.reports.reduce((groups: any, item: any) => {
          const { setYear } = item;
          const groupKey = `${setYear}`;
          if (!groups[groupKey]) {
            groups[groupKey] = [];
          }
          groups[groupKey].push(item);
          return groups;
        }, {});

        // Iterate over each group and add it to the PDF
        for (const groupKey in groupedData) {
          const group = groupedData[groupKey];
          const [year] = groupKey.split('-');
          data.push({
            margin: [0, 50, 0, 0],
            columns: [
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
            }
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
        this.pdfService.GeneratePdf(data, isPortrait);
        console.log(data);
      },
    });
  }
  getPositions() {
    this.service.GetMunPosition().subscribe((data) => {
      this.positions = <any>data;
    });
  }

  getOfficials() {
    // this.Prov.munCityId=this.auth.munCityId;
    this.Prov.setYear = this.auth.activeSetYear;
    this.service.GetProvOfficial().subscribe((data) => {
      this.ProOfficial = <any>data;
      // this.import();

      console.log('official', this.ProOfficial);
      // this.isLoading = false;
    });
  }

  message = 'Provincial Officials';

  import() {
    let importData = 'Provincial Officials';
    this.importComponent.import(importData);
  }
  public showOverlay = false;
  importMethod() {
    this.showOverlay = true;
    this.service.Import().subscribe({
      next: (data) => {
        this.Init();
        if(data.length === 0){
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
        }
        else
        {
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

  addOfficial() {
    this.toValidate.seqNo =
      this.Prov.seqNo == '' || this.Prov.seqNo == null ? true : false;
    this.toValidate.name =
      this.Prov.name == '' || this.Prov.name == undefined ? true : false;

    if (this.toValidate.name == true || this.toValidate.seqNo == true) {
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields',
        'warning'
      );
    } else {
      this.Prov.munCityId = this.auth.munCityId;
      this.Prov.setYear = this.auth.activeSetYear;
      this.Prov.transId = this.date.transform(Date.now(), 'YYMM');
      // this.Prov.tag = 1;
      this.service.AddProvOfficial(this.Prov).subscribe(
        (_data) => {
          if (!this.isCheck) {
            this.closebutton.nativeElement.click();
          }
          console.log(_data);
          this.clearData();
          this.getOfficials();

          Swal.fire('Good job!', 'Data Added Successfully!', 'success');
        },
        (_err) => {
          Swal.fire('ERROR!', 'Data Already Exist', 'error');

          this.getOfficials();
          this.Prov = {};
        }
      );
    }
  }

  editOfficial(editOfficial: any = {}) {
    this.editModal = editOfficial;
    //passing the data from table (modal)
    this.getOfficials();
  }

  //for modal
  update() {
    this.editModal.setYear = this.auth.activeSetYear;
    this.toValidate.seqNo =
      this.editModal.seqNo == '' || this.editModal.seqNo == null ? true : false;
    this.toValidate.name =
      this.editModal.name == '' || this.editModal.name == undefined
        ? true
        : false;
    if (this.toValidate.name == true || this.toValidate.seqNo == true) {
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields',
        'warning'
      );
    } else {
      this.service.UpdateProvOfficial(this.editModal).subscribe({
        next: (_data) => {
          this.getOfficials();
          this.editModal = {};
          // this.editModal();
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
      this.editModal = {};
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
        official2.tag = -1;
        this.service.UpdateProvOfficial(official2).subscribe((_data) => {
          Swal.fire('Deleted!', 'Your file has been removed.', 'success');
          this.getOfficials();
          this.Prov = {};
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
      this.getOfficials();
      this.Prov = {};
    });
  }

  onTableDataChange(page: any) {
    //paginate
    console.log(page);
    this.p = page;
    this.getOfficials();
  }
  onTableSizeChange(event: any) {
    //paginate
    this.tableSize = event.target.value;
    this.p = 1;
    this.getOfficials();
  }
}
