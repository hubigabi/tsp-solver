import {Component, OnInit} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'tsp-solver-frontend';

  constructor(private titleService: Title,
              private translateService: TranslateService) {
  }

  ngOnInit(): void {
    this.setTitle();

    this.translateService.onLangChange.subscribe(() => {
      this.setTitle();
    });
  }

  private setTitle() {
    this.translateService.get('PageTitle').subscribe((title: string) => {
      this.titleService.setTitle(title);
    });
  }

}
