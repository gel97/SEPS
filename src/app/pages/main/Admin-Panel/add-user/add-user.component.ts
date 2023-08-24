import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/Tools/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {

  constructor(private service: UserService) { }

  ngOnInit(): void {
    this.service.ListMunCity().subscribe(data=>{
      this.list_muncity =(<any>data);         
     });
  }

  isLoading:boolean = false;
  isLoadingSubmit:boolean = false;

  errorUname:boolean = true;
  user:any = {};

  toValidate:any={};
  list_muncity:any = {};

  password: string = '';
  passwordVisible: boolean = false;

  AddUser(){
    this.isLoadingSubmit = true;
    this.toValidate.username = this.user.username == '' || this.user.username == null || this.user.username < 8 || this.errorUname ? true : false;
    this.toValidate.password = this.user.password == '' || this.user.password == null ? true : false;
    this.toValidate.confirmPassword = this.user.confirmPassword == '' || this.user.confirmPassword == null ? true : false;
    this.toValidate.fullName = this.user.fullName == '' || this.user.fullName == null ? true : false;
    this.toValidate.munCityId = this.user.munCityId == '' || this.user.munCityId == null ? true : false;

    console.log(this.toValidate)
    if(!this.errorUname && 
      !this.toValidate.username &&
      !this.toValidate.password &&
      !this.toValidate.confirmPassword &&
      !this.toValidate.fullName &&
      !this.toValidate.munCityId ){

        Swal.fire({
          title: 'Are you sure?',
          text: "",
          icon: 'info',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, submit it!'
        }).then((result) => {
          console.log(result)
          if (result.isConfirmed) {
            this.user.designation = ""; //temp
            this.service.AddUser(this.user).subscribe({
              next: (response:any) => {
                console.log(response)
                this.user={};
                const Toast = Swal.mixin({
                  toast: true,
                  position: 'top-end',
                  showConfirmButton: false,
                  timer: 3000,
                  timerProgressBar: true,
                  didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer);
                    toast.addEventListener('mouseleave', Swal.resumeTimer);
                  },
                });
      
                Toast.fire({
                  icon: 'success',
                  title: 'Added successfully',
                });
                this.isLoadingSubmit = false;

              },
              error: (error) => {
                  const Toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                      toast.addEventListener('mouseenter', Swal.stopTimer);
                      toast.addEventListener('mouseleave', Swal.resumeTimer);
                    },
                  });     
                  Toast.fire({
                    icon: 'error',
                    title: 'Something went wrong!',
                  });
                this.isLoadingSubmit = false;
              },
              complete: () => {},
            }); 
          }
          else{
            this.isLoadingSubmit = false;
          }
        })

        

    }
    else{
      this.isLoadingSubmit = false;

    }
   
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  CheckIfnotempty(value:string) {
    if(value !== null || value !==""){
      this.toValidate.munCityId=false
    }
  }
  
  usernameError:any="";
  UsernameCheck(username:string){
    console.log(username.length)

    if(username.length>= 8){
      this.isLoading = true
      this.service.UsernameCheck(username).subscribe({
        next: (response:any) => {
          console.log(response)
        },
        error: (error) => {
          if(error.status == 200){
            this.errorUname = false;
            this.toValidate.usernameCheck = false;
          }  
          else{
            this.errorUname = true;
            this.toValidate.usernameCheck = true;
  
          }   
          this.isLoading = false;
        },
        complete: () => {},
      });
    }else{
      this.errorUname = true;
    } 
  }

}
