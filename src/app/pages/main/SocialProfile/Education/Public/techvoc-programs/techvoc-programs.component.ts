import { Component, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { GmapComponent } from 'src/app/components/gmap/gmap.component';
import { AuthService } from 'src/app/services/auth.service';
import { ModifyCityMunService } from 'src/app/services/modify-city-mun.service';
import { EducationTechVocStatService } from 'src/app/shared/SocialProfile/Education/educationTechVocStat.service';
import { isNgTemplate } from '@angular/compiler';
@Component({
  selector: 'app-techvoc-programs',
  templateUrl: './techvoc-programs.component.html',
  styleUrls: ['./techvoc-programs.component.css']
})
export class TechvocProgramsComponent implements OnInit {

  munCityName: string = this.auth.munCityName;
  constructor(
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
  isCheck: boolean = false;
  onChange(isCheck: boolean) {
    this.isCheck = isCheck;
  }

  onChangePrograms(item: any = {}){
    console.log(item)
    if(item.transId !== null){
      this.DeleteSchool(item.transId);
    }
    else{
      let isExist;
      isExist = this.selectedCourse.filter((x: any) => x.course === item.course);
          if (isExist.length === 0) {
            this.selectedCourse.push(item);
          }
          else{
            const index = this.selectedCourse.findIndex((x: any) => x.course === item.course);
            if (index !== -1) {
              this.selectedCourse.splice(index, 1);
            }
          }

      console.log("selectedCourse: ", this.selectedCourse);
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
  selectedCourse:any = [];
  schoolName:any = "";
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
          this.GetListTechVoc()
        },
      });
  }

  GetListTechVoc(){
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

  GetListPrograms(){
    this.service
      .GetListEducationTechVocPrograms()
      .subscribe({
        next: (response) => {
          this.programs = <any>response;
          console.log(this.programs);
        },
        error: (error) => {
          Swal.fire('Oops!', 'Something went wrong.', 'error');
        },
        complete: () => {
        },
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
          'schoolId': a.recNo,
          'schoolYear': this.listData[0].schoolData[0].items[0].schoolYear,         
          'count': 1,
          'items': [
            {
              'name': a.name,
              'setYear': this.listData[0].schoolData[0].items[0].setYear,
              'munCityId': this.listData[0].schoolData[0].items[0].munCityId,
              'isEmpty': true
            }
          ]
        });
      }
    });
    console.log("mergeList: ", this.listFilter);

  }

  FilterPrograms(data:any = {}){
    console.log(data);
    this.schoolName = data.items[0].name;
    let isExist;
    this.listFilterPrograms = [];
    this.programs.forEach((a: any) => {
      data.items.forEach((b: any) => {
        if (a.recNo === b.course) {
          isExist = this.listFilterPrograms.filter((x: any) => x.course === a.recNo);
          if (isExist.length === 0) {
            this.listFilterPrograms.push({
              'course': a.recNo,
              'program': a.program, 
              'isCheck': true,
              'transId': b.transId,
              'setYear': b.setYear,
              'munCityId': b.munCityId,
              'schoolId': b.schoolId,
              'schoolYear': b.schoolYear  
            });
          }
        }
      });

      isExist = this.listFilterPrograms.filter((x: any) => x.course == a.recNo);
      if (isExist.length === 0) {
        this.listFilterPrograms.push({
          'course': a.recNo,
          'program': a.program, 
          'isCheck': false,
          'transId': null,
          'schoolId': data.schoolId,
          'schoolYear': data.schoolYear,
          'setYear': data.items[0].setYear,
          'munCityId': data.items[0].munCityId,   
        });
      }
    });
    console.log("listFilterPrograms: ", this.listFilterPrograms);
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
        this.service.DeleteEducationTechVocStat(transId).subscribe((request) => {
          this.GetListSchool();
        });
        const index = this.listFilterPrograms.findIndex((x: any) => x.transId === transId);
        if (index !== -1) {
          this.listFilterPrograms[index].transId = null;
        }
        Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
      }
    });
  }
}
