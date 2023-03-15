import { SkVoterService } from './../../../../shared/Governance/sk-voter.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sk-voters',
  templateUrl: './sk-voters.component.html',
  styleUrls: ['./sk-voters.component.css']
})
export class SkVotersComponent implements OnInit {

constructor(private service:SkVoterService , private auth:AuthService ) { }
Voter:any=[];
voter:any={};
editmodal:any={};

date = new DatePipe('en-PH')
ngOnInit(): void {
this.Init(
);
}
  Init(){
    this.voter.munCityId=this.auth.munCityId;
    this.service.GetSKVoter().subscribe(data=>{

     this.Voter=(<any>data);
     console.log(this.Voter)
    })
 }

 addVoter() {
  this.voter.munCityId=this.auth.munCityId;
  this.service.AddSKVoter(this.voter).subscribe(_data=>{
    // alert("success");
    Swal.fire(
      'Good job!',
      'Data Added Successfully!',
      'success'
    );
    this.Init();
    this.voter = {};

  },_err=>{
    Swal.fire(
      'ERROR!',
      'Error',
      'error'
    );

    this.Init();
    this.voter= {};
  });
}

editdemo(editdemo:any={}) {
  this.editmodal=editdemo;
    //passing the data from table (modal)
  this.Init();
  }

//for modal
updateVoter(){
  this.service.UpdateSKVoter(this.editmodal).subscribe({next:(_data)=>{
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



}
