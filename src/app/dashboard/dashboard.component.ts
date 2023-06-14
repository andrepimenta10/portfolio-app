import { Component } from '@angular/core';
import {PortfolioService} from "../services/portfolio.service";
import {Portfolio} from "../model/Portfolio";
import {CellClickedEvent, ColDef} from "ag-grid-community";
import {GridReadyEvent} from "ag-grid-community/dist/lib/events";
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {Security} from "../model/Security";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [Router]
})
export class DashboardComponent {
  title = 'Portfolio Dashboad';

  columnDefs: ColDef[] = [
    { field: 'portfolioId' },
    { field: 'name' },
    { field: 'nav' },
    { field: 'dailyReturn' },
    { field: 'monthlyReturn' },
    { field: 'yearlyReturn' },
    { field: 'volatility' },
  ];

  public rowData!: Portfolio[];

  gridOptions = {
    onCellClicked: this.openPortfolioDetails,
  };

  constructor(
    private http: HttpClient,
    private portfolioService: PortfolioService
  ) {}

  onGridReady(params: GridReadyEvent<Security>) {
    this.portfolioService.getPortfolios().subscribe((data) => {
      this.rowData = data
    });
  }

  openPortfolioDetails(event: CellClickedEvent) {
    const selectedPortfolioId = event.data.portfolioId;
    const url = `/detail/${selectedPortfolioId}`;
    window.open(url, '_blank');
  }
}
