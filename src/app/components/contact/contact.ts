import { Component } from '@angular/core';
import { ProjectInquiryComponent } from '../project-inquiry/project-inquiry';

@Component({
  selector: 'app-contact',
  imports: [ProjectInquiryComponent],
  templateUrl: './contact.html',
  styleUrl: './contact.scss'
})
export class ContactComponent {
}
