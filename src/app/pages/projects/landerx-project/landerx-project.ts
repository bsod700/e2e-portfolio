import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  ProjectHeaderComponent,
  ProjectHeaderData,
  ProjectStacksData,
  ProjectStacksComponent,
  ProjectSideTextsData,
  ProjectSideTextsComponent,
  ProjectNutshellData,
  ProjectNutshellComponent,
  TableOfContentsComponent,
  TocSection,
  ProjectThanksData,
  ProjectThanksComponent,
} from '../../../components/projects';
import { CommonModule } from '@angular/common';
export interface ProjectData {
  headerData: ProjectHeaderData;
  stacksData: ProjectStacksData;
  sideTextsData: ProjectSideTextsData;
  nutshellData: ProjectNutshellData;
  thanksData: ProjectThanksData;
}

const TOC_SECTIONS: readonly TocSection[] = [
    { id: 'header', title: 'Overview' },
    { id: 'stacks', title: 'Tech Stack' },
    { id: 'role-impact', title: 'Role & Impact' },
    { id: 'nutshell', title: 'In a Nutshell' },
    { id: 'thanks', title: 'Thanks For Watching!' },
];

const PROJECT_DATA = {
    headerData: {
      name: 'landerx',
      title: 'End-to-End SaaS Platform for Marketing',
      logoUrl: 'assets/images/projects/project-logo-landerx.svg',
      description:
        'Co-founded and developed an AI-powered marketing platform. Automated workflows generate high-performance landing pages, content, and campaigns for small business clients.',
      img: { src: 'assets/images/projects/landerx/header-image.webp', alt: 'LanderX project image' },
      circles: [
        ''
      ],
    },
    stacksData: {
      projectName: 'landerx',
      circles: [
        '','',''
      ],
      services: [
        { name: 'UI/UX Design', icon: 'assets/images/icons/uiux.svg' },
        { name: 'Logo & Branding', icon: 'assets/images/icons/logo.svg' },
        {
          name: 'Development',
          icon: 'assets/images/icons/development.svg',
        },
        {
          name: 'Prompt Engineering',
          icon: 'assets/images/icons/cpu.svg',
        },
        {
          name: 'AI Integration',
          icon: 'assets/images/icons/ai-integration.svg',
        },
        {
          name: 'Brand Mascot & Illustrations',
          icon: 'assets/images/icons/diamond.svg',
        },
        {
          name: 'Social Media Banners',
          icon: 'assets/images/icons/people.svg',
        },
        {
          name: 'AI Automation',
          icon: 'assets/images/icons/automation.svg',
        },
        {
          name: 'Landing Page Builder',
          icon: 'assets/images/icons/keyboard-open.svg',
        },
        {
          name: 'Component System',
          icon: 'assets/images/icons/component.svg',
        },
        {
          name: 'Design System',
          icon: 'assets/images/icons/box-line.svg',
        },
        {
          name: 'Content Creation',
          icon: 'assets/images/icons/text.svg',
        },
      ],
      technologies: [
        { name: 'Illustrator', icon: 'assets/images/icons/illustrator.svg' },
        { name: 'Photoshop', icon: 'assets/images/icons/photoshop.svg' },
        { name: 'Figma', icon: 'assets/images/icons/figma.svg' },
        { name: 'cursor', icon: 'assets/images/icons/development.svg' },
        { name: 'Github', icon: 'assets/images/icons/github.svg' },
        { name: 'Typescript', icon: 'assets/images/icons/dev-sheet.svg' },
        { name: 'Angular', icon: 'assets/images/icons/development.svg' },
        { name: 'Tailwind', icon: 'assets/images/icons/wind.svg' },
        { name: 'Airtable', icon: 'assets/images/icons/table.svg' },
        { name: 'Posthog', icon: 'assets/images/icons/chart.svg' },
        { name: 'PrimeNG', icon: 'assets/images/icons/db.svg' },
      ],
    },
    sideTextsData: {
      titleLeft: 'Role',
      titleRight: 'Impact',
      textLeft:
        "I am the founder, designer and developer behind LanderX. I led the project end-to-end: product vision, research, branding, UX and UI, development of the SaaS platform, landing page builder, component system, AI prompt workflows, backend API and client management. I built the entire interface, logic and infrastructure, handled communication with clients, collected requirements, delivered solutions and iterated based on feedback and analytics data.",
      textRight: "LanderX reduces landing-page production time from days to minutes. Instead of designing or coding a new page each time, users submit a brief and receive a complete landing page with content, layout and visuals ready for editing and publishing. This allowed rapid MVP launches for early clients, improved iteration speed and removed the bottleneck of manual design and copywriting. Analytics instrumentation using PostHog provided insights into usage behavior, conversion flow and UI friction points, allowing measurable UX improvements backed by real data rather than assumptions."
    },
    nutshellData: {
      projectName: 'landerx',
      title: 'In a Nutshell',
      text: 'LanderX is an AI-powered SaaS platform I built to automate landing page creation.  It generates full landing pages from a user brief, including copy, sections and design structure, with an editor for customizing layout and content.  The system integrates with Airtable, email and analytics to support content workflows, automation and performance tracking.  This project demonstrates product ownership, branding, UX design, full-stack development, AI automation and client-oriented delivery combined into one product.'
    },
    thanksData: {
      projectName: 'landerx',
      title: 'Thanks For Watching!',
      projectKicker: 'The next step',
      projectTitle: 'Ready to Start Your Project?',
      projectDescription: 'Tell me what you need and I’ll help you bring it to life.',
      backgroundCircles: [
        '',
        '',
        ''
      ],
    }
  } as const satisfies ProjectData;


@Component({
  selector: 'app-landerx-project',
  imports: [
    ProjectHeaderComponent,
    CommonModule,
    ProjectStacksComponent,
    ProjectSideTextsComponent,
    ProjectNutshellComponent,
    TableOfContentsComponent,
    ProjectThanksComponent,
  ],
  templateUrl: './landerx-project.html',
  styleUrl: './landerx-project.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LanderxProjectComponent {
  readonly tocSections: TocSection[] = [...TOC_SECTIONS];
  readonly projectData: ProjectData = PROJECT_DATA;
}

