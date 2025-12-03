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
      description:
        'Built a personal prompt library extension for ChatGPT. Custom UI/UX design and full development to organize and manage prompts efficiently.',
      logoUrl: 'assets/images/projects/project-logo-p.svg',
      img: { src: 'assets/images/projects/prompt-management/header-image.webp', alt: 'Prompt management project image' },
      cta: {
        text: 'Download Extension',
        href: '',
        target: '_blank',
      },
    },
    stacksData: {
      projectName: 'prompt-management',
      services: [
        { name: 'UI/UX Design', icon: 'assets/images/icons/uiux.svg' },
        { name: 'Logo', icon: 'assets/images/icons/logo.svg' },
        {
          name: 'Development',
          icon: 'assets/images/icons/development.svg',
        },
        {
          name: 'Extension Development',
          icon: 'assets/images/icons/extension-development.svg',
        },
        {
          name: 'Prompt Engineering',
          icon: 'assets/images/icons/prompt-engineering.svg',
        },
        {
          name: 'AI Integration',
          icon: 'assets/images/icons/ai-integration.svg',
        },
        {
          name: 'Retrieval Search',
          icon: 'assets/images/icons/api-integration.svg',
        },
        {
          name: 'E2E Testing',
          icon: 'assets/images/icons/database.svg',
        },
        {
          name: 'JWT',
          icon: 'assets/images/icons/deployment.svg',
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
        "I handled the complete development of Tierro's digital brand from start to finish. This included designing the visual identity and logo, creating a user-friendly webpage layout that showcases his work, and building a custom music player tailored to his needs. I ensured the site was fully responsive across all devices and designed an intuitive user experience that encourages exploration. On the development side, I coded the entire frontend and backend, implemented the admin dashboard for easy content management, and conducted thorough testing to ensure smooth functionality across all platforms.",
      textRight:
        "The platform established Tierro's professional digital presence, enabling him to showcase his music portfolio and connect directly with his audience. Through the custom admin dashboard, he maintains full control over content updates and brand management. This integrated solution provides a seamless experience for visitors while positioning him to attract clients and grow his reach independently of third-party platforms.",
    },
    nutshellData: {
      title: 'In a Nutshell',
      text: 'Tierro is a professional music producer specializing in pop, R&B, and electronic music. He works with singers to craft tracks that match their unique vision and style. His productions have generated millions of streams and caught the attention of major labels like Warner and Global Records.',
    },
    strategicData: {
      title: 'Strategic Goals',
      sectionName: 'strategic-goals',
      text: 'Tierro needed a digital platform that would elevate his professional presence and provide direct access to his audience. Without an existing logo or visual identity, the goal was to create a complete brand experience from scratch that showcases his work, attracts potential collaborators, and gives him full control over his content without depending on third-party platforms.',
      cards: [
        {
          title: '01',
          text: "Design a logo and visual identity that speaks Tierro's language and reflects his creative style. Establish a consistent brand presence that makes him instantly recognizable across all touchpoints and elevates his professional image in the music industry.",
          subtitle: 'Create a Cohesive Brand Identity',
          projectName: 'tierro',
          backgroundImages: ['assets/images/projects/tierro/lines.svg'],
        },
        {
          title: '02',
          text: 'Build a branded platform that positions Tierro as a serious industry professional, making it easy for labels, artists, and fans to discover his work and understand his unique production style through a polished, cohesive experience.',
          subtitle: 'Establish Professional Digital Presence',
          projectName: 'tierro',
          backgroundImages: ['assets/images/projects/tierro/lines.svg'],
        },
        {
          title: '03',
          text: 'Create a seamless experience where visitors can explore his music catalog, understand his creative process, and engage with his brand without leaving the platform or relying on external streaming services.',
          subtitle: 'Enable Direct Audience Connection',
          projectName: 'tierro',
          backgroundImages: ['assets/images/projects/tierro/lines.svg'],
        },
        {
          title: '04',
          text: 'Provide full control through an admin dashboard, allowing Tierro to update music, manage projects, and maintain his brand identity independently while scaling his reach and client base.',
          subtitle: 'Achieve Content Independence',
          projectName: 'tierro',
          backgroundImages: ['assets/images/projects/tierro/lines.svg'],
        },
      ],
      backgroundImages: [
        'assets/images/projects/tierro/cable.svg',
        'assets/images/projects/tierro/lines.svg',
      ],
      projectName: 'tierro',
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

