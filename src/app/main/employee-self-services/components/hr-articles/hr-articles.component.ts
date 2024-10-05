import { Component, HostListener, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { HRArticleService } from 'src/app/main/console/services/hr-article.service';
import { HRPolicyService } from 'src/app/main/console/services/hr-policy.service';
import { HeaderService } from 'src/app/services/header.service';
import { ToasterService } from 'src/app/services/toaster.service';
import { MenuPermissionService } from 'src/app/shared/services/menu-permission.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-hr-articles',
  templateUrl: './hr-articles.component.html',
  styleUrls: ['./hr-articles.component.css']
})
export class HrArticlesComponent {
  @Input() isTabs: boolean = true;
  pageNumber = 1;
  pageSize = 10;
  totalPages = 0;
  totalRecords = 0;
  text = ""
  imageBaseUrl = environment.imageBaseUrl;
  articleItems: any = [];
  desColumns = ['attachmentName', 'modifiedDate', ''];
  columnNames = ['Name', 'LAST MODIFIED'];

  constructor(private _hS: HeaderService, private _toastS: ToasterService, private spinner: NgxSpinnerService,
     private _route: Router, private _articleS: HRArticleService,private _per: MenuPermissionService) {
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

    if (this.isTabs === true) {
      let tabs = [];
      let isTabActive = true;
      if (this._per.hasPermission('HR Policies')) {
        tabs.push({ title: 'Articles', url: 'connect/employee-self-services/hr-articles', isActive: true }, { title: 'Policies', url: 'connect/employee-self-services/hr-policies', isActive: false })
      }
      else {
        this._route.navigateByUrl('/connect/dashborad/my-dashboard');
      }

      this._hS.updateHeaderData({
        title: 'HR Articles',
        tabs: tabs,
        isTab: isTabActive,
      })
    }
    this.getArticles();
  }


  generalFilter() {

  }

  getArticles() {
    this.spinner.show();
    this._articleS.getAllArticles(this.pageNumber, this.pageSize).subscribe((res) => {
      // res.data.forEach(element => {
      //   if (element.modifiedDate === null) {
      //     element.modifiedDate = element.createdDate
      //   }

      // });
      this.articleItems = res.data;
      this.totalPages = res.totalPages;
      this.totalRecords = res.totalRecords;
      this.spinner.hide();
    })
  }
  visiblePages(): number[] {
    const currentPage = this.pageNumber;
    const totalPages = this.totalPages;
    let visiblePageNumbers: number[] = [];
    visiblePageNumbers.push(1);
    if (currentPage - 2 > 2) {
      visiblePageNumbers.push(-1);
    }

    for (let i = Math.max(2, currentPage - 2); i <= Math.min(totalPages - 1, currentPage + 2); i++) {
      visiblePageNumbers.push(i);
    }
    if (currentPage + 2 < totalPages - 1) {
      visiblePageNumbers.push(-1);
    }
    if (totalPages > 1) {
      visiblePageNumbers.push(totalPages);
    }

    return visiblePageNumbers;
  }

  prevPage(): void {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.getArticles();
    }
  }

  nextPage(): void {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
      this.getArticles();
    }
  }
  changePage(page: number): void {
    if (page !== -1) {
      this.pageNumber = page;
      this.getArticles();
    }
  }

  editPolicy(id: number) {
    this._route.navigateByUrl(`/connect/console/update-policies-articles/${id}`);
  }
  getArticle(id: number) {
    this._route.navigateByUrl(`/connect/employee-self-services/hr-articles/handbookdetail/${id}`);
  }
  deletePolicy(id: any) {

    this._articleS.deleteArticle(id).subscribe((res) => {
      if (res.statusCode === 200) {
        // const locations = this. articleItems.filter((item: any) => item.locationId !== id);
        // this. articleItems = locations;
        this.getArticles();
        const toasterObject = { isShown: true, isSuccess: true, toastHeading: "Deleted", toastParagrahp: "Article Deleted Successfully!" }
        this._toastS.updateToastData(toasterObject)

        this._toastS.hide();
      }
    }, (error: any) => {
      console.error("Internal Server Error", error);
      const toasterObject = { isShown: true, isSuccess: false, toastHeading: "Failed", toastParagrahp: "Internal Server Error!" }
      this._toastS.updateToastData(toasterObject)
      this._toastS.hide();
    })

  }
}



