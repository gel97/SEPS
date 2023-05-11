import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DemographyService } from 'src/app/shared/Governance/demography.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-demography',
  templateUrl: './demography.component.html',
  styleUrls: ['./demography.component.css']
})
export class DemographyComponent implements OnInit {
  // DemographyService: any;

  constructor(private service:DemographyService, private auth:AuthService) { }
  demo:any={};
  Demo:any=[];
  editmodal:any={};
  ViewBarangayOfficial:any={};
  barangays:any={};
  toValidate:any={};
  munCityName:string = this.auth.munCityName;

  isLoading: boolean = true;
  isCheck: boolean = false;
  visible: boolean = true;
  not_visible: boolean = true;

  @ViewChild('closebutton')
  closebutton!: { nativeElement: { click: () => void; }; };

  onChange(isCheck: boolean) {
    this.isCheck = isCheck;
    console.log("isCheck:", this.isCheck);
  }


  date = new DatePipe('en-PH')
  ngOnInit(): void {

  this.Init();
  this.list_of_barangay();


 }

  Init(){
     this.demo.munCityId=this.auth.munCityId;
     this.demo.setYear=this.auth.activeSetYear;
     this.service.GetDemography().subscribe(data=>{
      this.Demo=(<any>data);
      this.Demo.sort((n1:any,n2:any)=>{ //order by Descending
        if(n1.setYear<n2.setYear)return 1;
        if(n1.setYear>n2.setYear)return -1;
        else return 0;
      })
      console.log(this.Demo)
     })
  }

  list_of_barangay(){
    this.service.ListBarangay().subscribe(data=>{
      this.barangays = <any>data;
      console.log("fgxtxgcvcgcf",this.barangays)
    });
    }

  AddDemo() {
    this.toValidate.brgyId = this.demo.brgyId == "" || this.demo.brgyId == null ? true : false;
    this.toValidate.householdPop = this.demo.householdPop == "" || this.demo.householdPop == undefined ? true : false;
    this.toValidate.male = this.demo.male == "" || this.demo.male == undefined ? true : false;
    this.toValidate.female = this.demo.female == "" || this.demo.female == undefined ? true : false;

    if (this.toValidate.brgyId  == true || this.toValidate.householdPop== true || this.toValidate.male == true || this.toValidate.female == true) {
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields',
        'warning'
      );
    } else {

    this.demo.munCityId=this.auth.munCityId;
    this.demo.setYear=this.auth.activeSetYear;
    this.service.AddDemography(this.demo).subscribe(_data=>{
      if (!this.isCheck) {
        this.closebutton.nativeElement.click();
      }
      console.log(_data);
      this.clearData();
      this.Init();

      Swal.fire(
        'Good job!',
        'Data Added Successfully!',
        'success'
      );
      this.Init();
      this.demo = {};

    },err=>{
      Swal.fire(
        'ERROR!',
        'Error',
        'error'
      );

      this.Init();
      this.demo = {};
    });
  }
  }
  clearData() {
    this.demo = {};
    this.not_visible = false;
    this.visible = true;
    // this.required = false;
  }

  editdemo(editdemo:any={}) {
    this.editmodal=editdemo;
      //passing the data from table (modal)
    this.Init();
    }

  //for modal
  update(){
    this.toValidate.brgyId = this.editmodal.brgyId == "" || this.editmodal.brgyId == null ? true : false;
    this.toValidate.householdPop = this.editmodal.householdPop == "" || this.editmodal.householdPop == undefined ? true : false;
    this.toValidate.male = this.editmodal.male == "" || this.editmodal.male == undefined ? true : false;
    this.toValidate.female = this.editmodal.female == "" || this.editmodal.female == undefined ? true : false;

    if (this.toValidate.brgyId  == true || this.toValidate.householdPop== true || this.toValidate.male==true || this.toValidate.female==true) {
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields',
        'warning'
      );
    } else {
    this.service.UpdateDemography(this.editmodal).subscribe((_data)=>{
      if (!this.isCheck) {
        this.closebutton.nativeElement.click();
      }
      this.clearData();
      this.Init();

      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Your work has been updated',
        showConfirmButton: false,
        timer: 1000
        });
    this.Init();
    },
    );


    }
  }

delete(transId:any, index:any){
      Swal.fire({
        text: 'Do you want to remove this file?',
        icon: 'warning',
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: 'Yes, remove it!'
      }).then((result)=>{

        if(result.value){
          for(let i = 0; i < this.Demo.length;i++){
            if(this.Demo[i].transId == transId){
              this.Demo.splice(i,1);
              Swal.fire(
                'Deleted!',
                'Your file has been removed.',
                'success'
              );
            }
          }

          this.service.DeleteDemography(transId).subscribe(_data =>{

          })
        } else if (result.dismiss === Swal.DismissReason.cancel){

        }


      })
    }



}
