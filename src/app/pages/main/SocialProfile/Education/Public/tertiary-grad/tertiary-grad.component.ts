import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';
import { GmapComponent } from 'src/app/components/gmap/gmap.component';
import { PdfComponent } from 'src/app/components/pdf/pdf.component';
import { PdfService } from 'src/app/services/pdf.service';
import { ReportsService } from 'src/app/shared/Tools/reports.service';
import { ModifyCityMunService } from 'src/app/services/modify-city-mun.service';
import { EducationTertiaryGradService } from 'src/app/shared/SocialProfile/Education/educationTertiaryGrad.service';
import { SourceService } from 'src/app/shared/Source/Source.Service';

@Component({
  selector: 'app-tertiary-grad',
  templateUrl: './tertiary-grad.component.html',
  styleUrls: ['./tertiary-grad.component.css'],
})
export class TertiaryGradComponent implements OnInit {
  @ViewChild(GmapComponent)
  private gmapComponent!: GmapComponent;
  @ViewChild(PdfComponent)
  private pdfComponent!: PdfComponent;

  @ViewChild('closebutton')
  closebutton!: { nativeElement: { click: () => void } };

  constructor(
    private pdfService: PdfService,
    private reportService: ReportsService,
    private service: EducationTertiaryGradService,
    private auth: AuthService,
    private modifyService: ModifyCityMunService,
    private SourceService: SourceService
  ) {}

  modifyCityMun(cityMunName: string) {
    return this.modifyService.ModifyText(cityMunName);
  }

  munCityName: string = this.auth.munCityName;
  toValidate: any = {};
  isAdd: boolean = false;

  listEductaion: any = [];
  listData: any = [];
  listCourse: any = [];

  data: any = {};
  reports: any = [];
  sources: any = [];
  newSource: any = {};
  selectedSourceId: number | null = null;
  showAddForm: boolean = true;

  ngOnInit(): void {
    this.Init();
    this.getSources();
  }
  getSources(): void {
    const setYear = this.auth.activeSetYear;
    const munCityId = this.auth.munCityId;
    const sourceFor = 'tertiary-grad';

    this.SourceService.getSources(setYear, munCityId, sourceFor).subscribe({
      next: (data) => {
        this.sources = data;
        this.showAddForm = data.length === 0;
      },
      error: (error) => {
        console.error('Failed to fetch sources:', error);
      },
    });
  }

  addSource(): void {
    if (!this.newSource?.name) {
      Swal.fire('Warning', 'Please enter a source name.', 'warning');
      return;
    }

    const sourceFor = 'tertiary-grad'; // 👈 assign your module name

    // ✅ Add metadata
    this.newSource.munCityId = this.auth.munCityId;
    this.newSource.setYear = this.auth.activeSetYear;
    this.newSource.sourceFor = sourceFor;

    this.SourceService.createSource(this.newSource).subscribe({
      next: () => {
        this.newSource = {};
        Swal.fire('Success', 'Source added successfully.', 'success');
        this.getSources(); // ✅ Re-fetch source list
      },
      error: (error) => {
        Swal.fire('Error', `Failed to create source.\n${error}`, 'error');
      },
    });
  }

