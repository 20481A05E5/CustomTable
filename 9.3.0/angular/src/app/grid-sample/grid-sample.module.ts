import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridSortingSampleComponent } from '../components/grid-sorting-sample/grid-sorting-sample.component';
import { AfterViewInit, ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, QueryList, Renderer2, SimpleChanges, TemplateRef, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import {
  ConnectedPositioningStrategy,
  DefaultSortingStrategy,
  GridSelectionMode,
  HorizontalAlignment,
  IRowSelectionEventArgs,
  IRowToggleEventArgs,
  IgxCheckboxComponent,
  IgxColumnComponent,
  IgxCsvExporterService,
  IgxDateRangePickerComponent,
  IgxDropDownComponent,
  IgxDropDownItemComponent,
  IgxDropDownItemNavigationDirective,
  IgxDropDownModule,
  IgxExcelExporterOptions,
  IgxExcelExporterService,
  IgxGridComponent,
  IgxIconComponent,
  IgxInputGroupComponent,
  IgxToggleActionDirective,
  NoopSortingStrategy,
  RowType,
  SortingDirection,
  IgxButtonModule,
  IgxToggleModule,
  IgxIconService,
  
  VerticalAlignment,IgxInputGroupModule,IgxGridModule,
  OverlaySettings,
  NoOpScrollStrategy,
  IgxColumnHidingDirective,
  


  ColumnType,
  IgxStringFilteringOperand,
  IgxPaginatorModule,

} from 'igniteui-angular';
 import { MatMenuModule} from '@angular/material/menu';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';


//import { IconPopupComponent } from '../common-table/icon-popup/icon-popup.component';
//import { ColumnSortDialogComponent } from '../column-sort-dialog/column-sort-dialog.component';
import { debounceTime } from 'rxjs';
import { DynamicHostDirective } from '../../shared/utils/dynamic-host.directive';
import { NgClass, NgIf, NgStyle, NgTemplateOutlet,NgForOf,  } from '@angular/common';
import { IgxDropDownBaseDirective } from 'igniteui-angular/lib/drop-down/drop-down.base';

import { RowDetailComponent } from "../components/row-detail/row-detail.component";
import { FormsModule } from '@angular/forms';
import {GridDataComponent} from "../components/grid-data/grid-data.component"
import { GridDataService } from '@app/grid-data.service';
import{ButtonComponent} from '../components/button/button.component'
import { SharedModule } from "../../shared/shared.module";


@NgModule({
  declarations: [GridSortingSampleComponent,RowDetailComponent,DynamicHostDirective,GridDataComponent,ButtonComponent],
  imports: [
    CommonModule,IgxPaginatorModule, MatMenuModule, IgxCheckboxComponent, IgxInputGroupModule, NgStyle, IgxColumnComponent, MatSnackBarModule, NgIf, IgxIconComponent, NgTemplateOutlet, IgxGridComponent, IgxGridModule, NgClass, IgxColumnComponent, IgxToggleActionDirective, IgxDropDownComponent, IgxDropDownItemComponent, IgxDropDownItemNavigationDirective, IgxInputGroupComponent, IgxDateRangePickerComponent, IgxCheckboxComponent, FormsModule, NgForOf, IgxDropDownModule, IgxButtonModule, IgxToggleModule, CommonModule, IgxInputGroupModule, MatInputModule, MatFormFieldModule,
    SharedModule
],
  providers: [GridDataService]
})
export class GridSampleModule { }
