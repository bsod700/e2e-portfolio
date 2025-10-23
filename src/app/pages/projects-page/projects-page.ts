import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Project {
  emoji: string;
  title: string;
  description: string;
  details: string;
  tags: string[];
  badge?: string;
}

@Component({
  selector: 'app-projects-page',
  imports: [
    RouterLink
  ],
  templateUrl: './projects-page.html',
  styleUrl: './projects-page.scss'
})
export class ProjectsPageComponent {
  projects: Project[] = [
    {
      emoji: '🎬',
      title: 'HEPROD',
      description: 'Building a Custom Media Platform from Scratch',
      details: 'A comprehensive media platform built with modern technologies, featuring custom video players, content management, user authentication, and seamless streaming capabilities. The project involved full-stack development, from database design to frontend implementation.',
      tags: ['Angular', 'Node.js', 'MongoDB', 'AWS', 'TypeScript'],
      badge: 'Featured Project'
    },
    {
      emoji: '🛒',
      title: 'E-Commerce Platform',
      description: 'Full-featured online store with payment integration',
      details: 'Full-featured online store with payment integration, inventory management, and analytics. Built with modern architecture and scalable infrastructure.',
      tags: ['React', 'Node.js', 'Stripe', 'PostgreSQL']
    },
    {
      emoji: '📊',
      title: 'Analytics Dashboard',
      description: 'Real-time data visualization platform',
      details: 'Real-time data visualization platform with interactive charts and reporting features. Provides actionable insights with beautiful, intuitive interfaces.',
      tags: ['Angular', 'D3.js', 'Python', 'Redis']
    },
    {
      emoji: '💬',
      title: 'Social Network App',
      description: 'Community platform with real-time messaging',
      details: 'Community platform with real-time messaging, feeds, and user interactions. Designed for scalability and performance with millions of users.',
      tags: ['React Native', 'Firebase', 'Node.js', 'WebSockets']
    },
    {
      emoji: '🏥',
      title: 'Healthcare Portal',
      description: 'Patient management and telemedicine platform',
      details: 'Secure healthcare platform with patient records, appointment scheduling, and video consultations. HIPAA compliant with enterprise-grade security.',
      tags: ['Vue.js', 'Python', 'PostgreSQL', 'WebRTC']
    }
  ];
}

