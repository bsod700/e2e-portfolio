import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Service {
  icon: string;
  title: string;
  description: string;
  features: string[];
}

@Component({
  selector: 'app-services',
  imports: [CommonModule],
  templateUrl: './services.html',
  styleUrl: './services.scss'
})
export class ServicesComponent {
  services: Service[] = [
    {
      icon: '💻',
      title: 'Development',
      description: 'Building scalable and performant web applications using modern tech stack and best practices.',
      features: [
        'Full-stack web applications',
        'RESTful API development',
        'Database design & optimization',
        'Cloud deployment & DevOps'
      ]
    },
    {
      icon: '🎨',
      title: 'Design',
      description: 'Creating beautiful, intuitive interfaces that users love with attention to detail and user experience.',
      features: [
        'UI/UX design & prototyping',
        'Responsive web design',
        'Design systems',
        'Brand identity'
      ]
    },
    {
      icon: '📱',
      title: 'UI',
      description: 'Crafting pixel-perfect user interfaces with modern frameworks and cutting-edge technologies.',
      features: [
        'React & Angular applications',
        'Component libraries',
        'Animation & interactions',
        'Accessibility compliance'
      ]
    },
    {
      icon: '🤖',
      title: 'AI Automation',
      description: 'Leveraging artificial intelligence to automate processes and enhance user experiences.',
      features: [
        'AI integration & APIs',
        'Machine learning models',
        'Process automation',
        'Intelligent chatbots'
      ]
    },
    {
      icon: '🎯',
      title: 'Strategy',
      description: 'Providing strategic consulting to help you make informed decisions about your digital products.',
      features: [
        'Technical consultation',
        'Architecture planning',
        'Performance optimization',
        'Technology selection'
      ]
    },
    {
      icon: '🚀',
      title: 'Branding',
      description: 'Building strong brand identities that resonate with your audience and stand out in the market.',
      features: [
        'Brand strategy',
        'Visual identity',
        'Logo design',
        'Brand guidelines'
      ]
    }
  ];
}
