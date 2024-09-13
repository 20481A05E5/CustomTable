import { Component, Injector, TemplateRef, ViewChild } from '@angular/core';
import {GridDataService} from '../../grid-data.service'
import { Constants, CustomColumn } from '../../../../src/constant'
import {  SurveyEditorDto, SurveyEditorServiceProxy, SurveyEditorUpdateDto} from '@shared/service-proxies/service-proxies';

import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AppComponentBase } from '@shared/app-component-base';

@Component({
  selector: 'app-grid-data',
  
  templateUrl: './grid-data.component.html',
  styleUrl: './grid-data.component.scss'
})
export class GridDataComponent extends AppComponentBase {
  gridData: SurveyEditorDto[] = [];
  public filteredHeader = [
    { value: 'order', header: 'Order', width: '150px', dataType: 'string', isActive: true },
    { value: 'description', header: 'Description', width: '300px', dataType: 'string', isActive: true,filterLabel: 'Hide Filter' },
    { value: 'questions', header: 'Questions', width: '750px', dataType: 'string', isActive: true ,filterLabel: 'Hide Filter' }
  ];
  columnHeader = this.filteredHeader;
  canCreate: boolean = false;
 
 
  constructor(injector: Injector,private gridDataService: SurveyEditorServiceProxy,private snackBar: MatSnackBar) {super(injector)}
  

  ngOnInit(): void {
    this.loadGridData();

}
  loadGridData(): void {
    this.gridDataService.getAllSurveyEditorData().subscribe({
        next: (data) => {
            this.gridData = data;
            console.log(this.gridData);
        },
        error: (error) => {
            console.error('Failed to load grid data', error);
        }
    });
}
initialSize = 20; // Default page size
totalGridRecordCount = 0; // The total number of records, fetched from API or computed
rowsPerPageOptions = [20, 50, 100, 500]; // Available rows per page options

// Method to handle page changes
paginate(event: any): void {
  const newPageNumber = event.page; // The page number to navigate to
  // Fetch data for the new page
  this.getDataForPage(newPageNumber);
}

// Method to handle page size changes
pageCountChange(event: any): void {
  this.initialSize = event; // Update the perPage value with the new page size
  this.getDataForPage(1); // Reset to page 1 with the new page size
}

// Example method to fetch data
getDataForPage(page: number): void {
  // Fetch paginated data from the server based on the page and page size (initialSize)
  // Update gridData and totalGridRecordCount with the fetched data
}


onButtonClick(event : any){
  console.log("onbutton event called");
  this.loadGridData();
}

deleteRow(event : any) {
 
  this.gridDataService. deleteSurveyEditorData(event).subscribe({
    next: (response) => {
        console.log('Data deleted successfully', response);
        
    this.snackBar.open('Deleted successfully!', 'Close', {
      duration: 2000, 
      verticalPosition: 'top', 
      horizontalPosition: 'center', 
      panelClass: ['custom-snackbar'] 

    }); 
  
        this.loadGridData(); // Reload or refresh the grid data after deletion
    },
    error: (error) => {
        console.error('Failed to delete data', error);
    }
});

}
updateSurveyEditorData(event: SurveyEditorUpdateDto) {
  this.gridDataService.updateSurveyEditorData(event).subscribe({
      next: (response) => {
          console.log('Data updated successfully:', response);
          this.loadGridData();
         
          
      },
      error: (error) => {
          console.error('Failed to update data:', error);
 
          this.snackBar.open('Failed to update data', 'Close', {
              duration: 3000,
              verticalPosition: 'top', 
      horizontalPosition: 'center', 
      panelClass: ['custom-snackbar'] 
          });
      }
  });
}
  
  
}
