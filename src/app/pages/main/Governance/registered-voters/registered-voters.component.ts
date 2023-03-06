import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RegVoterService } from './../../../../shared/Governance/reg-voter.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registered-voters',
  templateUrl: './registered-voters.component.html',
  styleUrls: ['./registered-voters.component.css']
})

export class RegisteredVotersComponent implements OnInit {

constructor(private service:RegVoterService , private auth:AuthService ) { }
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
    this.service.GetRegVoter().subscribe(data=>{

     this.Voter=(<any>data);
     console.log(this.Voter)
    })
 }

 addVoter() {
  this.voter.munCityId=this.auth.munCityId;
  this.service.AddRegVoter(this.voter).subscribe(_data=>{
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
  this.service.UpdateRegVoter(this.editmodal).subscribe({next:(_data)=>{
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
