import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent, FooterComponent } from './components/layout';
import { ContactModalComponent } from './components/ui';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent, ContactModalComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  title = 'e2e-portfolio';
}
