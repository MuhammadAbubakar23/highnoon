import { Component } from '@angular/core';
import { MenuService } from '../../services/menu.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { HeaderService } from 'src/app/services/header.service';
import { ToasterService } from 'src/app/services/toaster.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {
  pageNumber = 1;
  pageSize = 10;
  totalPages = 0;
  totalRecords = 0;
  text = '';
  menuItems: any = [];
  desColumns = ["name", "displayName", "routeName", "description", "permission"];
  columnNames = ['Name', 'Display Name', 'Route Name', 'Description', 'Permission'];
  toastData: any = {};
  constructor(private _menuS: MenuService, private _r: Router, private _toastS: ToasterService
    , private _hS: HeaderService, private spinner: NgxSpinnerService) {
    _hS.updateHeaderData({
      title: 'Menu',
      tabs: [{ title: '', url: '', isActive: true }],
      isTab: false,
    })

  }
  ngOnInit(): void {
    this.getMenu();
  }

  getMenu() {
    //this.spinner.show();
    this._menuS.getMenus(this.pageNumber, this.pageSize, this.text).subscribe((res) => {
      this.menuItems = res.data;
      this.totalPages = res.totalPages;
      this.totalRecords = res.totalRecords;
      //this.spinner.hide();
    })
  }
  resetinput(){
    this.text='';
    this.getMenu();
  }
  generalFilter() {
    this.getMenu();
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
      this.getMenu();
    }
  }

  nextPage(): void {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
      this.getMenu();
    }
  }
  changePage(page: number): void {
    if (page !== -1) {
      this.pageNumber = page;
      this.getMenu();
    }
  }


  editMenu(id: number) {
    this._r.navigateByUrl(`/connect/console/update-menu/${id}`);
  }
  deleteMenu(id: any) {
    
    this._menuS.deleteMenu(id).subscribe((res) => {
      if (res.statusCode === 200) {
        // const menus = this.menuItems.filter((item: any) => item.menuId !== id);
        // this.menuItems = menus;
        this.getMenu();
        const toasterObject = { isShown: true, isSuccess: true, toastHeading: "Deleted", toastParagrahp: "Menu Deleted Successfully!" }
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
