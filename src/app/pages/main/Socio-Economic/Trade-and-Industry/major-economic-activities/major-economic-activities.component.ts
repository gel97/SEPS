import { MajorEconomicService } from './../../../../../shared/Trade&_Industry/major-economic.service';
import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-major-economic-activities',
  templateUrl: './major-economic-activities.component.html',
  styleUrls: ['./major-economic-activities.component.css']
})
export class MajorEconomicActivitiesComponent implements OnInit {


  constructor( private service:MajorEconomicService, private auth:AuthService) { }
  MajorAct:any=[];
  mjr:any={};
  editmodal:any={};

  // Pagination
  pageSize = 25;
  p: string|number|undefined;
  count: number =0;
  tableSize:number = 5;
  tableSizes:any =[5,10,15,25,50,100];

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


  AddMajorAct(){
    this.mjr.munCityId=this.auth.munCityId;
    this.mjr.setYear=this.auth.setYear;
    this.mjr.transId = this.date.transform(Date.now(),'YYMM');
    this.mjr.tag = 1;
    this.service.AddMajorEco(this.mjr).subscribe(request=>{
      console.log(request);
      Swal.fire(
        'Good job!',
        'Data Added Successfully!',
        'success'
      );

      this.mjr = {};
      this.MajorAct.push(request);
    },err=>{
      Swal.fire(
        'ERROR!',
        'Error',
        'error'
      );
    });
  }


  editmajor(editmajor:any={}) {
    this.editmodal=editmajor;
    this.Init();
    }

  //for modal
  UpdateMajorAct(){
    this.service.UpdateMajorEco(this.editmodal).subscribe({next:(_data)=>{
    },
    });

    Swal.fire({
    position: 'center',
    icon: 'success',
    title: 'Your work has been updated',
    showConfirmButton: false,
    timer: 1000
    });
    this.editmodal ={};
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
            }
          }


          this.service.DeleteMajorEco(transId).subscribe(_data =>{
            Swal.fire(
              'Deleted',
              'Removed successfully',
              'success'
            );
           // this.MajorAct.splice(index,1);

            // this.Init();
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
