import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ProjectInquiryComponent } from '../../ui';

@Component({
  selector: 'app-contact',
  imports: [ProjectInquiryComponent],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactComponent {
}
