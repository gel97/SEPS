import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Dark_ModeService } from 'src/app/services/dark-mode.service';
@Component({
  selector: 'app-page-container',
  templateUrl: './page-container.component.html',
  styleUrls: ['./page-container.component.css']
})
export class PageContainerComponent implements OnInit {

  constructor(private DarkModeService: Dark_ModeService) { }

  dark_mode:boolean = this.DarkModeService.darkMode;
  ngOnInit(): void {
    this.dark_mode = this.DarkModeService.darkMode;
    this.DarkModeService.getMyVariable().subscribe((value: boolean) => {
      this.dark_mode = value;
    });
  }

}
