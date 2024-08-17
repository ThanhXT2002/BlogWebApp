import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NavComponent } from "../nav/nav.component";
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: 'app-layout-website',
  standalone: true,
  imports: [RouterModule, RouterOutlet, NavComponent, FooterComponent],
  templateUrl: './layout-website.component.html',
  styleUrl: './layout-website.component.scss'
})
export class LayoutWebsiteComponent {

}
