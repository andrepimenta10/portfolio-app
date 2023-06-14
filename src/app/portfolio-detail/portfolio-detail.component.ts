import { Component } from '@angular/core';
import { ColDef, GridApi} from "ag-grid-community";
import {Holding} from "../model/Holding";
import { GridReadyEvent } from "ag-grid-community/dist/lib/events";
import { PortfolioService } from '../services/portfolio.service';
import { ActivatedRoute } from '@angular/router';
import { StompService } from '../services/StompService';
import {Security} from "../model/Security";

@Component({
  selector: 'app-portfolio-detail',
  templateUrl: './portfolio-detail.component.html',
  styleUrls: ['./portfolio-detail.component.scss']
})
export class PortfolioDetailComponent {

  columnDefs: ColDef[] = [
    { field: 'security.symbol', headerName: "Symbol" },
    { field: 'units' },
    { field: 'holdingValue' },
    { field: 'security.avgTotalVolume', headerName: "Avg 30 day Volume"},
    { field: 'security.iexVolume', headerName: "Volume" },
    { field: 'security.latestPrice', headerName: "Latest Price" },
    { field: 'security.iexAskPrice', headerName: "Ask Price" },
    { field: 'security.iexAskSize', headerName: "Ask Size" },
    { field: 'security.iexBidPrice', headerName: "Bid Price" },
    { field: 'security.iexBidSize', headerName: "Bid Size" },
    { field: 'security.companyName', headerName: "Company Name" },
  ];

  public rowData!: Holding[];

  selectedPortfolio?: number;
  showGrid: boolean = false;
  currData: {[key: string]: Holding} = {};
  gridApi?: GridApi;

  gridOptions = {
    getRowId: (params: any) => params.data.security.symbol,
    animateRows: true,
  };

  constructor(
    private portfolioService: PortfolioService,
    private route: ActivatedRoute,
    private websocket: StompService,
  ) {}

  onGridReady(params: GridReadyEvent<Holding>) {
    this.gridApi = params.api;
    if (this.selectedPortfolio) {
      this.portfolioService.getPortfolio(this.selectedPortfolio).subscribe((data) => {
        this.rowData = data;
        params.columnApi.autoSizeAllColumns();
        this.currData = data.reduce<{[key: string]: Holding}>((acc, curr) => {
          return {
            ...acc,
            [curr.security.symbol]: curr,
          }
        }, {})
      })
    }
  }

  ngOnInit() {
    this.subscribeToHoldingUpdates();
    this.route.paramMap
      .subscribe(paramMap => {
        // @ts-expect-error
        this.selectedPortfolio = paramMap.params.portfolioId;
        this.showGrid = true;
      }
    );
  }

  subscribeToHoldingUpdates() {
    const wsTopic = `/topic/securities`;
    this.websocket.subscribe(wsTopic, (frame: any) => {
      const { body } = frame;
      this.processWsMessage(body);
    });
  }

  private processWsMessage(message: string): void {
    try {
      const parsedMessage: Security = JSON.parse(message);
      const currHolding = this.currData[parsedMessage.symbol];
      if (currHolding && currHolding.security) {
        currHolding.security = parsedMessage;
        this.updateRow(currHolding);
      }
    } catch (e) {
      console.log('Invalid JSON in websocket message: ', e);
    }
  }

  private updateRow(parsedMessage: Holding) {
    const ticker = parsedMessage.security.symbol;
    if (this.gridApi) {
      const rowNode = this.gridApi.getRowNode(ticker);
      rowNode?.setData(parsedMessage);
    }
  }

}
