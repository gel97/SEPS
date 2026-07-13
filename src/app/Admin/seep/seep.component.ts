import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-seep',
  templateUrl: './seep.component.html',
  styleUrls: ['./seep.component.css']
})
export class SEEPComponent implements OnInit {

  constructor(private Auth: AuthService) { }
  @Input() mode: string = 'show';

  isLguUser: boolean = true;

  ngOnInit(): void {
  const munCityId = this.Auth.munCityId || localStorage.getItem('munCityId');
  const userType = localStorage.getItem('userType');
  const o_munCityId = this.Auth.o_munCityId || localStorage.getItem('o_munCityId');

  // I-add ni para makita nimo ang agi sa F12 Console habig sa browser
  console.log("SEEP Check -> munCityId:", munCityId, "userType:", userType, "o_munCityId:", o_munCityId);

  if (
    !munCityId || 
    munCityId === 'undefined' || 
    munCityId === 'null' || 
    munCityId === 'UNKNOWN' ||
    munCityId.toString().toUpperCase().includes('UNKNOWN') || // check kung naay 'UNKNOWN'
    o_munCityId === 'Guest' || 
    userType === 'NGA'
  ) {
    this.isLguUser = false; // Moadto sa Under Development template
  } else {
    this.isLguUser = true;  // Ipakita ang tinuod nga menu content
  }

  console.log("Final isLguUser Status:", this.isLguUser);
}

}


