import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver'; 

@Injectable({
  providedIn: 'root'
})
export class CsvService {

  constructor() { }

  exportToCsv(data: any[], filename: string) {
    const csvContent = this.convertArrayToCsv(data);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, filename);
  }

  private convertArrayToCsv(data: any[]): string {
    const keys = Object.keys(data[0]);
    const header = keys.join(',') + '\n';
    const rows = data.map(row => {
      return keys.map(key => {
        return row[key];
      }).join(',');
    }).join('\n');
    return header + rows;
  }
}
