// src/app/features/dashboard/dashboard.component.ts
//
// The admin landing page. Shows a "ticker row" of key stats (signature
// element — like a trading floor display) and a live health-check grid
// of all 6 backend services using the Gateway's /health/all endpoint.

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { OrderService } from '../../core/services/order.service';
import { HealthService } from '../../core/services/health.service';
import { ServiceHealth } from '../../core/models/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-header">
      <div>
        <h1>Dashboard</h1>
        <div class="page-sub">Live overview of your store</div>
      </div>
    </div>

    <div class="ticker-row">
      <div class="ticker-cell">
        <div class="ticker-label">Total Products</div>
        <div class="ticker-value">{{ totalProducts }}</div>
      </div>
      <div class="ticker-cell">
        <div class="ticker-label">Total Orders</div>
        <div class="ticker-value">{{ totalOrders }}</div>
      </div>
      <div class="ticker-cell">
        <div class="ticker-label">Pending Orders</div>
        <div class="ticker-value" [style.color]="pendingOrders > 0 ? 'var(--amber)' : 'var(--text)'">
          {{ pendingOrders }}
        </div>
      </div>
      <div class="ticker-cell">
        <div class="ticker-label">Services Online</div>
        <div class="ticker-value">
          {{ servicesUp }}<span style="color:var(--muted); font-size:16px;">/{{ totalServices }}</span>
        </div>
      </div>
    </div>

    <div class="panel">
      <div class="panel-header">
        <h2>System Health</h2>
        <button class="btn btn-sm" (click)="checkHealth()">↻ Refresh</button>
      </div>

      @if (healthLoading) {
        <p class="loading-text">Checking all services...</p>
      } @else {
        <div class="health-grid">
          @for (entry of healthEntries; track entry.key) {
            <div class="health-chip">
              <div class="health-name">
                <span class="dot" [style.background]="entry.value.status === 'UP' ? 'var(--sage)' : 'var(--danger)'"></span>
                {{ entry.value.name }}
              </div>
              <div class="health-status">
                {{ entry.value.status === 'UP' ? (entry.value.responseTime || 'OK') : 'Down' }}
              </div>
            </div>
          }
        </div>
      }
    </div>

    <div class="panel">
      <div class="panel-header">
        <h2>Quick Actions</h2>
      </div>
      <div style="display:flex; gap:12px;">
        <a routerLink="/products" class="btn">📦 Manage Products</a>
        <a routerLink="/orders" class="btn">📋 View Orders</a>
      </div>
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  totalProducts   = 0;
  totalOrders     = 0;
  pendingOrders   = 0;
  servicesUp      = 0;
  totalServices   = 0;
  healthLoading   = true;
  healthEntries: { key: string; value: ServiceHealth }[] = [];

  constructor(
    private productService: ProductService,
    private orderService:   OrderService,
    private healthService:  HealthService,
  ) {}

  ngOnInit(): void {
    this.loadStats();
    this.checkHealth();
  }

  loadStats(): void {
    this.productService.getAll({ per_page: 1 }).subscribe({
      next: (res) => (this.totalProducts = res.total),
      error: () => {},
    });

    this.orderService.getAll({ per_page: 1 }).subscribe({
      next: (res) => (this.totalOrders = res.total),
      error: () => {},
    });

    this.orderService.getAll({ status: 'PENDING', per_page: 1 }).subscribe({
      next: (res) => (this.pendingOrders = res.total),
      error: () => {},
    });
  }

  checkHealth(): void {
    this.healthLoading = true;
    this.healthService.checkAll().subscribe({
      next: (res) => {
        this.healthEntries = Object.entries(res.services).map(([key, value]) => ({ key, value }));
        this.servicesUp    = this.healthEntries.filter((e) => e.value.status === 'UP').length;
        this.totalServices = this.healthEntries.length;
        this.healthLoading = false;
      },
      error: () => {
        this.healthLoading = false;
      },
    });
  }
}
