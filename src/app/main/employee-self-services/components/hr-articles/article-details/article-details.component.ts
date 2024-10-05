import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { HRArticleService } from 'src/app/main/console/services/hr-article.service';
import { HeaderService } from 'src/app/services/header.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-article-details',
  templateUrl: './article-details.component.html',
  styleUrls: ['./article-details.component.css']
})
export class ArticleDetailsComponent implements OnInit {

  imageBaseUrl = environment.imageBaseUrl;
  currentId = 0;
  articleDetails: any = {};
  constructor(private _hS: HeaderService, private spinner: NgxSpinnerService, private _aR: ActivatedRoute, private _articleS: HRArticleService) {
    this.initInspectElementBlocker();
  }
  @HostListener('contextmenu', ['$event'])
  onRightClick(event: Event): void {
    event.preventDefault();
  }

  @HostListener('copy', ['$event'])
  onCopy(event: Event): void {
    event.preventDefault();
  }
  private initInspectElementBlocker(): void {
    window.addEventListener('keydown', (event) => {
      if (event.keyCode === 123) {
        event.preventDefault();
      }
    });
  }
  ngOnInit(): void {
    this._hS.updateHeaderData({
      title: 'HR Article',
      tabs: [{ title: 'HR Article Detail', url: 'connect/employee-self-services/hr-articles', isActive: true }],
      isTab: false,
    })
    this.getArticleDetails();
  }
  getArticleDetails() {
    this._aR.params.subscribe((params) => {
      console.log(params);
      this.currentId = params['id'];
      if (this.currentId !== 0 && this.currentId !== undefined) {
        this._articleS.getArticleById(this.currentId).subscribe((res) => {
          this.articleDetails = res.data;
        })
      }
    })
  }
}
