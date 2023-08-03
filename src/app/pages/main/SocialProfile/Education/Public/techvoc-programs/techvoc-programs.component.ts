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

@Component({
  selector: 'app-techvoc-programs',
  templateUrl: './techvoc-programs.component.html',
  styleUrls: ['./techvoc-programs.component.css'],
})
export class TechvocProgramsComponent implements OnInit {
  munCityName: string = this.auth.munCityName;
  constructor(
    private pdfService: PdfService,
    private reportService: ReportsService,
    private service: EducationTechVocStatService,
    private auth: AuthService,
    private modifyService: ModifyCityMunService
  ) {}

  modifyCityMun(cityMunName: string) {
    return this.modifyService.ModifyText(cityMunName);
  }

  toValidate: any = {};
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
  GeneratePDF() {
    let data: any = [];
    let reports: any = [];

    const dist1: any = [];
    const dist2: any = [];
    const contentData: any = [];

    this.pdfComponent.data.menuId = "program";

    this.reportService
      .GetEducationTechVocStatReport(this.pdfComponent.data)
      .subscribe({
        next: (response: any = {}) => {
          reports = response.data;
          console.log('result: ', response);

          reports.forEach((a: any, index: any) => {
            a.data.forEach((b: any, index2: any) => {
              const tableData: any = [];

              contentData.push([{ text: b.munCityName, bold: true }]);
              tableData.push([
                {
                  text: '#',
                  fillColor: 'black',
                  color: 'white',
                  bold: true,
                  alignment: 'center',
                },
                {
                  text: 'Program',
                  fillColor: 'black',
                  color: 'white',
                  bold: true,
                  alignment: 'center',
                },
              ]);

              b.munData.forEach((c: any, index3: any) => {
                tableData.push([
                  {
                    text: c.name,
                    fillColor: '#526D82',
                    //color: 'white',
                    bold: true,
                    alignment: 'center',
                    colSpan: 2,
                  },
                  {},
                ]);

                c.schoolData.forEach((d: any, index4: any) => {
                  tableData.push([
                    {
                      text: index4 + 1,
                      fillColor: '#ffffff',
                      bold: true,
                      alignment: 'left',
                      marginLeft: 5,
                    },
                    {
                      text: d.program,
                      fillColor: '#ffffff',
                      alignment: 'left',
                    },
                  ]);
                });
              });

              contentData.push([
                {
                  margin: [0, 10, 0, 10],
                  table: {
                    widths: [25, '*'],
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
          this.pdfService.GeneratePdf(data, isPortrait);
          console.log(data);
        },
      });
  }
  GetListSchool() {
    this.service
      .GetListEducationTechVocStat(this.setYear, this.munCityId)
      .subscribe({
        next: (response) => {
          this.listData = <any>response;
          console.log(this.listData);
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
    if (this.listData.length > 0) {
      this.schools.forEach((a: any) => {
        this.listData[0].schoolData.forEach((b: any) => {
          // console.log(b);

          if (a.recNo === b.schoolId) {
            console.log(b);
            isExist = this.listFilter.filter(
              (x: any) => x.schoolId === a.recNo
            );
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
    } else {
      this.schools.forEach((a: any) => {
        this.listFilter.push({
          schoolId: a.recNo,
          schoolYear: '',
          count: 1,
          items: [
            {
              name: a.name,
              setYear: a.setYear,
              munCityId: a.munCityId,
              isEmpty: true,
            },
          ],
        });
      });
    }
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
    this.service.EditEducationTechVocStat(this.school).subscribe({
      next: (request) => {
        this.GetListSchool();
      },
      error: (error) => {
        Swal.fire('Oops!', 'Something went wrong.', 'error');
      },
      complete: () => {
        // this.closebutton.nativeElement.click();
        Swal.fire('Good job!', 'Data Updated Successfully!', 'success');
        document.getElementById('mEducation')?.click();
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
