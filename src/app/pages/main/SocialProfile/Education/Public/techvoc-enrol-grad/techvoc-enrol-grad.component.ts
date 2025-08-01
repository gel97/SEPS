import { Component, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { GmapComponent } from 'src/app/components/gmap/gmap.component';
import { AuthService } from 'src/app/services/auth.service';
import { ModifyCityMunService } from 'src/app/services/modify-city-mun.service';
import { EducationTechVocStatService } from 'src/app/shared/SocialProfile/Education/educationTechVocStat.service';
import { isNgTemplate } from '@angular/compiler';
import { PdfComponent } from 'src/app/components/pdf/pdf.component';
import { PdfService } from 'src/app/services/pdf.service';
import { ReportsService } from 'src/app/shared/Tools/reports.service';
import { SourceService } from 'src/app/shared/Source/Source.Service';
@Component({
  selector: 'app-techvoc-enrol-grad',
  templateUrl: './techvoc-enrol-grad.component.html',
  styleUrls: ['./techvoc-enrol-grad.component.css'],
})
export class TechvocEnrolGradComponent implements OnInit {
  munCityName: string = this.auth.munCityName;
  constructor(
    private pdfService: PdfService,
    private reportService: ReportsService,
    private service: EducationTechVocStatService,
    private auth: AuthService,
    private modifyService: ModifyCityMunService,
    private SourceService: SourceService
  ) {}

  modifyCityMun(cityMunName: string) {
    return this.modifyService.ModifyText(cityMunName);
  }

  toValidate: any = {};
  sources: any = [];
  newSource: any = {};
  selectedSourceId: number | null = null;
  showAddForm: boolean = true;
  @ViewChild(GmapComponent)
  private gmapComponent!: GmapComponent;
  @ViewChild('closebutton')
  closebutton!: { nativeElement: { click: () => void } };
  @ViewChild(PdfComponent)
  private pdfComponent!: PdfComponent;
  isCheck: boolean = false;
  onChange(isCheck: boolean) {
    this.isCheck = isCheck;
  }

  onChangePrograms(item: any = {}) {
    console.log(item);
    if (item.transId !== null) {
      this.DeleteSchool(item.transId);
    } else {
      let isExist;
      isExist = this.selectedCourse.filter(
        (x: any) => x.course === item.course
      );
      if (isExist.length === 0) {
        this.selectedCourse.push(item);
      } else {
        const index = this.selectedCourse.findIndex(
          (x: any) => x.course === item.course
        );
        if (index !== -1) {
          this.selectedCourse.splice(index, 1);
        }
      }

      console.log('selectedCourse: ', this.selectedCourse);
    }
  }

  ngOnInit(): void {
    this.Init();
    this.getSources();
  }
  getSources(): void {
    const setYear = this.auth.activeSetYear;
    const munCityId = this.auth.munCityId;
    const sourceFor = 'techvoc-enrol-grad';

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

    const sourceFor = 'techvoc-enrol-grad'; // 👈 assign your module name

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

  GeneratePDF() {
    let data: any = [];
    let reports: any = [];
    let summary: any = [];

    const dist1: any = [];
    const dist2: any = [];
    const contentData: any = [];

    this.pdfComponent.data.menuId = 'graduates';
    const tableDataNew: any = [];
    this.reportService
      .GetEducationTechVocStatReport(this.pdfComponent.data)
      .subscribe({
        next: (response: any = {}) => {
          reports = response.data;
          summary = response.summary;
          console.log('result: ', response);

          contentData.push([{ text: 'Summary', bold: true }]);
          tableDataNew.push(
            [
              {
                text: '#',
                fillColor: 'black',
                color: 'white',
                bold: true,
                alignment: 'center',
                rowSpan: 2,
              },
              {
                text: 'Program',
                fillColor: 'black',
                color: 'white',
                bold: true,
                alignment: 'center',
                rowSpan: 2,
              },
              {
                text: 'School',
                fillColor: 'black',
                color: 'white',
                bold: true,
                alignment: 'center',
                rowSpan: 2,
              },
              {
                text: 'Enrolment',
                fillColor: 'black',
                color: 'white',
                bold: true,
                alignment: 'center',
                colSpan: 3,
              },
              {},
              {},
              {
                text: 'Graduates',
                fillColor: 'black',
                color: 'white',
                bold: true,
                alignment: 'center',
                colSpan: 3,
              },
              {},
              {},
            ],
            [
              {},
              {},
              {},
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
            ]
          );

          summary.forEach((a: any, index: any) => {
            tableDataNew.push([
              {
                text: index + 1,
                fillColor: index % 2 === 0 ? '#FFFFFF' : '#9DB2BF',
                bold: true,
                alignment: 'center',
                marginLeft: 5,
              },
              {
                text: a.program,
                fillColor: index % 2 === 0 ? '#FFFFFF' : '#9DB2BF',
                alignment: 'left',
              },
              {
                text: a.count,
                fillColor: index % 2 === 0 ? '#FFFFFF' : '#9DB2BF',
                alignment: 'center',
              },
              {
                text: a.maleEnrolly,
                fillColor: index % 2 === 0 ? '#FFFFFF' : '#9DB2BF',
                alignment: 'center',
              },
              {
                text: a.femaleEnrolly,
                fillColor: index % 2 === 0 ? '#FFFFFF' : '#9DB2BF',
                alignment: 'center',
              },
              {
                text: a.totalEnrolly,
                fillColor: '#F1C93B',
                alignment: 'center',
              },
              {
                text: a.maleGrad,
                fillColor: index % 2 === 0 ? '#FFFFFF' : '#9DB2BF',
                alignment: 'center',
              },
              {
                text: a.femaleGrad,
                fillColor: index % 2 === 0 ? '#FFFFFF' : '#9DB2BF',
                alignment: 'center',
              },
              {
                text: a.totalGrad,
                fillColor: '#F1C93B',
                alignment: 'center',
              },
            ]);
          });

          contentData.push([
            {
              margin: [0, 10, 0, 10],
              table: {
                widths: [25, 250, '*', '*', '*', '*', '*', '*', '*'],
                body: tableDataNew,
              },
              layout: 'lightHorizontalLines',
            },
          ]);

          reports.forEach((a: any, index: any) => {
            a.data.forEach((b: any, index2: any) => {
              const tableData: any = [];

              contentData.push([{ text: b.munCityName, bold: true }]);
              tableData.push(
                [
                  {
                    text: '#',
                    fillColor: 'black',
                    color: 'white',
                    bold: true,
                    alignment: 'center',
                    rowSpan: 2,
                  },
                  {
                    text: 'Program',
                    fillColor: 'black',
                    color: 'white',
                    bold: true,
                    alignment: 'center',
                    rowSpan: 2,
                  },
                  {
                    text: 'School',
                    fillColor: 'black',
                    color: 'white',
                    bold: true,
                    alignment: 'center',
                    rowSpan: 2,
                  },
                  {
                    text: 'Enrolment',
                    fillColor: 'black',
                    color: 'white',
                    bold: true,
                    alignment: 'center',
                    colSpan: 3,
                  },
                  {},
                  {},
                  {
                    text: 'Graduates',
                    fillColor: 'black',
                    color: 'white',
                    bold: true,
                    alignment: 'center',
                    colSpan: 3,
                  },
                  {},
                  {},
                ],
                [
                  {},
                  {},
                  {},
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
                ]
              );

              b.munData.forEach((c: any, index3: any) => {
                tableData.push([
                  {
                    text: index3 + 1,
                    fillColor: index % 2 === 0 ? '#FFFFFF' : '#9DB2BF',
                    bold: true,
                    alignment: 'center',
                    marginLeft: 5,
                  },
                  {
                    text: c.program,
                    fillColor: index % 2 === 0 ? '#FFFFFF' : '#9DB2BF',
                    alignment: 'left',
                  },
                  {
                    text: c.count,
                    fillColor: index % 2 === 0 ? '#FFFFFF' : '#9DB2BF',
                    alignment: 'center',
                  },
                  {
                    text: c.maleEnrolly,
                    fillColor: index % 2 === 0 ? '#FFFFFF' : '#9DB2BF',
                    alignment: 'center',
                  },
                  {
                    text: c.femaleEnrolly,
                    fillColor: index % 2 === 0 ? '#FFFFFF' : '#9DB2BF',
                    alignment: 'center',
                  },
                  {
                    text: c.totalEnrolly,
                    fillColor: '#F1C93B',
                    alignment: 'center',
                  },
                  {
                    text: c.maleGrad,
                    fillColor: index % 2 === 0 ? '#FFFFFF' : '#9DB2BF',
                    alignment: 'center',
                  },
                  {
                    text: c.femaleGrad,
                    fillColor: index % 2 === 0 ? '#FFFFFF' : '#9DB2BF',
                    alignment: 'center',
                  },
                  {
                    text: c.totalGrad,
                    fillColor: '#F1C93B',
                    alignment: 'center',
                  },
                ]);
              });

              contentData.push([
                {
                  margin: [0, 10, 0, 10],
                  table: {
                    widths: [25, 250, '*', '*', '*', '*', '*', '*', '*'],
                    body: tableData,
                  },
                  layout: 'lightHorizontalLines',
                },
              ]);
            });
          });

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
  munCityId: string = this.auth.munCityId;
  setYear: string = this.auth.setYear;

  isAdd: boolean = true;
  listFilter: any = [];
  listFilterPrograms: any = [];
  listData: any = [];
  schools: any = [];
  programs: any = [];

  school: any = {};
  selectedCourse: any = [];
  schoolName: any = '';
  Init() {
    this.GetListSchool();
  }
  GetListSchool() {
    this.service
      .GetListEducationTechVocStat(this.setYear, this.munCityId)
      .subscribe({
        next: (response) => {
          this.listData = <any>response;
          console.log(this.listData[0].schoolData);
        },
        error: (error) => {
          Swal.fire('Oops!', 'Something went wrong.', 'error');
        },
        complete: () => {
          this.GetListTechVoc();
        },
      });
  }

  GetListTechVoc() {
    this.service
      .GetListEducationTechVoc(this.setYear, this.munCityId)
      .subscribe({
        next: (response) => {
          this.schools = <any>response;
          console.log(this.schools);
        },
        error: (error) => {
          Swal.fire('Oops!', 'Something went wrong.', 'error');
        },
        complete: () => {
          this.FilterList();
          this.GetListPrograms();
        },
      });
  }

  GetListPrograms() {
    this.service.GetListEducationTechVocPrograms().subscribe({
      next: (response) => {
        this.programs = <any>response;
        console.log(this.programs);
      },
      error: (error) => {
        Swal.fire('Oops!', 'Something went wrong.', 'error');
      },
      complete: () => {},
    });
  }

  FilterList() {
    let isExist;
    this.listFilter = [];

    this.schools.forEach((a: any) => {
      this.listData[0].schoolData.forEach((b: any) => {
        // console.log(b);

        if (a.recNo === b.schoolId) {
          console.log(b);
          isExist = this.listFilter.filter((x: any) => x.schoolId === a.recNo);
          if (isExist.length === 0) {
            this.listFilter.push(b);
          }
        }
      });

      isExist = this.listFilter.filter((x: any) => x.schoolId == a.recNo);
      if (isExist.length === 0) {
        this.listFilter.push({
          schoolId: a.recNo,
          schoolYear: this.listData[0].schoolData[0].items[0].schoolYear,
          count: 1,
          items: [
            {
              name: a.name,
              setYear: this.listData[0].schoolData[0].items[0].setYear,
              munCityId: this.listData[0].schoolData[0].items[0].munCityId,
              isEmpty: true,
            },
          ],
        });
      }
    });
    console.log('mergeList: ', this.listFilter);
  }

  FilterPrograms(data: any = {}) {
    console.log(data);
    this.schoolName = data.items[0].name;
    let isExist;
    this.listFilterPrograms = [];
    this.programs.forEach((a: any) => {
      data.items.forEach((b: any) => {
        if (a.recNo === b.course) {
          isExist = this.listFilterPrograms.filter(
            (x: any) => x.course === a.recNo
          );
          if (isExist.length === 0) {
            this.listFilterPrograms.push({
              course: a.recNo,
              program: a.program,
              isCheck: true,
              transId: b.transId,
              setYear: b.setYear,
              munCityId: b.munCityId,
              schoolId: b.schoolId,
              schoolYear: b.schoolYear,
            });
          }
        }
      });

      isExist = this.listFilterPrograms.filter((x: any) => x.course == a.recNo);
      if (isExist.length === 0) {
        this.listFilterPrograms.push({
          course: a.recNo,
          program: a.program,
          isCheck: false,
          transId: null,
          schoolId: data.schoolId,
          schoolYear: data.schoolYear,
          setYear: data.items[0].setYear,
          munCityId: data.items[0].munCityId,
        });
      }
    });
    console.log('listFilterPrograms: ', this.listFilterPrograms);
  }

  AddSchool() {
    console.log(this.selectedCourse);
    this.service.AddListEducationTechVocStat(this.selectedCourse).subscribe({
      next: (request) => {
        this.GetListSchool();
      },
      error: (error) => {
        Swal.fire('Oops!', 'Something went wrong.', 'error');
      },
      complete: () => {
        if (!this.isCheck) {
          this.closebutton.nativeElement.click();
        }
        this.school = {};
        Swal.fire('Good job!', 'Data Added Successfully!', 'success');
      },
    });
  }

  EditSchool() {
    this.school.totalEnrolly =
      this.school.maleEnrolly + this.school.femaleEnrolly;
    this.school.totalGrad = this.school.maleGrad + this.school.femaleGrad;
    console.log(this.school);

    this.service.EditEducationTechVocStat(this.school).subscribe({
      next: (request) => {
        this.GetListSchool();
      },
      error: (error) => {
        Swal.fire('Oops!', 'Something went wrong.', 'error');
      },
      complete: () => {
        Swal.fire('Good job!', 'Data Updated Successfully!', 'success');
      },
    });
  }

  DeleteSchool(transId: any) {
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
        this.service
          .DeleteEducationTechVocStat(transId)
          .subscribe((request) => {
            this.GetListSchool();
          });
        const index = this.listFilterPrograms.findIndex(
          (x: any) => x.transId === transId
        );
        if (index !== -1) {
          this.listFilterPrograms[index].transId = null;
        }
        Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
      }
    });
  }
}
