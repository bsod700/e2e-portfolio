import { Component } from '@angular/core';
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
  ProjectAudienceData,
  ProjectAudienceComponent,
  ProjectPersonasData,
  ProjectPersonasComponent,
} from '../../../components/projects';
import { CommonModule } from '@angular/common';

export interface ProjectData {
  headerData: ProjectHeaderData;
  stacksData: ProjectStacksData;
  sideTextsData: ProjectSideTextsData;
  nutshellData: ProjectNutshellData;
  strategicData: ProjectStrategicData;
  processData: ProjectProcessData;
  producerClientPageData: ProjectSideImgCardsData;
  adminPageData: ProjectSideImgCardsData;
  audienceData: ProjectAudienceData;
  personasData: ProjectPersonasData;
}
@Component({
  selector: 'app-tierro-project',
  imports: [
    ProjectHeaderComponent,
    CommonModule,
    ProjectStacksComponent,
    ProjectSideTextsComponent,
    ProjectNutshellComponent,
    ProjectStrategicComponent,
    ProjectProcessComponent,
    ProjectSideImgCardsComponent,
    ProjectAudienceComponent,
    ProjectPersonasComponent,
  ],
  templateUrl: './tierro-project.html',
  styleUrl: './tierro-project.scss',
})
export class TierroProjectComponent {
  projectData: ProjectData = {
    headerData: {
      name: 'tierro',
      title: 'Building a Custom Music Platform from Scratch',
      description:
        'Full-scale digital brand for music producer Tierro. Custom website, integrated music player, brand identity, and backend systems built end to end.',
      logoUrl: 'assets/images/projects/project-logo-tierro.svg',
      img: { src: 'assets/images/projects/tierro/header-image.webp', alt: 'Tierro project image' },
      backgroundImages: ['assets/images/projects/project-logo-tierro.svg'],
      cta: {
        text: 'Visit Website',
        href: 'https://www.tierromusic.com/',
        target: '_blank',
      },
    },
    stacksData: {
      projectName: 'tierro',
      services: [
        { name: 'UI/UX Design', icon: 'assets/images/projects/tierro/services/ui-ux-design.svg' },
        { name: 'Logo', icon: 'assets/images/projects/tierro/services/branding.svg' },
        {
          name: 'Design System',
          icon: 'assets/images/projects/tierro/services/music-production.svg',
        },
        {
          name: 'Admin Management',
          icon: 'assets/images/projects/tierro/services/music-distribution.svg',
        },
        { name: 'Portfolio', icon: 'assets/images/projects/tierro/services/music-promotion.svg' },
        {
          name: 'Music Player',
          icon: 'assets/images/projects/tierro/services/music-marketing.svg',
        },
        {
          name: 'Development',
          icon: 'assets/images/projects/tierro/services/music-management.svg',
        },
      ],
      technologies: [
        { name: 'Illustrator', icon: 'assets/images/projects/tierro/technologies/angular.svg' },
        { name: 'Photoshop', icon: 'assets/images/projects/tierro/technologies/angular.svg' },
        { name: 'Figma', icon: 'assets/images/projects/tierro/technologies/angular.svg' },
        { name: 'Angular', icon: 'assets/images/projects/tierro/technologies/angular.svg' },
        { name: 'Material', icon: 'assets/images/projects/tierro/technologies/angular.svg' },
        { name: 'Github', icon: 'assets/images/projects/tierro/technologies/angular.svg' },
        { name: 'WebPack', icon: 'assets/images/projects/tierro/technologies/angular.svg' },
        { name: 'FireBase', icon: 'assets/images/projects/tierro/technologies/angular.svg' },
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
    producerClientPageData: {
      projectName: 'tierro',
      title: 'Producer Client Page',
      text: "The Producer Client Page is a visually appealing and user-friendly platform designed for clients and fans to explore the music producer's work.",
      sideDirection: 'left',
      cards: [
        {
          title: 'Showcase Music',
          text: "Features a custom music player to seamlessly showcase the producer's tracks without relying on external platforms.",
          icon: '',
          backgroundImages: ['assets/images/projects/tierro/lines.svg'],
        },
        {
          title: 'Engaging Visuals',
          text: "Utilizes engaging visuals and a cohesive brand identity to capture the essence of the music producer's style and creative vision.",
          icon: '',
          backgroundImages: ['assets/images/projects/tierro/lines.svg'],
        },
        {
          title: 'Client Reviews',
          text: 'Highlights client reviews and testimonials to build credibility, establish trust, and connect authentically with the audience.',
          icon: '',
          backgroundImages: ['assets/images/projects/tierro/lines.svg'],
        },
      ],
      image: 'assets/images/projects/tierro/side-img-cards.svg',
    },
    adminPageData: {
      projectName: 'tierro',
      title: 'Admin Page',
      text: 'The Admin Page is a private, user-friendly interface designed for the music producer to manage and update their content easily.',
      sideDirection: 'right',
      cards: [
        {
          title: 'Content Management',
          text: 'Allows the producer to update reviews and music tracks effortlessly, maintaining full control over their portfolio and public presence.',
          icon: '',
          backgroundImages: ['assets/images/projects/tierro/lines.svg'],
        },
        {
          title: 'User-Friendly Interface',
          text: 'Designed for ease of use, ensuring the producer can quickly make changes without technical expertise or external assistance.',
          icon: '',
          backgroundImages: ['assets/images/projects/tierro/lines.svg'],
        },
        {
          title: 'Dynamic Updates',
          text: 'Ensures the public-facing site remains current and engaging by allowing for real-time content updates across all sections.',
          icon: '',
          backgroundImages: ['assets/images/projects/tierro/lines.svg'],
        },
      ],
      image: 'assets/images/projects/tierro/side-img-cards.svg',
    },
    audienceData: {
      projectName: 'tierro',
      title: 'Target Audience',
      sideLeftTitle: 'Clients',
      sideLeftCards: [
        {
          title: 'Potential Collaborators',
          text: 'artists, bands, and music industry professionals actively seeking a producer who aligns with their artistic vision and can bring their musical ideas to life.',
          icon: '',
        },
        {
          title: 'Record Labels and A&R',
          text: 'Industry decision-makers looking to discover talented producers for their roster of artists, evaluating production quality and past collaborations.',
          icon: '',
        },
        {
          title: 'Independent Artists',
          text: 'Solo musicians and songwriters who need professional production services to elevate their tracks and compete in the streaming landscape.',
          icon: '',
        },
      ],
      sideRightTitle: 'Fans',
      sideRightCards: [
        {
          title: 'Music Enthusiasts',
          text: "Individuals who enjoy and appreciate Tierro's productions, seeking an immersive way to discover his catalog and stay updated on new releases.",
          icon: '',
        },
        {
          title: 'Genre Followers',
          text: 'Fans of pop, R&B, and electronic music who explore producer portfolios to discover new sounds and understand the creative process behind their favorite tracks.',
          icon: '',
        },
        {
          title: 'General Audience',
          text: "Casual visitors who are curious about the producer's work and want to explore his music, read client reviews, and learn about his approach.",
          icon: '',
        },
      ],
    },
    personasData: {
      projectName: 'tierro',
      title: 'Personas',
      text: 'Developed detailed user personas to represent each audience segment, understanding their specific motivations, frustrations, and goals when seeking a music producer.',
      personas: [
        {
          name: 'Sarah',
          image: 'assets/images/projects/tierro/persona-alex.webp',
          attributes: [
            { icon: '', name: 'Age', value: '28 years' },
            { icon: '', name: 'Location', value: 'Los Angeles, CA' },
            { icon: '', name: 'Education', value: "Bachelor's Degree in Music" },
            { icon: '', name: 'Occupation', value: 'Indie Musician' },
          ],
          wants: [
            {
              icon: '',
              value:
                'Reliable music producer for collaboration'
            },
            {
              icon: '',
              value: 'Easy access to the producer\'s portfolio'
            },
            {
              icon: '',
              value: 'Clear communication and feedback channels'
            },
          ],
          frustrations: [
            {
              icon: '',
              value:
                'Difficulty finding producers with a strong online presence'
            },
            {
              icon: '',
              value: 'Limited access to high-quality work samples'
            },
            {
              icon: '',
              value: 'Time-consuming search process'
            },
          ],
          bio: 'Sarah is a dedicated indie musician based in Los Angeles. She is constantly looking for talented producers to collaborate with on her projects. Sarah values efficiency and clarity in communication and is frustrated by the lack of easily accessible information about potential collaborators.',
        },
        {
          name: 'Alex',
          image: 'assets/images/projects/tierro/personas/potential-collaborators.svg',
          attributes: [
            { icon: '', name: 'Age', value: '22 years' },
            { icon: '', name: 'Location', value: 'Austin, TX' },
            { icon: '', name: 'Education', value: 'College Student, studying Communications' },
            { icon: '', name: 'Occupation', value: 'College Student' },
          ],
          wants: [
            {
              icon: '',
              value:
                'Discover new and exciting music'
            },
            {
              icon: '',
              value: 'Learn more about favorite music producers'
            },
            {
              icon: '',
              value: 'Access to curated music collections'
            },
          ],
          frustrations: [
            {
              icon: '',
              value:
                'Limited access to high-quality, curated music'
            },
            {
              icon: '',
              value: 'Difficulty finding detailed information about producers'
            },
            {
              icon: '',
              value: 'Cluttered and confusing websites'
            },
          ],
          bio: 'Alex is a college student with a passion for discovering new music. He enjoys learning about the backgrounds of his favorite music producers and sharing new finds with friends. Alex values easy navigation and aesthetically pleasing websites that provide comprehensive information.'
        },
        {
          name: 'Emily',
          image: 'assets/images/projects/tierro/personas/potential-collaborators.svg',
          attributes: [
            { icon: '', name: 'Age', value: '30 years' },
            { icon: '', name: 'Location', value: 'Nashville, TN' },
            { icon: '', name: 'Education', value: 'Bachelor\'s Degree in Vocal Performance' },
            { icon: '', name: 'Occupation', value: 'Singer and Songwriter' },
          ],
          wants: [
            {
              icon: '',
              value:
                'Singer and Songwriter'
            },
            {
              icon: '',
              value: 'A portfolio showcasing successful collaborations with other singers'
            },
            {
              icon: '',
              value: 'Easy access to contact and booking information'
            },
          ],
          frustrations: [
            {
              icon: '',
              value:
                'Limited information about the producer\'s experience with vocalists'
            },
            {
              icon: '',
              value: 'Difficulty finding a producer who aligns with her artistic vision'
            },
            {
              icon: '',
              value: 'Difficulty finding a producer who aligns with her artistic vision'
            },
          ],
          bio: 'Emily is a professional singer and songwriter based in Nashville. She is looking for a music producer who can help her bring her creative vision to life. Emily values finding a producer who understands her musical style and has a proven track record of successful collaborations with other singers. She is often frustrated by the limited information available about producers\' experience with vocalists and the time-consuming process of finding the right collaborator.'
        },
      ],
      backgroundImages: [
        'assets/images/projects/tierro/cable2.svg',
        'assets/images/projects/tierro/lines.svg',
      ],
    },
  };
}
