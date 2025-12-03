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
  ProjectStrategicData,
  ProjectStrategicComponent,
  ProjectProcessData,
  ProjectProcessComponent,
  ProjectSideImgCardsData,
  ProjectSideImgCardsComponent,
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
  strategicData: ProjectStrategicData;
  processData: ProjectProcessData;
  theExtensionData: ProjectSideImgCardsData;
  lessonLearnedData: ProjectSideImgCardsData;
  thanksData: ProjectThanksData;
}

const TIERRO_TOC_SECTIONS: readonly TocSection[] = [
    { id: 'header', title: 'Overview' },
    { id: 'stacks', title: 'Tech Stack' },
    { id: 'role-impact', title: 'Role & Impact' },
    { id: 'nutshell', title: 'In a Nutshell' },
    { id: 'strategic-goals', title: 'Strategic Goals' },
    { id: 'design-process', title: 'Design Process' },
    { id: 'the-extension', title: 'The Extension' },
    { id: 'lessons-learned', title: 'Lessons Learned' },
    { id: 'thanks', title: 'Thanks For Watching!' },
];

const TIERRO_PROJECT_DATA = {
    headerData: {
      name: 'prompt-management',
      title: 'Complete Prompt Management Solution',
      logoComponent: true,
      description:
        'Built a personal prompt library extension for ChatGPT. Custom UI/UX design and full development to organize and manage prompts efficiently.',
      img: { src: 'assets/images/projects/prompt-management/header-image.webp', alt: 'Prompt management project image' },
      cta: {
        text: 'Download Extension',
        href: '',
        target: '_blank',
      },
      circles: [
        ''
      ],
    },
    stacksData: {
      projectName: 'prompt-management',
      circles: [
        '','',''
      ],
      services: [
        { name: 'UI/UX Design', icon: 'assets/images/icons/uiux.svg' },
        { name: 'Logo', icon: 'assets/images/icons/logo.svg' },
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
          name: 'Retrieval Search',
          icon: 'assets/images/icons/box-search.svg',
        },
        {
          name: 'E2E Testing',
          icon: 'assets/images/icons/test.svg',
        },
        {
          name: 'JWT',
          icon: 'assets/images/icons/connection-cloud.svg',
        }
      ],
      technologies: [
        { name: 'Illustrator', icon: 'assets/images/icons/illustrator.svg' },
        { name: 'Photoshop', icon: 'assets/images/icons/photoshop.svg' },
        { name: 'Figma', icon: 'assets/images/icons/figma.svg' },
        { name: 'cursor', icon: 'assets/images/icons/development.svg' },
        { name: 'Github', icon: 'assets/images/icons/github.svg' },
        { name: 'Typescript', icon: 'assets/images/icons/dev-sheet.svg' },
        { name: 'Babel', icon: 'assets/images/icons/db.svg' },
        { name: 'Jest', icon: 'assets/images/icons/db.svg' },
      ],
    },
    sideTextsData: {
      titleLeft: 'Role',
      titleRight: 'Impact',
      textLeft:
        "I handled the entire project independently, from initial concept to final deployment. This included identifying my own workflow pain points, designing the user interface and experience, and developing the complete extension from scratch. I made all product decisions, implemented the frontend and backend functionality, and tested the tool extensively through real daily use with ChatGPT.",
      textRight:
      "The extension transformed how I work with ChatGPT on a daily basis. What used to be scattered prompts across different files and notes became an organized, instantly accessible library. I can now find and use prompts in seconds instead of minutes, significantly speeding up my workflow. The tool eliminated the frustration of recreating prompts from memory and gave me a reliable system for managing my growing collection. Beyond personal productivity, it validated my ability to identify problems and build practical solutions that make a real difference in how I work."
    },
    nutshellData: {
      projectName: 'prompt-management',
      title: 'In a Nutshell',
      text: 'P is a personal productivity tool built to solve a real workflow challenge. As someone who frequently uses ChatGPT for various tasks, managing and organizing prompts became increasingly difficult. The extension was created to streamline this process, providing quick access to a growing library of prompts and eliminating the time spent searching through scattered notes and files.'
    },
    strategicData: {
      title: 'Strategic Goals',
      sectionName: 'strategic-goals',
      text: 'As a frequent ChatGPT user, I needed a solution to manage my growing collection of prompts efficiently. Without a centralized system, prompts were scattered across notes, documents, and memory, slowing down my workflow. The goal was to create a personal tool that would organize, store, and provide instant access to prompts, eliminating frustration and improving daily productivity.',
      cards: [
        {
          title: '01',
          text: "Create a single, organized library where all prompts are stored and easily accessible. Eliminate the scattered approach of keeping prompts in different files, notes, and trying to remember variations from memory.",
          subtitle: 'Centralize Prompt Management',
          projectName: 'prompt-management',
          backgroundImages: ['assets/images/projects/tierro/lines.svg'],
        },
        {
          title: '02',
          text: 'Build an interface that allows instant retrieval of prompts without searching through files or folders. Reduce the time from needing a prompt to actually using it in ChatGPT.',
          subtitle: 'Enable Quick Access',
          projectName: 'prompt-management',
          backgroundImages: ['assets/images/projects/tierro/lines.svg'],
        },
        {
          title: '03',
          text: 'Streamline the process of working with ChatGPT by removing friction points. Make prompt usage seamless and efficient, allowing focus on the actual work rather than prompt management.',
          subtitle: 'Improve Daily Workflow',
          projectName: 'prompt-management',
          backgroundImages: ['assets/images/projects/tierro/lines.svg'],
        },
        {
          title: '04',
          text: 'Provide intuitive categorization and tagging systems that make sense for different use cases. Allow flexible organization that adapts to various types of prompts and workflows.',
          subtitle: 'Support Prompt Organization',
          projectName: 'prompt-management',
          backgroundImages: ['assets/images/projects/tierro/lines.svg'],
        },
        {
          title: '05',
          text: 'Build a lightweight, fast-loading extension that doesn\'t slow down the browser or ChatGPT interface. Ensure prompts are always available when needed without technical issues.',
          subtitle: 'Ensure Reliability and Speed',
          projectName: 'prompt-management',
          backgroundImages: ['assets/images/projects/tierro/lines.svg'],
        },
        {
          title: '06',
          text: 'Design a system that can grow with an expanding prompt library. Ensure the tool remains efficient and usable even with hundreds of saved prompts over time.',
          subtitle: 'Create Scalable Solution',
          projectName: 'prompt-management',
          backgroundImages: ['assets/images/projects/tierro/lines.svg'],
        }
      ],
      backgroundImages: [
        'assets/images/projects/tierro/lines.svg',
      ],
      backgroundCircles: [
        '',
        '',
      ],
      projectName: 'prompt-management',
    },
    processData: {
      projectName: 'tierro',
      title: 'Design Process',
      description:
        "From initial research to final launch, the design process focused on understanding Tierro's vision and translating it into a functional, beautiful platform. Every decision was guided by user needs and brand authenticity.",
      steps: [
        {
          title: '01.',
          subtitle: 'Research',
          text: "Conducted thorough research to understand the client's needs and current trends in music industry web design.",
          projectName: 'tierro',
          backgroundImages: ['assets/images/projects/tierro/lines.svg'],
        },
        {
          title: '02.',
          subtitle: 'Wireframes',
          text: 'Created wireframes to visualize the layout and structure of the webpage, focusing on usability and aesthetics.',
          projectName: 'tierro',
          backgroundImages: ['assets/images/projects/tierro/lines.svg'],
        },
        {
          title: '03.',
          subtitle: 'Design',
          text: 'Developed engaging visuals and a cohesive brand identity, including the logo and overall visual style.',
          projectName: 'tierro',
          backgroundImages: ['assets/images/projects/tierro/lines.svg'],
        },
        {
          title: '04.',
          subtitle: 'Development',
          text: 'Implemented the design using Angular, ensuring responsiveness and performance, and developing a custom music player.',
          projectName: 'tierro',
          backgroundImages: ['assets/images/projects/tierro/lines.svg'],
        },
        {
          title: '05.',
          subtitle: 'Admin Page Development',
          text: 'Created an admin page for the client to update content such as reviews and music.',
          projectName: 'tierro',
          backgroundImages: ['assets/images/projects/tierro/lines.svg'],
        },
        {
          title: '06.',
          subtitle: 'Testing',
          text: 'Conducted extensive testing to identify and resolve any issues, ensuring a smooth and error-free user experience.',
          projectName: 'tierro',
          backgroundImages: ['assets/images/projects/tierro/lines.svg'],
        },
        {
          title: '07.',
          subtitle: 'Launch',
          text: 'Deployed the final product, ensuring everything was optimized and functioning as intended.',
          projectName: 'tierro',
          backgroundImages: ['assets/images/projects/tierro/lines.svg'],
        },
      ],
    },
    theExtensionData: {
      projectName: 'tierro',
      title: 'Producer Client Page',
      text: "The Producer Client Page is a visually appealing and user-friendly platform designed for clients and fans to explore the music producer's work.",
      sideDirection: 'left',
      cards: [
        {
          title: 'Showcase Music',
          text: "Features a custom music player to seamlessly showcase the producer's tracks without relying on external platforms.",
          icon: 'assets/images/icons/music-tav.svg',
          backgroundImages: ['assets/images/projects/tierro/lines.svg'],
        },
        {
          title: 'Engaging Visuals',
          text: "Utilizes engaging visuals and a cohesive brand identity to capture the essence of the music producer's style and creative vision.",
          icon: 'assets/images/icons/smileys.svg',
          backgroundImages: ['assets/images/projects/tierro/lines.svg'],
        },
        {
          title: 'Client Reviews',
          text: 'Highlights client reviews and testimonials to build credibility, establish trust, and connect authentically with the audience.',
          icon: 'assets/images/icons/like-tag.svg',
          backgroundImages: ['assets/images/projects/tierro/lines.svg'],
        },
      ],
      image: 'assets/images/projects/tierro/producer-mac.webp',
      sectionName: 'producer-client-page',
    },
    lessonLearnedData: {
      projectName: 'tierro',
      title: 'Lessons Learned',
      sideDirection: 'left',
      cards: [
        {
          title: 'Building a Brand Identity from Nothing',
          text: 'Creating a brand from scratch taught me to spend real time understanding what the client wants their identity to feel like.',
          icon: 'assets/images/icons/document.svg',
          backgroundImages: ['assets/images/projects/tierro/lines.svg'],
        },
        {
          title: 'Custom Audio Players Are Tricky',
          text: 'Building the music player was harder than expected. Balancing visual appeal with performance, loading speed, and browser compatibility took serious tweaking.',
          icon: 'assets/images/icons/music-tav.svg',
          backgroundImages: ['assets/images/projects/tierro/lines.svg'],
        },
        {
          title: 'Making Things Easy for Non-Technical Users',
          text: 'The admin page showed me that developer-friendly isn\'t user-friendly. I had to design for someone who\'d never need my help again.',
          icon: 'assets/images/icons/user-tag.svg',
          backgroundImages: ['assets/images/projects/tierro/lines.svg'],
        },
        {
          title: 'Testing and Tweaking Makes All the Difference',
          text: 'I went through way more iterations than planned. But that\'s where things got good. Feedback helped me catch what I missed initially.',
          icon: 'assets/images/icons/task-square.svg',
          backgroundImages: ['assets/images/projects/tierro/lines.svg'],
        },
      ],
      image: 'assets/images/projects/tierro/logo-result.svg',
      sectionName: 'lesson-learned',
      backgroundCircles: [
        '',
        '',
      ]
    },
    thanksData: {
      projectName: 'tierro',
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
  selector: 'app-prompt-management-project',
  imports: [
    ProjectHeaderComponent,
    CommonModule,
    ProjectStacksComponent,
    ProjectSideTextsComponent,
    ProjectNutshellComponent,
    ProjectStrategicComponent,
    ProjectProcessComponent,
    ProjectSideImgCardsComponent,
    TableOfContentsComponent,
    ProjectThanksComponent,
  ],
  templateUrl: './prompt-management-project.html',
  styleUrl: './prompt-management-project.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PromptManagementProjectComponent {
  readonly tocSections: TocSection[] = [...TIERRO_TOC_SECTIONS];
  readonly projectData: ProjectData = TIERRO_PROJECT_DATA;
}

