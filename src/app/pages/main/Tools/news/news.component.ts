import { Component, OnInit } from '@angular/core';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { NewsService } from 'src/app/shared/Tools/news.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {

  constructor(private service:NewsService) { }
   
  title = 'angular';
  public Editor = ClassicEditor;
  public editorInstance: any;

  listData:any = [];
  data:any = {};      
  toValidate:any = {};
  isAdd:boolean = false;

  ngOnInit(): void {
    this.data.isAdmin = 0;
    this.data.hidden = 0;
    this.GetData();
  }

  onEditorReady(event: any) {
    console.log(event.config);
    this.editorInstance = event.editor;
  }

  GetData(){
    this.service.GetNews().subscribe({
      next: (response) =>
      {
        this.listData = (<any> response);
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

  AddData(){
    console.log(this.data);
    this.toValidate.title = this.data.title=="" || this.data.title ==undefined?true:false;
    this.toValidate.bodyContent = this.data.bodyContent=="" || this.data.bodyContent ==undefined?true:false;

    if(!this.toValidate.title && !this.toValidate.bodyContent)
    {
      if(this.data.isAdmin){
        this.data.isAdmin = 1
      }
      else
      {
        this.data.isAdmin = 0
      }
      if(this.data.hidden){
        this.data.hidden = 1
      }
      else
      {
        this.data.hidden = 0
      }
      this.service.AddNews(this.data).subscribe({
        next: (request) => {
          this.GetData();
        },
        error: (error) => {
          Swal.fire(
            'Oops!',
            'Something went wrong.',
            'error'
          );
        },
        complete: () => {
          Swal.fire(
            'Good job!',
            'Data Added Successfully!',
            'success'
          );
          this.clear();
        }
      }
      )
    }
    else
    {
      Swal.fire(
        '',
        'Please fill out the required fields.',
        'warning'
        );
    }
  }

  EditData(){
    if(this.data.isAdmin){
      this.data.isAdmin = 1
    }
    else
    {
      this.data.isAdmin = 0
    }
    if(this.data.hidden){
      this.data.hidden = 1
    }
    else
    {
      this.data.hidden = 0
    }
    this.service.EditNews(this.data).subscribe(
      {
        next: (request) => {
          this.GetData();
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
           Swal.fire(
            'Good job!',
            'Data Updated Successfully!',
            'success'
            );
        }
      }
    )
  }

  DeleteData(transId:any)
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
        this.service.DeleteNews(transId).subscribe(request => {
          this.GetData();
        })
        Swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        )
      }
    })
  }

  clear() {
    this.data.title = null;
    this.data.bodyContent = '';
    this.data.datePosted = null;
    this.data.lastUpdated = null;
    this.data.isAdmin = null;
    this.data.hidden = null;
    this.data.tag = null;
  }
}
