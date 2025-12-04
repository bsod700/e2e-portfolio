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
  ProjectStyleGuideData,
  ProjectStyleGuideComponent,
  ProjectSideImgTextData,
  ProjectSideImgTextComponent,
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
  styleGuideData: ProjectStyleGuideData;
  screensSection: {
    title: string;
    text: string;
  },
  onboardingScreenData: ProjectSideImgTextData;
  homeScreenData: ProjectSideImgTextData;
  categoryScreenData: ProjectSideImgTextData;
  settingsScreenData: ProjectSideImgTextData;
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
    { id: 'prompt-library-screens', title: 'Prompt Library Screens' },
    { id: 'lessons-learned', title: 'Lessons Learned' },
    { id: 'style-guide', title: 'Style Guide' },
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
      projectName: 'prompt-management',
      title: 'Design Process',
      description:
        "This project followed a practical, iterative approach driven by personal need and real-world testing. Each phase focused on solving specific workflow challenges, ensuring the final tool genuinely improved daily productivity with ChatGPT.",
      steps: [
        {
          title: '01.',
          subtitle: 'Research',
          text: "Analyzed my workflow, identified pain points, and defined what features would genuinely solve prompt management issues.",
          projectName: 'prompt-management',
          backgroundImages: ['assets/images/projects/tierro/lines.svg'],
        },
        {
          title: '02.',
          subtitle: 'User Flow',
          text: 'Mapped out how I\'d interact with prompts daily: saving, searching, organizing, and quickly inserting into ChatGPT.',
          projectName: 'prompt-management',
          backgroundImages: ['assets/images/projects/tierro/lines.svg'],
        },
        {
          title: '03.',
          subtitle: 'Screens',
          text: 'Sketched key screens: library view, search interface, add prompt form, and settings for managing the extension.',
          projectName: 'prompt-management',
          backgroundImages: ['assets/images/projects/tierro/lines.svg'],
        },
        {
          title: '04.',
          subtitle: 'Design',
          text: 'Created clean, minimal UI focused on speed. Designed intuitive layouts that required minimal clicks to access prompts.',
          projectName: 'prompt-management',
          backgroundImages: ['assets/images/projects/tierro/lines.svg'],
        },
        {
          title: '05.',
          subtitle: 'Development',
          text: 'Built the complete extension: storage system, search functionality, ChatGPT integration, and all interface components from scratch.',
          projectName: 'prompt-management',
          backgroundImages: ['assets/images/projects/tierro/lines.svg'],
        },
        {
          title: '06.',
          subtitle: 'Testing',
          text: 'Tested through daily real-world use. Identified bugs, usability issues, and areas where workflow could be smoother.',
          projectName: 'prompt-management',
          backgroundImages: ['assets/images/projects/tierro/lines.svg'],
        },
        {
          title: '07.',
          subtitle: 'Refinement',
          text: 'Improved based on testing feedback. Added helpful features, removed friction points, and optimized overall user experience continuously.',
          projectName: 'prompt-management',
          backgroundImages: ['assets/images/projects/tierro/lines.svg'],
        },
        {
          title: '08.',
          subtitle: 'Final Polish',
          text: 'Refined visual details, optimized performance, ensured stability. Created a reliable tool that became essential for daily work.',
          projectName: 'prompt-management',
          backgroundImages: ['assets/images/projects/tierro/lines.svg'],
        },
      ],
    },
    theExtensionData: {
      projectName: 'prompt-management',
      title: 'Prompt Library Extension',
      text: "The P Extension is a lightweight and intuitive tool designed to streamline prompt management directly within the ChatGPT interface for efficient daily workflow.",
      sideDirection: 'left',
      cards: [
        {
          title: 'Quick Access Library',
          text: "Provides instant access to saved prompts through a clean, organized interface that appears seamlessly alongside ChatGPT conversations.",
          icon: 'assets/images/icons/book.svg',
        },
        {
          title: 'Smart Organization',
          text: "Features categorization and tagging systems that allow prompts to be organized by type, project, or use case for easy retrieval.",
          icon: 'assets/images/icons/light-bulb.svg',
        },
        {
          title: 'One-Click Integration',
          text: 'Enables users to insert prompts directly into ChatGPT with a single click, eliminating copy-paste friction and speeding up workflow.',
          icon: 'assets/images/icons/mouse.svg',
        },
        {
          title: 'Search and Filter',
          text: 'Includes powerful search functionality to quickly find specific prompts from a growing library, even with hundreds of saved items.',
          icon: 'assets/images/icons/search.svg',
        },
      ],
      image: 'assets/images/projects/prompt-management/header-image.webp',
      sectionName: 'prompt-library-extension',
    },
    styleGuideData: {
      projectName: 'prompt-management',
      title: 'Style Guide',
      text: 'Developed a complete style guide defining typography, colors, and visual elements to ensure brand consistency and unified user experience across the entire platform.',
      fontGuideTitle: 'Geist',
      fontGuide: ['Light', 'Regular', 'Bold'],
      colorGuideTitle: 'Color Palette',
      colorGuide: [
        { title: 'Brand', colors: [
          { name: 'Aero', value: '#70B9EE' },
          { name: 'Smoky Black', value: '#0C0C0D' },
        ] },
        { title: 'CTA', colors: [
          { name: 'Spartan Crimson', value: '#961416' },
          { name: 'Fire Opal', value: '#EA624A' },
        ] },
        { title: 'Background', colors: [
          { name: 'Dark Gunmetal', value: '#182434' },
          { name: 'Yankees Blue', value: '#172437' },
        ] },
        { title: 'Text', colors: [
          { name: 'Lotion', value: '#FCFCFC' },
          { name: 'International Orange', value: '#C03B30' }
        ] },
        { title: 'System', colors: [
          { name: 'CG Red', value: '#E24428' },
          { name: 'Chrome Yellow', value: '#F8AA08' },
          { name: 'UFO Green', value: '#20CC6B' },
          { name: 'Fluorescent Blue', value: '#19DEFB' },
        ] },
      ],
    },
    screensSection: {
      title: 'Prompt Library Extension',
      text: 'Complete interface design featuring organized library views, search functionality, and management screens that prioritize speed and efficiency for daily ChatGPT workflow optimization.',
    },
    onboardingScreenData: {
      sideDirection: 'left',
      projectName: 'prompt-management',
      title: 'Simplified Onboarding',
      text: 'Quick and flexible authentication options including email login, sign up, password recovery, and social login through Google or LinkedIn. Designed to get users into the extension fast without friction.',
      image: 'assets/images/projects/prompt-management/onboarding-screen.webp',
      sectionName: 'review-screen',
    },
    homeScreenData: {
      sideDirection: 'right',
      projectName: 'prompt-management',
      title: 'Home & Search Interface',
      text: 'Organized homepage displaying categorized prompts: Favorites, Writing, Code, Design, and Research. Features robust search functionality and tag filtering system for pinpoint accuracy when finding specific prompts.',
      image: 'assets/images/projects/prompt-management/home-screen.webp',
      sectionName: 'review-screen',
    },
    categoryScreenData: {
      sideDirection: 'left',
      projectName: 'prompt-management',
      title: 'Category & Prompt View',
      text: 'Displays all prompts within each selected category. Users can mark prompts as favorites for quick access and click any prompt to automatically insert it into the ChatGPT chat box, eliminating manual copying and pasting.',
      image: 'assets/images/projects/prompt-management/category-screen.webp',
      sectionName: 'review-screen',
    },
    settingsScreenData: {
      sideDirection: 'right',
      projectName: 'prompt-management',
      title: 'Settings & Management',
      text: 'Comprehensive settings panel for importing and exporting prompt libraries, managing account preferences, switching between light and dark modes, selecting language preferences, and accessing FAQ and about information.',
      image: 'assets/images/projects/prompt-management/settings-screen.webp',
      sectionName: 'settings-screen',
      circles: [
       ''
      ],
    },
    lessonLearnedData: {
      projectName: 'prompt-management',
      title: 'Lessons Learned',
      sideDirection: 'left',
      cards: [
        {
          title: 'Building for Yourself Is Different',
          text: 'Creating a tool for my own use meant I could iterate based on real needs instead of assumptions. Every decision was tested immediately.',
          icon: 'assets/images/icons/user.svg',
        },
        {
          title: 'Simplicity Beats Feature Bloat',
          text: 'I initially planned too many features. Stripping it down to essentials made the tool faster and actually more useful in practice.',
          icon: 'assets/images/icons/flash.svg',
        },
        {
          title: 'Real Testing Happens in Daily Use',
          text: 'Using the extension every day revealed issues I\'d never catch in formal testing. Small friction points became obvious through repetition.',
          icon: 'assets/images/icons/calendar-circle.svg',
        },
        {
          title: 'Performance Matters More Than Expected',
          text: 'Even slight delays in loading or searching became annoying with frequent use. Optimizing speed made a huge difference in actual adoption.',
          icon: 'assets/images/icons/diagram.svg',
        },
        {
          title: 'Room to Grow',
          text: 'This project showed me the value of starting simple and expanding based on use. I\'m planning to add support for Claude, Gemini, and other AI platforms to make prompt management universal across all tools.',
          icon: 'assets/images/icons/status-up.svg',
        },
      ],
      image: 'assets/images/projects/prompt-management/logo-result.webp',
      sectionName: 'lesson-learned',
      backgroundCircles: [
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
    ProjectStyleGuideComponent,
    ProjectSideImgTextComponent, 
  ],
  templateUrl: './prompt-management-project.html',
  styleUrl: './prompt-management-project.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PromptManagementProjectComponent {
  readonly tocSections: TocSection[] = [...TIERRO_TOC_SECTIONS];
  readonly projectData: ProjectData = TIERRO_PROJECT_DATA;
}

