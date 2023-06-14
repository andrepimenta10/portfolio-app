import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import {Holding} from "../model/Holding";
import {Portfolio} from "../model/Portfolio";
import {Security} from "../model/Security";

@Injectable({ providedIn: 'root' })
export class PortfolioService {

  private iexQuoteURL = 'https://api.iex.cloud/v1/data/core/quote';
  private token = '?token=sk_73093895a84b4a03923cb579d25bdd38';
  private baseUrl = 'http://localhost:8080';

  constructor(
    private http: HttpClient,
  ) { }

  getPortfolios(): Observable<Portfolio[]> {
    const url = `${this.baseUrl}/portfolios`;
    return this.http.get<Portfolio[]>(url);
  }

  getPortfolio(portfolioId: number): Observable<Holding[]> {
    const url = `${this.baseUrl}/portfolio/${portfolioId}`;
    return this.http.get<Holding[]>(url);
  }

  getSecurity(id: string): Observable<Security[]> {
    const url = `${this.iexQuoteURL}/${id}`+this.token;
    return this.http.get<Security[]>(url);
  }
}
