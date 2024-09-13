import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  EventEmitter,
  HostListener,
  Injector,
  Input,
  OnChanges,
  OnInit,
  Output,
  QueryList,
  Renderer2,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewChildren,
  ViewEncapsulation,
} from "@angular/core";
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
  VerticalAlignment,
  IgxInputGroupModule,
  IgxGridModule,
  OverlaySettings,
  NoOpScrollStrategy,
  IgxColumnHidingDirective,
  IgxPaginatorModule,
  ColumnType,
  IgxStringFilteringOperand,
} from "igniteui-angular";
import Swal from "sweetalert2";
import { MatMenuModule } from "@angular/material/menu";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";

//import { IconPopupComponent } from '../common-table/icon-popup/icon-popup.component';
//import { ColumnSortDialogComponent } from '../column-sort-dialog/column-sort-dialog.component';
import { debounceTime, timeout } from "rxjs";

import {
  NgClass,
  NgIf,
  NgStyle,
  NgTemplateOutlet,
  NgForOf,
  CommonModule,
} from "@angular/common";
import { IgxDropDownBaseDirective } from "igniteui-angular/lib/drop-down/drop-down.base";
import { FormsModule } from "@angular/forms";
import { RowDetailComponent } from "../row-detail/row-detail.component";
import { DynamicHostDirective } from "@shared/utils/dynamic-host.directive";
import { NotifyService } from "abp-ng2-module";
import { Positioning } from "ngx-bootstrap/positioning";
import { AppComponentBase } from "@shared/app-component-base";
import { SurveyEditorServiceProxy } from "@shared/service-proxies/service-proxies";

@Component({
  selector: "app-grid-sorting-sample",

  templateUrl: "./grid-sorting-sample.component.html",
  styleUrl: "./grid-sorting-sample.component.scss",
})
export class GridSortingSampleComponent extends AppComponentBase {
  @ViewChild("sourceGrid", { static: true })
  public sourceGrid!: IgxGridComponent;
  //@ViewChild('columnSortingDialog', { static: true }) columnSortingDialog!: ColumnSortDialogComponent;
  @ViewChild("tableStatistics", { read: ElementRef })
  tableStatistics!: ElementRef;
  @ViewChild("paginatorTemplate", { static: true }) paginatorTemplate: any;
  @ViewChild("exportDropdown", { read: IgxDropDownComponent })
  exportDropdown!: IgxDropDownComponent;
  @ViewChild(IgxGridComponent, { static: true }) grids!: IgxGridComponent;

  @ViewChildren(DynamicHostDirective)
  dynamicHosts!: QueryList<DynamicHostDirective>;
  @Output() emitOnButtonClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() doubleClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() emitSelectedRowIds: EventEmitter<any> = new EventEmitter<any>();
  @Output() emitOnRowSelect: EventEmitter<any> = new EventEmitter<any>();
  @Output() emitRowExpanded: EventEmitter<any> = new EventEmitter<any>();
  @Output() emitSearchValues: EventEmitter<any> = new EventEmitter<any>();
  @Output() emitSortColumn: EventEmitter<any> = new EventEmitter<any>();
  @Output() emitExportExcel: EventEmitter<string> = new EventEmitter<string>();
  @Input() dateRangePicker = "";
  @Input() gridHeight = "calc(100vh - 100px)";
  @Input() showSearch = true; // default false
  @Input() showExportAndReport = true; // default true
  @Input() showExport = true;
  @Input() showReport = true;
  @Input() graphsTemplate!: TemplateRef<any>;
  @Input() moveTemplate!: TemplateRef<any>;
  @Input() selectionMode: GridSelectionMode = "multiple";
  @Input() searchPlaceholder = "Search...";
  @Input() exportButton!: boolean;
  @Input() queueDescription!: boolean;
  @Input() selectedRows: any[] = [];
  @Input() customColumns: any[] = [];
  //   @Input() fixedCustomCsetGridDataolumns: any[] = [];
  @Input() statisticsTemplate!: TemplateRef<any>;
  @Input() showDefaultButtsetGridDataonsRight = true;
  @Input() actionButtonsRight!: TemplateRef<any>;
  @Input() actionButtonsLeft!: TemplateRef<any>;
  @Input() actionsBottomLeft!: TemplateRef<any>;
  @Input() initialSize = 20;
  @Input() maxExpandedRowCount = 2;
  @Input() rowsPerPageOptions: number[] = [20, 50, 100, 200];
  @Input() otherStyles: object = {};
  @Input() cellActiveClasses: object = {};
  @Input() statisticsColumnMinWidth: any;
  @Input() statisticsList = [];
  @Input() minTableHeight = "";
  @Input() maxGridHeight = "";
  @Input() showPagination = false;
  @Input() isMovable = true;
  @Input() fileName!: string;
  @Input() accordionDiv!: TemplateRef<any>;
  @Input() testInput!: string;
  @Output() emitDeleteItem: EventEmitter<any> = new EventEmitter();
  public overlayId!: any;
  @ViewChild("fieldInput", { static: false }) fieldInput!: ElementRef;
  namee: any;

