import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-validator',
  templateUrl: './validator.component.html',
  styleUrls: ['./validator.component.css']
})
export class ValidatorComponent implements OnInit {
  constructor(private Auth: AuthService) {}
  
  o_munCityId: any = ''; 
  munCityId: any = '';   

  ngOnInit(): void {
    this.o_munCityId = localStorage.getItem('o_munCityId'); 
    this.munCityId = localStorage.getItem('munCityId');    
  }

  
  isValidator(): boolean {
    
    return this.munCityId && this.munCityId.startsWith('Validator-');
  }
}