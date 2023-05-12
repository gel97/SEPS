import { Component, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { GmapComponent } from 'src/app/components/gmap/gmap.component';
import { AuthService } from 'src/app/services/auth.service';
import { EducationService } from 'src/app/shared/SocialProfile/Education/education.service';
@Component({
  selector: 'app-training-center',
  templateUrl: './training-center.component.html',
  styleUrls: ['./training-center.component.css']
})
export class TrainingCenterComponent implements OnInit {
  menuId:string = "8";
  munCityName:string = this.auth.munCityName;
  constructor(private service: EducationService, private auth: AuthService) { }

  toValidate:any = {};
  @ViewChild(GmapComponent)
  private gmapComponent!: GmapComponent;
  @ViewChild('closebutton')
  closebutton!: { nativeElement: { click: () => void; }; };
  isCheck: boolean = false;
  onChange(isCheck: boolean) {
    this.isCheck = isCheck;
  }

  markerObj: any = {};

  SetMarker(data: any = {}) {
    this.markerObj = {
      lat: data.latitude,
      lng: data.longtitude,
      label: data.brgyName.charAt(0),
      brgyName: data.brgyName,
      munCityName: this.munCityName,
      draggable: true
    };

    this.gmapComponent.setMarker(this.markerObj);
  }

  ngOnInit(): void {
    this.Init();
  }
  munCityId:string = this.auth.munCityId;
  setYear:string = this.auth.setYear;

  isAdd:boolean = true;
  listSchool:any = [];
  school:any = {};
  listBarangay:any = [];

  Init()
  {
    this.GetListBarangay();
    this.GetListSchool();
  }

  GetListBarangay()
  {
    this.service.ListOfBarangay(this.auth.munCityId).subscribe(data => {
      this.listBarangay = (<any>data);
    })
  }

  GetListSchool()
  {
    this.service.GetListEducation(this.menuId, this.setYear, this.munCityId).subscribe({
      next: (response) =>
      {
        this.listSchool = (<any> response);
      },
      error: (error) =>
      {
        Swal.fire(
          'Oops!',
          'Something went wrong.',
          'error'
          );
      },
      complete: () =>
      {

      }
    })

  }

  AddSchool()
  {
    this.toValidate.name = this.school.name=="" || this.school.name ==undefined?true:false;
    this.toValidate.schoolId = this.school.schoolId=="" || this.school.schoolId ==undefined?true:false;
    this.toValidate.teacherNo = this.school.teacherNo=="" || this.school.teacherNo ==undefined?true:false;
    this.toValidate.classroomNo = this.school.classroomNo=="" || this.school.classroomNo ==undefined?true:false;
    this.toValidate.classesNo = this.school.classesNo=="" || this.school.classesNo ==undefined?true:false;
    this.toValidate.brgyId = this.school.brgyId=="" || this.school.brgyId ==null?true:false;
    this.toValidate.enrollyNo = this.school.enrollyNo=="" || this.school.enrollyNo ==undefined?true:false;

    this.school.menuId    = this.menuId;
    this.school.setYear   = this.setYear;
    this.school.munCityId = this.munCityId;

    if(!this.toValidate.name && !this.toValidate.brgyId && !this.toValidate.schoolId && !this.toValidate.teacherNo && !this.toValidate.classroomNo && !this.toValidate.classesNo && !this.toValidate.enrollyNo)
    {
      this.service.AddEducation(this.school).subscribe(
        {
          next: (request) => {
            this.GetListSchool();
          },
          error:(error)=>{
            Swal.fire(
              'Oops!',
              'Something went wrong.',
              'error'
              );
          },
          complete: () =>
          {
            if (!this.isCheck) {
              this.closebutton.nativeElement.click();
            }
            this.school = {};
             Swal.fire(
              'Good job!',
              'Data Added Successfully!',
              'success'
              );
          }
        }
      )
    }
    else
    {
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields.',
        'warning'
        );
    }


  }

  EditSchool()
  {
    this.toValidate.name = this.school.name=="" || this.school.name ==undefined?true:false;
    this.toValidate.schoolId = this.school.schoolId=="" || this.school.schoolId ==undefined?true:false;
    this.toValidate.teacherNo = this.school.teacherNo=="" || this.school.teacherNo ==undefined?true:false;
    this.toValidate.classroomNo = this.school.classroomNo=="" || this.school.classroomNo ==undefined?true:false;
    this.toValidate.classesNo = this.school.classesNo=="" || this.school.classesNo ==undefined?true:false;
    this.toValidate.brgyId = this.school.brgyId=="" || this.school.brgyId ==null?true:false;
    this.toValidate.enrollyNo = this.school.enrollyNo=="" || this.school.enrollyNo ==undefined?true:false;

    this.school.longtitude = this.gmapComponent.markers.lng;
    this.school.latitude  = this.gmapComponent.markers.lat;

    this.school.menuId    = this.menuId;
    this.school.setYear   = this.setYear;
    this.school.munCityId = this.munCityId;

    if(!this.toValidate.name && !this.toValidate.brgyId && !this.toValidate.schoolId && !this.toValidate.teacherNo && !this.toValidate.classroomNo && !this.toValidate.classesNo && !this.toValidate.enrollyNo)
    {
    this.service.EditEducation(this.school).subscribe(
      {
        next: (request) => {
          this.GetListSchool();
        },
        error:(error)=>{
          Swal.fire(
            'Oops!',
            'Something went wrong.',
            'error'
            );
        },
        complete: () =>
        {
          this.closebutton.nativeElement.click();
           Swal.fire(
            'Good job!',
            'Data Updated Successfully!',
            'success'
            );
            this.school={};
        }
      }
    )
  }
  else
  {
    Swal.fire(
      'Missing Data!',
      'Please fill out the required fields.',
      'warning'
      );
  }

  }

  DeleteSchool(transId:any)
  {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.DeleteEducation(transId).subscribe(request => {
          this.GetListSchool();
        })
        Swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        )
      }
    })
  }
}