  columnHeader: Array<any> = [];
  filteredHeader: any[] = [];
  gridData: any[] = [];
  maxExpandedRow: number[] = [];
  selectedRowData: any = {};
  inputValue: string = "";

  customColumnsDataObj: any = {};
  searchedGridData: any[] = [];
  screenWidth: any;
  expandableToggle = true;

  firstDataIndex!: number;
  lastDataIndex!: number;
  page = 1;
  selectedRowId: any;
  row: any;
  exportDatas = [
    { field: "Export to Excel", id: "Excel" },
    { field: "Export to CSV", id: "CSV" },
  ];

  expandedRows = new Set<number>(); // Replace with your identifier type

  toggleRow(row: any) {
    const rowId = row.index; // Adjust based on your row data structure

    if (this.expandedRows.has(rowId)) {
      this.expandedRows.delete(rowId); // Collapse the row
    } else {
      this.expandedRows.add(rowId); // Expand the row
    }

    // Manually refresh the grid to apply the expansion changes
    this.sourceGrid.rowList.forEach((r) => {
      if (this.expandedRows.has(r.data.id)) {
        this.sourceGrid.expandRow(r);
      } else {
        this.sourceGrid.collapseRow(r);
      }
      console.log("Toggling row:", rowId);
      console.log("Expanded Rows:", Array.from(this.expandedRows));
    });
  }
  isRowExpanded(row: any): boolean {
    return this.expandedRows.has(row.index); // Adjust based on your row data structure
  }
  open(event: any) {}

  @Input() setGridData!: any[];
  public sortItems: any[] = [
    { id: 1, field: "Hide Filter", iconName: "filter-solid" },
    { id: 2, field: "Hide Column", iconName: "hide-column-filter" },
    { id: 3, field: "Choose Columns", iconName: "choose-column-filter" },
  ];
  public recurringTaskSelected!: boolean;

  public overlaySettings = {
    positionStrategy: new ConnectedPositioningStrategy({
      horizontalDirection: HorizontalAlignment.Left,
    }),
  };

  public overlaySettingsFilter = {
    positionStrategy: new ConnectedPositioningStrategy({
      horizontalDirection: HorizontalAlignment.Left,
    }),
  };

  public overlaySettingsFilterFirstAndLast = {
    positionStrategy: new ConnectedPositioningStrategy({
      horizontalDirection: HorizontalAlignment.Left,
    }),
  };

  public dropDownList = [
    { id: 1, field: "Test Report 1" },
    { id: 2, field: "Test Report 2" },
    { id: 2, field: "Test Report 3" },
  ];

  public items: any[] = [
    { id: 1, field: "Clear Filter", iconName: "clear-filter" },
    { id: 2, field: "(Blanks)", iconName: "icon-filter-blank" },
    { id: 3, field: "(NonBlanks)", iconName: "icon-filter-nonblank" },
    { id: 4, field: "Starts with", iconName: "starts-with-filter" },
    { id: 5, field: "Ends with", iconName: "ends-with-filter" },
    { id: 6, field: "Contains", iconName: "contains-filter" },
    { id: 7, field: "Does not contain", iconName: "does-not-contain-filter" },
    { id: 8, field: "Equals", iconName: "equals-filter" },
    { id: 9, field: "Does not equal", iconName: "does-not-equal-filter" },
  ];

  public booleanItems: any[] = [
    { id: 0, field: "Clear", iconName: "clear-filter" },
    { id: 1, field: "True", iconName: "true-icon" },
    { id: 2, field: "False", iconName: "false-icon" },
  ];

  dropDownValue!: string;
  public dropDownBtn = [{ label: "Mine" }, { label: "Shared" }];
  public itemHeight = 48;
  public itemsMaxHeight = 300;
  public noopSortStrategy = NoopSortingStrategy.instance();

  modalTitle!: string;
  columnsSortArray: any[] = [];
  sortingColumns: any[] = [];
  chooseColumns: any[] = [];
  showFilter = true;
  isDesktop = true;
  rowActiveClasses = {};
  tableId!: number;
  gridContainerHeight!: string;
  reportTableContainerHeight: string = "auto";
  searchFilterList: any[] = [];
  backgroundColor = "white"; // Initial background color
  sortHistory: { column: string; direction: SortingDirection }[] = [];
  canDelete: boolean = false;

  options = {
    enabled: false,
    copyHeaders: false,
    copyFormatters: false,
    separator: "\t",
  };

  constructor(
    private renderer: Renderer2,
    public element: ElementRef,
    private cdr: ChangeDetectorRef,
    private excelExportService: IgxExcelExporterService,
    private iconService: IgxIconService,
    private gridDataService: SurveyEditorServiceProxy,

    private injector: Injector,
    private snackBar: MatSnackBar
  ) {
    super(injector);
    this.onResize();
  }