  updateSource(): void {
    if (this.selectedSourceId === null || !this.newSource?.name) {
      Swal.fire('Warning', 'No source selected or missing name.', 'warning');
      return;
    }

    this.SourceService.updateSource(
      this.selectedSourceId,
      this.newSource
    ).subscribe({
      next: () => {
        this.getSources();
        this.selectedSourceId = null;
        this.newSource = {};
        Swal.fire('Success', 'Source updated successfully!', 'success');
      },
      error: (error) => {
        Swal.fire('Error', `Failed to update source.\n${error}`, 'error');
      },
    });
  }
  deleteSource(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action will delete the source.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        // Show loading dialog
        Swal.fire({
          title: 'Deleting...',
          allowOutsideClick: false,
          allowEscapeKey: false,
          showConfirmButton: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        // Perform delete operation
        this.SourceService.deleteSource(id).subscribe({
          next: () => {
            this.getSources(); // Refresh list
            Swal.fire('Deleted!', 'Source has been deleted.', 'success');
          },
          error: (error) => {
            Swal.fire(
              'Error',
              `Failed to delete source.\n${error.message || error}`,
              'error'
            );
          },
        });
      }
    });
  }

  editSource(source: any): void {
    this.selectedSourceId = source.id;
    this.newSource = { ...source };
  }

  Init() {
    this.GetData();
    this.GetListCourse();
  }

  GeneratePDF() {
    let data: any = [];
    let grandTotal: any = {};

    let reports: any = [];
    let columnLenght: number = 0;

    const tableData: any = [];

    let summary: any = [];
    let contentData: any = [];

    this.reportService
      .GetEducationTertiaryGradReport(this.pdfComponent.data)
      .subscribe({
        next: (response: any = {}) => {
          reports = response.data;
          summary = response.summary;
          grandTotal = response.grandTotal;

          console.log('result: ', response);

          data.push({
            margin: [0, 40, 0, 0],
            columns: [
              {
                text: `Tertiary Graduates by Municipality/City`,
                fontSize: 14,
                bold: true,
              },
              {
                text: `Year: ${response.year}`,
                fontSize: 14,
                bold: true,
                alignment: 'right',
              },
            ],
          });

          data.push({
            margin: [0, 10, 0, 0],
            columns: [
              {
                text: `Summary`,
                fontSize: 12,
                bold: true,
              },
            ],
          });

          tableData.push([
            {
              text: '#',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
            },
            {
              text: 'Course',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
            },
            {
              text: 'Male',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
            },
            {
              text: 'Female',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
            },
            {
              text: 'Total',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
            },
          ]);

          summary.forEach((a: any, index: any) => {
            tableData.push([
              {
                text: index + 1,
                marginLeft: 2,
                fillColor: index % 2 === 0 ? '#FFFFFF' : '#9DB2BF',
              },
              {
                text: a.program,
                fillColor: index % 2 === 0 ? '#FFFFFF' : '#9DB2BF',
              },
              {
                text: a.male,
                alignment: 'center',
                fillColor: index % 2 === 0 ? '#FFFFFF' : '#9DB2BF',
              },
              {
                text: a.female,
                alignment: 'center',
                fillColor: index % 2 === 0 ? '#FFFFFF' : '#9DB2BF',
              },
              {
                text: a.total,
                alignment: 'center',
                fillColor: index % 2 === 0 ? '#FFFFFF' : '#9DB2BF',
              },
            ]);
          });

          contentData.push([
            {
              margin: [0, 10, 0, 0],
              table: {
                widths: [25, '*', '*', '*', '*'],
                body: tableData,
              },
              layout: 'lightHorizontalLines',
              pageBreak: 'after',
            },
          ]);

          reports.forEach((a: any, index: any) => {
            let newTableData: any = [];
            contentData.push([{ text: a.munCityName, bold: true }]);
            newTableData.push([
              {
                text: '#',
                fillColor: 'black',
                color: 'white',
                bold: true,
                alignment: 'center',
              },
              {
                text: 'Course',
                fillColor: 'black',
                color: 'white',
                bold: true,
                alignment: 'center',
              },
              {
                text: 'Male',
                fillColor: 'black',
                color: 'white',
                bold: true,
                alignment: 'center',
              },
              {
                text: 'Female',
                fillColor: 'black',
                color: 'white',
                bold: true,
                alignment: 'center',
              },
              {
                text: 'Total',
                fillColor: 'black',
                color: 'white',
                bold: true,
                alignment: 'center',
              },
            ]);

            a.data.forEach((b: any, i: any) => {
              newTableData.push([
                {
                  text: i + 1,
                  marginLeft: 2,
                  fillColor: i % 2 === 0 ? '#FFFFFF' : '#9DB2BF',
                },
                {
                  text: b.program,
                  fillColor: i % 2 === 0 ? '#FFFFFF' : '#9DB2BF',
                },
                {
                  text: b.male,
                  alignment: 'center',
                  fillColor: i % 2 === 0 ? '#FFFFFF' : '#9DB2BF',
                },
                {
                  text: b.female,
                  alignment: 'center',
                  fillColor: i % 2 === 0 ? '#FFFFFF' : '#9DB2BF',
                },
                {
                  text: b.total,
                  alignment: 'center',
                  fillColor: i % 2 === 0 ? '#FFFFFF' : '#9DB2BF',
                },
              ]);
            });

            contentData.push([
              {
                margin: [0, 10, 0, 0],
                table: {
                  widths: [25, '*', '*', '*', '*'],
                  body: newTableData,
                },
                layout: 'lightHorizontalLines',
                pageBreak: 'after',
              },
            ]);
          });

          // const table = {
          //   margin: [0, 10, 0, 0],
          //   table: {
          //     widths: [25, '*', '*', '*', '*'],
          //     body: tableData,
          //   },
          //   layout: 'lightHorizontalLines',
          // };

          data.push(contentData);
        },
        error: (error: any) => {
          console.log(error);
        },
        complete: () => {
          let isPortrait = false;
          this.pdfService.GeneratePdf(data, isPortrait, '');
          console.log(data);
        },
      });
  }

  GetData() {
    this.service
      .GetListEducationTertiaryGrad(this.auth.setYear, this.auth.munCityId)
      .subscribe({
        next: (response) => {
          this.listEductaion = <any>response;
          console.log('Education:', this.listEductaion);
        },
        error: (error) => {},
        complete: () => {
          this.GetListCourse();
        },
      });
  }

  GetListCourse() {
    this.service.GetListCourse().subscribe({
      next: (response) => {
        this.listCourse = <any>response;
        console.log('Course:', this.listCourse);
      },
      error: (error) => {},
      complete: () => {
        this.FilterList();
      },
    });
  }

  FilterList() {
    let isExist;
    this.listData = [];

    this.listCourse.forEach((a: any) => {
      this.listEductaion.forEach((b: any) => {
        if (a.recNo === b.course) {
          isExist = this.listData.filter((x: any) => x.course === a.course);
          if (isExist.length === 0) {
            this.listData.push(b);
          }
        }
      });

      isExist = this.listData.filter((x: any) => x.course == a.recNo);
      if (isExist.length === 0) {
        this.listData.push({
          course: a.recNo,
          program: a.program,
        });
      }
    });
    console.log('mergeList: ', this.listData);
  }

  AddData() {
    this.data.setYear = this.auth.activeSetYear;
    this.data.munCityId = this.auth.o_munCityId;
    console.log(this.data);
    this.service.AddEducationTertiaryGrad(this.data).subscribe({
      next: (request) => {
        let index = this.listData.findIndex(
          (obj: any) => obj.course === this.data.course
        );
        this.listData[index] = request;
        console.log(request);
      },
      complete: () => {
        this.data = {};
        this.closebutton.nativeElement.click();

        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Your work has been saved',
          showConfirmButton: false,
          timer: 1000,
        });
      },
    });
  }

  EditData() {
    this.data.setYear = this.auth.activeSetYear;
    this.service.EditEducationTertiaryGrad(this.data).subscribe({
      next: (request) => {
        this.closebutton.nativeElement.click();
        this.data = {};
      },
      complete: () => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Your work has been updated',
          showConfirmButton: false,
          timer: 1000,
        });
      },
    });
  }

  DeleteData(transId: any, index: any, data: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.DeleteEducationTertiaryGrad(transId).subscribe({
          next: (_data) => {},
          error: (err) => {
            Swal.fire('Oops!', 'Something went wrong.', 'error');
          },
          complete: () => {
            this.listData[index] = {};
            this.listData[index].course = data.course;
            this.listData[index].program = data.program;
            Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
          },
        });
      }
    });
  }

  markerObj: any = {};
  SetMarker(data: any = {}) {
    this.markerObj = {
      lat: data.latitude,
      lng: data.longitude,
      label: data.brgyName.charAt(0),
      brgyName: data.brgyName,
      munCityName: this.munCityName,
      draggable: true,
    };
    this.gmapComponent.setMarker(this.markerObj);
  }
  pdfMake: any;

  async loadPdfMaker() {
    if (!this.pdfMake) {
      const pdfMakeModule = await import('pdfmake/build/pdfmake');
      const pdfFontsModule = await import('pdfmake/build/vfs_fonts');
      this.pdfMake = pdfMakeModule;
      this.pdfMake.vfs = pdfFontsModule.pdfMake.vfs;
    }
  }

  async GeneratePdf() {
    await this.loadPdfMaker();

    const def = {
      content: ['hello', 'hi'],
    };
    this.pdfMake.createPdf(def).open();
  }
}
