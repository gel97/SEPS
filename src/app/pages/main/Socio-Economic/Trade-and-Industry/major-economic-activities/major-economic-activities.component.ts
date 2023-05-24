import { MajorEconomicService } from './../../../../../shared/Trade&_Industry/major-economic.service';
import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-major-economic-activities',
  templateUrl: './major-economic-activities.component.html',
  styleUrls: ['./major-economic-activities.component.css']
})
export class MajorEconomicActivitiesComponent implements OnInit {


  constructor( private service:MajorEconomicService, private auth:AuthService) { }
  munCityName:string = this.auth.munCityName;

  toValidate:any={};
  MajorAct:any=[];
  mjr:any={};
  editmodal:any={};
  searchText: string= "";

  isCheck: boolean = false;
  visible: boolean = true;
  not_visible: boolean = true;

  @ViewChild('closebutton')
  closebutton!: { nativeElement: { click: () => void; }; };

  onChange(isCheck: boolean) {
    this.isCheck = isCheck;
    console.log("isCheck:", this.isCheck);
  }

  clearData() {
    this.mjr = {};
    this.not_visible = false;
    this.visible = true;
    // this.required = false;
  }


pageSize = 10;
p: string|number|undefined;
count: number =1;
tableSize:number = 20;
tableSizes:any =[20,40,60,80,100];



  date = new DatePipe('en-PH')
  ngOnInit(): void {

  this.Init();
 }


 Init(){
  this.service.GetMajorEco().subscribe(data=>{
    console.log(data)
  this.MajorAct=(<any>data);
  this.MajorAct=this.MajorAct.filter((s:any) => s.tag == 1);
  console.log(this. MajorAct)


 })
}

//searchBar
onChangeSearch(e:any) {
  this.searchText = e.target.value;

  }


  AddMajorAct(){
    this.toValidate.mjrActivity = this.mjr.mjrActivity=="" || this.mjr.mjrActivity ==undefined?true:false;
    this.toValidate.description = this.mjr.description =="" || this.mjr.description == undefined?true:false;

    if (this.toValidate.mjrActivity == true||this.toValidate.description ==true){
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields',
        'warning'
      );
    }else{
    this.mjr.munCityId=this.auth.munCityId;
    this.mjr.setYear=this.auth.setYear;
    this.mjr.transId = this.date.transform(Date.now(),'YYMM');
    this.mjr.tag = 1;
    this.service.AddMajorEco(this.mjr).subscribe(request=>{
      if (!this.isCheck) {
        this.closebutton.nativeElement.click();
      }
      console.log(request);
      this.clearData();
      this.Init();

      console.log(request);
      Swal.fire(
        'Good job!',
        'Data Added Successfully!',
        'success'
      );
      //document.getElementById('close')?.click();
      this.mjr = {};
      this.MajorAct.push(request);
    },);
  }
  }

  editmajor(editmajor:any={}) {
    this.editmodal=editmajor;
    this.Init();
    }

  //for modal
  UpdateMajorAct(){
  this.toValidate.mjrActivity = this.editmodal.mjrActivity=="" || this.editmodal.mjrActivity ==undefined?true:false;
  this.toValidate.description = this.editmodal.description =="" || this.editmodal.description == undefined?true:false;

  if (this.toValidate.mjrActivity == true||this.toValidate.description ==true){
    Swal.fire(
      'Missing Data!',
      'Please fill out the required fields',
      'warning'
    );
  }else{

    this.service.UpdateMajorEco(this.editmodal).subscribe({next:(_data)=>{
      this.Init();
    },
    });

    Swal.fire({
    position: 'center',
    icon: 'success',
    title: 'Your work has been updated',
    showConfirmButton: false,
    timer: 1000
    });
    document.getElementById("ModalEdit")?.click();
    this.editmodal ={};
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
          for(let i = 0; i < this.MajorAct.length;i++){
            if(this.MajorAct[i].transId == transId){
              this.MajorAct.splice(i,1);
              Swal.fire(
                'Deleted',
                'Removed successfully',
                'success'
              );
            }
          }


          this.service.DeleteMajorEco(transId).subscribe(_data =>{

           // this.MajorAct.splice(index,1);
            this.Init();
            // this.mjr = {};

          })
        } else if (result.dismiss === Swal.DismissReason.cancel){

        }
          // this.Init();
          // this.mjr = {};

      })
    }

    onTableDataChange(page:any){ //paginate
      console.log(page)
      this.p = page;
      this.Init();

    }
    onTableSizeChange(event:any ){ //paginate
      this.tableSize = event. target.value;
      this.p = 1;
      this.Init();

    }

}
