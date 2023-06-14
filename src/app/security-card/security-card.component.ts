import { Component, Input } from '@angular/core';
import { PortfolioService } from '../services/portfolio.service';
import { StompService } from '../services/StompService';
import {Security} from "../model/Security";

@Component({
  selector: 'security-card',
  templateUrl: './security-card.component.html',
  styleUrls: ['./security-card.component.scss'],
  providers: [StompService, PortfolioService]
})
export class SecurityCardComponent {
  @Input() selectedSecurity: string = '';

  companyName?: string;
  price?: number;
  latestVolume?: number;
  askPrice?: number;
  bidPrice?: number;
  bidSize?: number;
  askSize?: number;
  previousVolume?: number;
  avgTotalVolume?: number;

  constructor(
    private websocket: StompService,
    private portfolioService: PortfolioService
  ) {}

  ngOnInit() {
    const ticker = this.selectedSecurity.toLowerCase();
    // first we fetch current stock data
    this.portfolioService.getSecurity(ticker).subscribe((data: Security[]) => {
      this.populateStockFields(data[0]);
    });
    const wsTopic = `/topic/securities`;
    // next we subscribe to the websocket for this stock so that we can receive updates
    this.websocket.subscribe(wsTopic, (frame: any) => {
      const { body } = frame;
      this.processWsMessage(body);
    });
  }

  private processWsMessage(message: string): void {
    try {
      const parsedMessage: Security = JSON.parse(message);
      if (parsedMessage.symbol === this.selectedSecurity) {
        this.populateStockFields(parsedMessage);
      }
    } catch (e) {
      console.log('Invalid JSON in websocket message: ', e);
    }
  }

  private populateStockFields(stockData: Security) {
    const {latestPrice, latestVolume, iexBidPrice, iexAskPrice, companyName, iexAskSize, iexBidSize, symbol, avgTotalVolume, previousVolume} = stockData;
    this.price = latestPrice;
    this.latestVolume = latestVolume;
    this.companyName = companyName;
    this.bidPrice = iexBidPrice;
    this.askPrice = iexAskPrice;
    this.bidSize = iexBidSize;
    this.askSize = iexAskSize;
    this.avgTotalVolume = avgTotalVolume;
    this.previousVolume = previousVolume;
  }

}