  @Input() set setColumnHeader(array: any[]) {
    this.columnHeader = array;
    this.filteredHeader = [...array];
    console.log(this.filteredHeader);
  }

  @Output() toggleChange = new EventEmitter<boolean>();
  // @Output() emitOne = new EventEmitter<any>();

  // emitEvent(event : any){
  //   console.log("emitEvent called")
  //   this.emit.emitOne(event);
  // }

  isOpen = false;

  toggle(event: Event) {
    event.stopPropagation();
    this.isOpen = !this.isOpen;
    this.toggleChange.emit(this.isOpen);
  }

  @HostListener("window:resize", ["$event"])
  onResize() {
    this.isDesktop = window.innerWidth <= 1350 ? false : true;
    this.screenWidth = window.innerWidth;

    const actionHeight: number =
      document.getElementById("report-table-actions")!?.offsetHeight + 10 || 0;
    const footerHeight: number =
      document.getElementById("table-footer")!?.offsetHeight + 10 || 0;
    const graphHeight: number =
      document.getElementById("graphs-container")!?.offsetHeight + 10 || 0;
    const queueHeight: number =
      document.getElementById("queDescription")!?.offsetHeight + 10 || 0;

    this.gridContainerHeight = `calc(100% - ${
      actionHeight + footerHeight + graphHeight + queueHeight
    }px)`;

    const statisticsHeight = this.tableStatistics
      ? this.tableStatistics.nativeElement?.offsetHeight
      : 0;
    this.reportTableContainerHeight = `calc(100% - ${statisticsHeight}px)`;
  }

  deleteRow(row: any) {
    console.log(row._data.id);
    this.emitDeleteItem.emit(row._data.id);
  }

  gridData1: any[] = [];
  @Output() saveEvent: EventEmitter<any> = new EventEmitter<any>();
  showAlert() {
    Swal.fire({
      title: "Success!",
      text: "Data Updated",
      icon: "success",
      position: "top-end",
      toast: true,
      showConfirmButton: false,
      timer: 2000,
      customClass: {
        container: "custom-swal-container",
      },
    });
  }

  handleSave(event: any) {
    this.saveEvent.emit(event);
    this.showAlert();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    if (Object.keys(changes).includes("setGridData")) {
      console.log(this.setGridData);
      this.gridData = this.setGridData;
      this.searchedGridData = this.setGridData;
      this.selectedRowId = undefined;
      this.selectedRows = [];

      this["gridDataObj"] = this.gridData.reduce((pre, cur) => {
        pre[cur.id] = cur;

        return pre;
      }, {});
      this.resetClasses();
      if (this.showPagination) {
        // this.paginate();
        this.loadGridData();
      }
      this.onResize();
    }

    if (Object.keys(changes).includes("customColumns")) {
      this.customColumnsDataObj = this.customColumns.reduce((pre, cur) => {
        pre[cur.name] = cur;

        return pre;
      }, {});
    }
  }
  checkPermissions() {
    this.canDelete = abp.auth.isGranted("Pages.SurveyEditor.Delete");
  }

  ngOnInit(): void {
    if (this.selectionMode !== "none") {
      this.rowActiveClasses = {
        rowSelected: (row: RowType) =>
          this.selectionMode === "single"
            ? row.data.id === this.selectedRowId
            : this.selectedRows.includes(row.data.id),
        pointerStyle: (row: RowType) =>
          this.selectionMode === "single"
            ? row.data.id !== this.selectedRowId
            : !this.selectedRows.includes(row.data.id),
      };
    }
    // this.iconService.addSvgIcon('search', 'assets/icons/search.svg','svg-flags');
    // this.iconService.addSvgIcon('filter', 'assets/icons/filter.svg','svg-flags');
    // this.iconService.addSvgIcon('settings-svg', 'assets/icons/filter.svg','svg-flags');

    // this.iconService.addSvgIcon('filter-solid', 'assets/icons/filter-solid.svg','svg-flags');
    this.checkPermissions();
  }

  public selection: string = "";

  ngAfterViewInit(): void {
    if (this.fieldInput) {
      this.renderer.setStyle(
        this.fieldInput.nativeElement,
        "pointer-events",
        "auto"
      );
      this.renderer.setAttribute(
        this.fieldInput.nativeElement,
        "tabindex",
        "0"
      );
    }
  }
  public onDropdownChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const value = selectElement.value;

