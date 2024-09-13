import { AppComponentBase } from 'shared/app-component-base';
import { Component, Injector, OnInit } from '@angular/core';

export class PagedResultDto {
    items: any[];
    totalCount: number;
}

export class EntityDto {
    id: number;
}

export class PagedRequestDto {
    skipCount: number;
    maxResultCount: number;
}

@Component({
    template: ''
})
export abstract class PagedListingComponentBase<TEntityDto> extends AppComponentBase implements OnInit {

    public pageSize = 10;
    public pageNumber = 1;
    public totalPages = 1;
    public totalItems: number;
    public isTableLoading = false;

    constructor(injector: Injector) {
        super(injector);
    }

    ngOnInit(): void {
        this.refresh();
    }

    refresh(): void {
        this.getDataPage(this.pageNumber);
    }

    public showPaging(result: PagedResultDto, pageNumber: number): void {
        this.totalPages = ((result.totalCount - (result.totalCount % this.pageSize)) / this.pageSize) + 1;

        this.totalItems = result.totalCount;
        this.pageNumber = pageNumber;
    }

    public getDataPage(page: number): void {
        const req = new PagedRequestDto();
        req.maxResultCount = this.pageSize;
        req.skipCount = (page - 1) * this.pageSize;

        this.isTableLoading = true;
        this.list(req, page, () => {
            this.isTableLoading = false;
        });
    }
    public onPageSizeChange(newPageSize: number): void {
        this.pageSize = newPageSize; // Update the page size
        this.pageNumber = 1;         // Reset to the first page
        this.getDataPage(this.pageNumber); // Fetch new data
    }
    public previousPage(): void {
        if (this.pageNumber > 1) {
            this.getDataPage(--this.pageNumber); // Go to the previous page
        }
    }
    
    public nextPage(): void {
        if (this.pageNumber < this.totalPages) {
            this.getDataPage(++this.pageNumber); // Go to the next page
        }
    }
    public onPageChange(newPageNumber: number): void {
        this.getDataPage(newPageNumber); // Fetch data for the selected page
    }
    
        

    protected abstract list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void;
    protected abstract delete(entity: TEntityDto): void;
}
