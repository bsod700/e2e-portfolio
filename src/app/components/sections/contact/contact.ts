import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { ProjectInquiryComponent } from '../../ui';

interface Star {
  id: number;
  top: number;
  left: number;
  transformX: number;
  transformY: number;
  duration: number;
  delay: number;
}

@Component({
  selector: 'app-contact',
  imports: [ProjectInquiryComponent],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactComponent implements OnInit {
  stars: Star[] = [];

  ngOnInit() {
    // Generate 100 random stars similar to Reflect.app
    this.stars = this.generateStars(100);
  }

  private generateStars(count: number): Star[] {
    const stars: Star[] = [];
    const centerX = 50; // Center is at 50%
    const centerY = 50; // Center is at 50%
    
    // Use a base viewport size for pixel calculation
    // This will be approximate but should work across different screen sizes
    const baseViewportWidth = 1200;
    const baseViewportHeight = 800;

    for (let i = 0; i < count; i++) {
      // Random starting position (0-100%)
      const top = Math.random() * 100;
      const left = Math.random() * 100;
      
      // Calculate distance from center
      // If star is at left: 20% and center is 50%, need to move +30% of container width
      const deltaXPercent = (centerX - left) / 100;
      const deltaYPercent = (centerY - top) / 100;
      
      // Convert to pixel values based on base viewport
      // The actual movement will scale proportionally
      const deltaX = deltaXPercent * baseViewportWidth;
      const deltaY = deltaYPercent * baseViewportHeight;
      
      // Random animation duration between 7-14 seconds (matching Reflect.app range)
      const duration = 7 + Math.random() * 7;
      
      // Random delay between 0-5 seconds
      const delay = Math.random() * 5;

      stars.push({
        id: i,
        top,
        left,
        transformX: deltaX,
        transformY: deltaY,
        duration,
        delay
      });
    }

    return stars;
  }
}