    if (value === "csv") {
      this.exportToCSV();
    } else if (value === "excel") {
      this.exportToExcel();
    }
  }

  data = [
    { ID: 1, Name: "John", Age: 30, Job: "Developer" },
    { ID: 2, Name: "Alice", Age: 28, Job: "Designer" },
    { ID: 3, Name: "Mark", Age: 25, Job: "Manager" },
  ];

  public exportToCSV(): void {
    // Sample data to export (replace with your actual data)
    const data = this.searchedGridData;

    // Convert the data to CSV format
    const csv = this.convertToCSV(data);

    // Create a Blob from the CSV string
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

    // Create a link element
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "data.csv");

    // Append the link to the body and trigger a click
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
  }

  // Method to export data to Excel
  public exportToExcel(): void {
    // Create a worksheet from the data
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
      this.searchedGridData
    );

    // Create a new workbook and append the worksheet
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Convert workbook to binary string
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    // Create a Blob from the binary string
    const blob: Blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    // Use file-saver to save the file
    saveAs(blob, "data.xlsx");
  }

  private convertToCSV(data: any[]): string {
    if (data.length === 0) return "";

    const headers = Object.keys(data[0]);
    const csvRows = [];

    // Add header row
    csvRows.push(headers.join(","));

    // Add data rows
    for (const row of data) {
      const values = headers.map((header) => {
        const value = row[header];
        return `"${String(value).replace(/"/g, '""')}"`;
      });
      csvRows.push(values.join(","));
    }

    return csvRows.join("\n");
  }

  preventDraggingByDatepicker() {
    // This function is to prevent column dragging by clicking the datepicker filter.
    let datePickerIcons: NodeListOf<HTMLElement> = document.querySelectorAll(
      '[title="Choose Date"]'
    );
    datePickerIcons.forEach((icon) => {
      icon.draggable = false;
    });
  }

  searchFilters(
    args: { stopPropagation: () => void },
    input: { focus: () => void }
  ) {
    args.stopPropagation();
    input.focus();
  }
  public exportButtonHandler() {
    this.excelExportService.exportData(
      this.gridData,
      new IgxExcelExporterOptions("ExportFileFromData")
    );
  }
  [key: string]: any;
  selectSortFilter(
    data: { newSelection: { value: { field: string } } },
    field: any,
    index: any,
    header: string | number,
    originalHeader: string | number
  ) {
    if (
      data.newSelection.value.field === "Sort Multiple" ||
      data.newSelection.value.field === "Choose Columns"
    ) {
      this.modalTitle = data.newSelection.value.field;
      let columnsArray =
        data.newSelection.value.field === "Sort Multiple"
          ? this.sortingColumns
          : this.chooseColumns;
      this.columnsSortArray = this[originalHeader].map((res: any) => {
        let index = columnsArray.findIndex(
          (element) => element.value === res.value
        );
        if (data.newSelection.value.field === "Sort Multiple") {
          let columnData: any = {
            header: res.header,
            value: res.value,
            checked: false,
            sort: "Asc",
            width: res.width,
          };
          if (index !== -1) {
            columnData.checked = columnsArray[index]["checked"];
            columnData.sort = columnsArray[index]["sort"];
          }
          return columnData;
        } else if (data.newSelection.value.field === "Choose Columns") {
          let columnData: any = {
            header: res.header,
            value: res.value,
            checked: res.checked,
            sort: "Asc",
            width: res.width,
          };
          if (index !== -1) {
            columnData.checked = columnsArray[index]["checked"];
            columnData.sort = columnsArray[index]["sort"];
          }
          return columnData;
        }
      });
    } else if (data.newSelection.value.field === "Hide Filter") {
      data.newSelection.value.field = "Show Filter";
      this.showFilter = false;
    } else if (data.newSelection.value.field === "Show Filter") {
      data.newSelection.value.field = "Hide Filter";
      this.showFilter = true;
    } else if (data.newSelection.value.field === "Hide Column") {
      const colIndex = this[header].findIndex(
        (element: { value: any }) => element.value === field
      );
      const originalHeaderIndex = this[originalHeader].findIndex(
        (element: { value: any }) => element.value === field
      );
      this[originalHeader][originalHeaderIndex].checked = false;
      if (colIndex !== -1) {
        this[header].splice(colIndex, 1);
        let sum = 0;
        this[header].forEach((item: { width: string }) => {
          sum += parseFloat(item.width?.split("%")[0]);
        });
        if (sum < 100) {
          this.columnHeader.forEach((res) => {
            let index = this[header].findIndex(
              (element: { value: any }) => element.value === res.value
            );
            if (index !== -1) {
              let assignData = this[header][index];
              let calcWidth = (100 / this[header].length).toFixed(2);
              let width = calcWidth + "%";
              assignData.width = width;
              this[header][index] = assignData;
            }
          });
        }
      }
    }
  }

  sortingAndChooseColumns(data: any[], title: string) {
    if (title === "Sort Multiple") {
      this.sortingColumns = data.map(
        (res: { sort: string | number; checked: any; value: any }) => {
          let sortMultipleColumns = {
            dir: SortingDirection[res.sort as keyof typeof SortingDirection],

            checked: res.checked,
            sort: res.sort,
            value: res.value,
            fieldName: res.value,
            ignoreCase: true,
            strategy: DefaultSortingStrategy.instance(),
          };
          return sortMultipleColumns;
        }
      );
      this.sourceGrid.sortingExpressions = this.sortingColumns;
    } else if (title === "Choose Columns") {
      this.chooseColumns = [];
      this.columnHeader.forEach((res) => {
        let index = data.findIndex(
          (element: { value: any }) => element.value === res.value
        );
        res.checked = false;
        res.sort = "Asc";
        if (index !== -1) {
          let assignData = data[index];
          res.checked = data[index]["checked"];
          res.sort = data[index]["sort"];
          assignData.checked = data[index]["checked"];
          assignData.sort = data[index]["sort"];
          let calcWidth = (100 / data.length).toFixed(2);
          let width;
          if (data.length === 17) {
            width = res.minWidth;
          } else {
            width = calcWidth + "%";
          }
          assignData.width = width;
          this.chooseColumns.push(assignData);
        }
      });
      this.filteredHeader = [...this.chooseColumns];
    }
  }

  emitEnteredValue(
    searchKeyword: string | null,
    header: any,
    dataType: string,
    filterType?: string | null
  ) {
    filterType = filterType === "Clear Filter" ? null : filterType;
    if (dataType === "date") {
      let headerIndex: number = this.filteredHeader.findIndex(
        (x) => x.value === header
      );
      if (
        this.filteredHeader[headerIndex].input !== null &&
        this.filteredHeader[headerIndex].input !== ""
      ) {
        this.filteredHeader[headerIndex].invalid = false;
      }
      if (filterType) {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        const thisMonth = today.getMonth();
        const thisYear = today.getFullYear();

        if (
          filterType === "On" ||
          filterType === "Not On" ||
          filterType === "After" ||
          filterType === "On and After" ||
          filterType === "Before" ||
          filterType === "On and Before"
        ) {
          if (
            this.filteredHeader[headerIndex].input !== null &&
            this.filteredHeader[headerIndex].input !== ""
          ) {
            searchKeyword = JSON.stringify({
              start:
                this.filteredHeader[headerIndex].input.start.toDateString(),
              end: this.filteredHeader[headerIndex].input.end.toDateString(),
            });
          } else {
            searchKeyword = null;
            this.filteredHeader[headerIndex].invalid = true;
            return;
          }
        } else if (filterType === "Today") {
          searchKeyword = JSON.stringify({
            start: today.toDateString(),
            end: today.toDateString(),
          });
          this.filteredHeader[headerIndex].invalid = false;
          this.filteredHeader[headerIndex].input = { start: today, end: today };
        } else if (filterType === "Yesterday") {
          searchKeyword = JSON.stringify({
            start: yesterday.toDateString(),
            end: yesterday.toDateString(),
          });
          this.filteredHeader[headerIndex].invalid = false;
          this.filteredHeader[headerIndex].input = {
            start: yesterday,
            end: yesterday,
          };
        } else if (filterType === "This Month") {
          const thisMonthStartDate = new Date(thisYear, thisMonth, 1);
          const thisMonthEndDate = new Date(thisYear, thisMonth + 1, 0);
          searchKeyword = JSON.stringify({
            start: thisMonthStartDate.toDateString(),
            end: thisMonthEndDate.toDateString(),
          });
          this.filteredHeader[headerIndex].invalid = false;
          this.filteredHeader[headerIndex].input = {
            start: thisMonthStartDate,
            end: thisMonthEndDate,
          };
        } else if (filterType === "Last Month") {
          const lastMonthStartDate = new Date(thisYear, thisMonth - 1, 1);
          const lastMonthEndDate = new Date(thisYear, thisMonth, 0);
          searchKeyword = JSON.stringify({
            start: lastMonthStartDate.toDateString(),
            end: lastMonthEndDate.toDateString(),
          });
          this.filteredHeader[headerIndex].invalid = false;
          this.filteredHeader[headerIndex].input = {
            start: lastMonthStartDate,
            end: lastMonthEndDate,
          };
        } else if (filterType === "Next Month") {
          const nextMonthStartDate = new Date(thisYear, thisMonth + 1, 1);
          const nextMonthEndDate = new Date(thisYear, thisMonth + 2, 0);
          searchKeyword = JSON.stringify({
            start: nextMonthStartDate.toDateString(),
            end: nextMonthEndDate.toDateString(),
          });
          this.filteredHeader[headerIndex].invalid = false;
          this.filteredHeader[headerIndex].input = {
            start: nextMonthStartDate,
            end: nextMonthEndDate,
          };
        } else if (filterType === "This Year") {
          const thisYearStartDate = new Date(thisYear, 0, 1);
          const thisYearEndDate = new Date(thisYear, 11, 31);
          searchKeyword = JSON.stringify({
            start: thisYearStartDate.toDateString(),
            end: thisYearEndDate.toDateString(),
          });
          this.filteredHeader[headerIndex].invalid = false;
          this.filteredHeader[headerIndex].input = {
            start: thisYearStartDate,
            end: thisYearEndDate,
          };
        } else if (filterType === "Last Year") {
          const lastYearStartDate = new Date(thisYear - 1, 0, 1);
          const lastYearEndDate = new Date(thisYear - 1, 11, 31);
          searchKeyword = JSON.stringify({
            start: lastYearStartDate.toDateString(),
            end: lastYearEndDate.toDateString(),
          });
          this.filteredHeader[headerIndex].invalid = false;
          this.filteredHeader[headerIndex].input = {
            start: lastYearStartDate,
            end: lastYearEndDate,
          };
        } else if (filterType === "Next Year") {
          const nextYearStartDate = new Date(thisYear + 1, 0, 1);
          const nextYearEndDate = new Date(thisYear + 1, 11, 31);
          searchKeyword = JSON.stringify({
            start: nextYearStartDate.toDateString(),
            end: nextYearEndDate.toDateString(),
          });
          this.filteredHeader[headerIndex].invalid = false;
          this.filteredHeader[headerIndex].input = {
            start: nextYearStartDate,
            end: nextYearEndDate,
          };
        }
      } else {
        filterType = null;
        if (
          this.filteredHeader[headerIndex].input !== null &&
          this.filteredHeader[headerIndex].input !== ""
        ) {
          searchKeyword = JSON.stringify({
            start: this.filteredHeader[headerIndex].input.start.toDateString(),
            end: this.filteredHeader[headerIndex].input.end.toDateString(),
          });
        } else {
          searchKeyword = null;
        }
      }
    }
    let filterIndex = this.searchFilterList.findIndex(
      (x: any) => x.header === header
    );
    if (filterIndex >= 0) {
      this.searchFilterList.splice(filterIndex, 1);
    }
    if (
      (searchKeyword != null &&
        searchKeyword !== "" &&
        dataType !== "boolean") ||
      (dataType === "boolean" && filterType !== "Clear")
    ) {
      if (dataType === "boolean") {
        filterType = filterType === "Yes" ? "True" : "False";
      }
      this.searchFilterList.push({
        searchKeyword,
        header,
        dataType,
        filterType,
      });
    }
    this.emitSearchValues.emit(this.searchFilterList);
  }

  selectionHandler(
    filterType: { newSelection: { value: { field: string } } },
    header: string | undefined,
    headerIndex: number
  ) {
    if (filterType.newSelection?.value?.field === "Clear Filter") {
      this.filteredHeader[headerIndex].input = "";
      this.filteredHeader[headerIndex].invalid = false;
      let filterIndex = this.searchFilterList.findIndex(
        (x) => x.header === header
      );
      if (filterIndex >= 0) {
        this.searchFilterList.splice(filterIndex, 1);
      }
      this.sourceGrid.clearSort(header);
      this.emitSearchValues.emit(this.searchFilterList);
    } else if (
      filterType.newSelection?.value?.field === "(Blanks)" ||
      filterType.newSelection?.value?.field === "(NonBlanks)"
    ) {
      this.filteredHeader[headerIndex].input = "";
      let filterIndex = this.searchFilterList.findIndex(
        (x) => x.header === header
      );
      if (filterIndex >= 0) {
        this.searchFilterList.splice(filterIndex, 1);
      }
      this.searchFilterList.push({
        searchKeyword: this.filteredHeader[headerIndex].input,
        header,
        dataType: this.filteredHeader[headerIndex].dataType,
        filterType: filterType.newSelection?.value?.field,
      });
      this.emitSearchValues.emit(this.searchFilterList);
    } else {
      this.emitEnteredValue(
        this.filteredHeader[headerIndex].input,
        header,
        this.filteredHeader[headerIndex].dataType,
        filterType.newSelection?.value?.field
      );
    }
  }
  public onKeyDown(keyDown: KeyboardEvent) {
    keyDown.stopPropagation();
  }
  searchTable(event: any): void {
    event.stopPropagation();

    // this.inputValue = event
    const target = event.target as HTMLInputElement;
    if (target) {
      const value = target.value;

      this.searchedGridData = this.gridData?.filter((row) => {
        if (Object.keys(row).length === 0) return false;

        return Object.keys(row).some((key) => {
          const rowValue = row[key]?.toString().toLowerCase() || "";
          return rowValue.includes(value.toLowerCase());
        });
      });
    }
  }
  @ViewChild("grid", { static: true }) public grid: IgxGridComponent;

  onSidebarToggle() {
    this.grid.reflow(); // This will recalculate the grid layout and adjust column sizes
  }

  getColumnWidth(field: string): string {
    switch (field) {
      case "order":
        return "150px";
      case "description":
        return "250px";
      case "questions":
        return "760px";
      default:
        return "10px"; // Default width for other columns
    }
  }

  sortColumn() {
    const sortFilter: any = [];
    this.sourceGrid.sortingExpressions.map((sortCol) => {
      sortFilter.push({ column: sortCol.fieldName, direction: sortCol.dir });
    });
    this.emitSortColumn.emit(sortFilter);
  }

  /*iconPopup(name: any) {
    const componentRef = this.modal.open(IconPopupComponent, { windowClass: 'icon-popup' });
    componentRef.componentInstance.dialogName = name;
  }*/

  buttonClickEvent(eventType: any, cell: { row: { data: any } }) {
    this.emitOnButtonClick.emit({
      eventType: eventType,
      data: cell.row.data,
    });
  }

  onDoubleClick(event: any) {
    this.sourceGrid.expandRow(event.cell.row.data.id);
  }

  selectParticularRows(rowIds: Array<any>) {
    this.sourceGrid.selectRows(rowIds, true);
  }

  selectAllRows() {
    this.sourceGrid.selectAllRows();
    this.selectedRows = this.searchedGridData.map((data) => data.id);
    this.emitSelectedRowIds.emit(this.selectedRows);
  }

  onSelectionChange(event: IRowSelectionEventArgs) {
    this.expandableToggle = true;
    if (this.selectionMode !== "none" && this.selectionMode === "single") {
      this.emitOnRowSelect.emit(
        this.searchedGridData.find((item) => item.id === event.newSelection[0])
      );
      this.selectedRowId = event.newSelection[0].id;
    } else if (
      this.selectionMode !== "none" &&
      this.selectionMode === "multiple"
    ) {
      this.emitSelectedRowIds.emit(event.newSelection);
      this.selectedRows = event.newSelection;
    }
  }

  deselectCellClick(event: any) {
    if (
      event.event.ctrlKey &&
      this.selectedRows.length > 1 &&
      this.selectedRows.includes(event.cell.row.data.id)
    ) {
      this.selectedRows.splice(
        this.selectedRows.findIndex((id) => id === event.cell.row.data.id),
        1
      );
      this.sourceGrid.deselectRows([event.cell.row.data.id]);
      this.emitSelectedRowIds.emit(this.selectedRows);
      event.event.stopPropagation();
    }
  }

  getExport(data: any, fileName?: any) {
    this.emitExportExcel.emit(data);
  }

  resetClasses() {
    if (this.selectionMode !== "none") {
      this.rowActiveClasses = { ...this.rowActiveClasses };
    }
  }

  paginate(event) {
    console.log(event);
    if (event) {
      this.page = event + 1;
      this.initialSize = event;
    }
    this.firstDataIndex = (this.page - 1) * this.initialSize;
    this.lastDataIndex = this.page * this.initialSize;
    this.searchedGridData = this.gridData.slice(
      this.firstDataIndex,
      this.lastDataIndex
    );
  }

  onPageChange(newPage: number): void {
    this.page = newPage + 1;
    console.log(this.page);
    this.loadGridData(); // Fetch new data from the backend based on the updated page number
  }

  onPerPageChange(newRows: number): void {
    this.initialSize = newRows; // Update the number of rows per page
    this.page = 1; // Reset to the first page whenever the page size changes
    this.loadGridData(); // Fetch new data with the updated rows per page
  }

  loadGridData(): void {
    const skipCount = (this.page - 1) * this.initialSize;
    console.log(this.page);
    console.log(this.initialSize);
    const maxResultCount = this.initialSize;

    this.gridDataService
      .getPagedGridData(skipCount, maxResultCount)
      .subscribe((result) => {
        this.searchedGridData = result.items;
        this.totalGridRecordCount = result.totalCount;
      });
  }

  clearFilters() {
    this.columnHeader.map((header) => Object.assign(header, { input: "" }));
    this.searchedGridData = this.gridData;
    this.filteredHeader = this.columnHeader;
  }

  expandedRowId: any = null;

  onRowToggle(event: IRowToggleEventArgs) {
    console.log(event);

    const rowId = event.rowKey;
    console.log(rowId);
    const rowID = event.rowKey; // Access rowID directly from the event
    if (rowID && this.sourceGrid?.data) {
      const rowData = this.sourceGrid.data.find(
        (row) => row[this.sourceGrid?.primaryKey ?? ""] === rowID
      );
      this.selectedRowData = rowData || {};
    }

    // Toggle logic
    if (this.expandedRowId === rowId) {
      this.expandedRowId = null; // Collapse if the same row is clicked again
      this.clearChildComponent(rowId);
    } else {
      if (this.expandedRowId !== null) {
        // Collapse previously expanded row
        this.clearChildComponent(this.expandedRowId);
        this.sourceGrid.collapseRow(this.expandedRowId);
      }
      this.expandedRowId = rowId; // Set the new expanded row
      this.loadChildTemplate(rowId); // Load details for the new row
    }

    this.cdr.detectChanges(); // Update the view
  }

  loadChildTemplate(rowID: number) {
    setTimeout(() => {
      const dynamicHost = this.dynamicHosts.find((host) => {
        const parentRow =
          host.viewContainerRef.element.nativeElement.parentElement;
        return (
          parentRow && parentRow.getAttribute("data-row-id") == rowID.toString()
        );
      });

      if (dynamicHost) {
        const viewContainerRef = dynamicHost.viewContainerRef;
        viewContainerRef.clear();
        viewContainerRef.createEmbeddedView(this.accordionDiv, {
          data: this["gridDataObj"][rowID],
        });
      }
    });
  }

  clearChildComponent(rowID: number | undefined) {
    const dynamicHost = this.dynamicHosts.find((host) => {
      const parentRow =
        host.viewContainerRef.element.nativeElement.parentElement;
      return (
        parentRow && parentRow.getAttribute("data-row-id") == rowID?.toString()
      );
    });

    if (dynamicHost) {
      dynamicHost.viewContainerRef.clear();
    }
  }

  clearDateValue(header: string, index: number) {
    this.filteredHeader[index].input = null;
  }

  columns = this.filteredHeader;
  dropdownVisibility: Map<string, boolean> = new Map();

  // Toggle dropdown visibility for a column
  public toggleDropdown(columnField: string): void {
    // Assuming 'dropdownState' is a Map or Object to track each column's dropdown visibility
    this.dropdownState[columnField] = !this.dropdownState[columnField];
  }
  // Check dropdown visibility
  public isDropdownVisible(columnField: string): boolean {
    return this.dropdownState[columnField];
  }

  openColumnChooser() {
    console.log("Open column chooser");
    //this.grids.openColumnHidingUI(); // This will open the column hiding dialog
  }

  hideColumn(field: string) {
    console.log(`Hide column: ${field}`);
    const column = this.sourceGrid.getColumnByName(field); // Get column by field name
    if (column) {
      column.hidden = true; // Hide the column
    } else {
      console.error(`Column with field ${field} not found.`);
    }
  }
  // Object to track filter visibility state for each column
  filterStates: { [key: string]: boolean } = {};

  // Single state to track the filter visibility across all columns

  toggleFilter(): void {
    this.showFilter = !this.showFilter; // Toggle the global filter state

    // Update the filterStates for each column
    this.columns.forEach((column) => {
      this.filterStates[column.field] = this.showFilter;
    });
  }

  getFilterVisibility(columnField: string): boolean {
    return this.filterStates[columnField] ?? this.showFilter; // Use global state if specific state is not set
  }

  dropdownState: { [key: string]: boolean } = {}; // To track dropdown state for each column

  toggleFilterDropdown(column: string) {
    // Close all other dropdowns
    for (let key in this.dropdownState) {
      if (key !== column) {
        this.dropdownState[key] = false;
      }
    }
    // Toggle current column's dropdown
    this.dropdownState[column] = !this.dropdownState[column];
  }

  currentFilterPlaceholder: { [key: string]: string } = {};
  filterQuery: { [key: string]: string } = {};
  selectedFilterType: { [key: string]: string } = {};

  selectFilterOption(item: any, column: string) {
    this.dropdownState[column] = false;

    if (item.field === "Clear Filter") {
      this.filterQuery[column] = "";
      this.currentFilterPlaceholder[column] = "Contains...";
      this.selectedFilterType[column] = "";
      this.clearFilter(column);
    } else {
      this.currentFilterPlaceholder[column] = item.field.toLowerCase() + "...";
      this.selectedFilterType[column] = item.field;
      this.applyFilter(column);
    }
  }

  applyFilter(column: string) {
    const filterType = this.selectedFilterType[column] || "Contains";
    const filterValue = this.filterQuery[column] || "";

    switch (filterType) {
      case "Starts with":
        this.sourceGrid.filter(
          column,
          filterValue,
          IgxStringFilteringOperand.instance().condition("startsWith")
        );
        break;
      case "Ends with":
        this.sourceGrid.filter(
          column,
          filterValue,
          IgxStringFilteringOperand.instance().condition("endsWith")
        );
        break;
      case "Contains":
        this.sourceGrid.filter(
          column,
          filterValue,
          IgxStringFilteringOperand.instance().condition("contains")
        );
        break;
      case "Does not contain":
        this.sourceGrid.filter(
          column,
          filterValue,
          IgxStringFilteringOperand.instance().condition("doesNotContain")
        );
        break;
      case "Equals":
        this.sourceGrid.filter(
          column,
          filterValue,
          IgxStringFilteringOperand.instance().condition("equals")
        );
        break;
      case "Does not equal":
        this.sourceGrid.filter(
          column,
          filterValue,
          IgxStringFilteringOperand.instance().condition("doesNotEqual")
        );
        break;
      case "(Blanks)":
        this.sourceGrid.filter(
          column,
          null,
          IgxStringFilteringOperand.instance().condition("empty")
        );
        break;
      case "(NonBlanks)":
        this.sourceGrid.filter(
          column,
          null,
          IgxStringFilteringOperand.instance().condition("notEmpty")
        );
        break;
      case "Clear Filter":
        this.sourceGrid.clearFilter(column);
        break;
      default:
        this.sourceGrid.filter(
          column,
          filterValue,
          IgxStringFilteringOperand.instance().condition("contains")
        );
        break;
    }

    this.sourceGrid.markForCheck();
  }

  clearFilter(column: string) {
    this.sourceGrid.clearFilter(column);
    this.filterQuery[column] = "";
    this.currentFilterPlaceholder[column] = "Contains...";
  }
}
