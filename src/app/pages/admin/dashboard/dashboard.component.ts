import { CommonModule } from '@angular/common';
import { Component, OnInit} from '@angular/core';
import { ChartModule } from 'primeng/chart';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ChartModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  chartData: number[] = [112, 10, 225, 134, 101, 80, 50, 100, 200];
  labels: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
  tooltipContent: string = '';
  tooltipOpen: boolean = false;
  tooltipX: number = 0;
  tooltipY: number = 0;

  showTooltip(event: MouseEvent, content: string) {
    const target = event.target as HTMLElement;
    this.tooltipContent = content;
    this.tooltipX = target.offsetLeft - target.clientWidth;
    this.tooltipY = target.clientHeight + target.clientWidth;
    this.tooltipOpen = true;
  }

  hideTooltip() {
    this.tooltipContent = '';
    this.tooltipOpen = false;
    this.tooltipX = 0;
    this.tooltipY = 0;
  }

  basicData: any;

    basicOptions: any;

    ngOnInit() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        this.basicData = {
            labels: ['Q1', 'Q2', 'Q3', 'Q4'],
            datasets: [
                {
                    label: 'Sales',
                    data: [540, 325, 702, 620],
                    backgroundColor: ['rgba(255, 159, 64, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(153, 102, 255, 0.2)'],
                    borderColor: ['rgb(255, 159, 64)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)'],
                    borderWidth: 1
                }
            ]
        };

        this.basicOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };
    }
}
