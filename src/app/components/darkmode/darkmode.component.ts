import { Component, OnInit } from '@angular/core';
import { DarkModeService } from 'angular-dark-mode';
import { Observable } from 'rxjs';
import { Dark_ModeService } from 'src/app/services/dark-mode.service';
@Component({
  selector: 'app-darkmode',
  templateUrl: './darkmode.component.html',
  styleUrls: ['./darkmode.component.css']
})
export class DarkmodeComponent {

  isChecked:boolean = false;

  darkMode$: Observable<boolean> = this.darkModeService.darkMode$;
  data:any = {};
  constructor(private darkModeService: DarkModeService, private dark_ModeService: Dark_ModeService) {}

  onToggle(): void {
    this.darkModeService.toggle();
    this.data = this.darkMode$.source?.source;
    this.isChecked = this.data._value;
    this.dark_ModeService.updateMyVariable(this.data._value);   
  }


}

