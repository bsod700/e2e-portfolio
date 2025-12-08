import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
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
  ProjectAudienceData,
  ProjectAudienceComponent,
  ProjectPersonasData,
  ProjectPersonasComponent,
  ProjectComponentsLibraryData,
  ProjectComponentsLibraryComponent,
} from '../../../components/projects';
import { CommonModule } from '@angular/common';
import { FontLoaderService } from '../../../services/font-loader.service';
export interface ProjectData {
  headerData: ProjectHeaderData;
  stacksData: ProjectStacksData;
  sideTextsData: ProjectSideTextsData;
  nutshellData: ProjectNutshellData;
  strategicData: ProjectStrategicData;
  processData: ProjectProcessData;
  mobileGameChildrenData: ProjectSideImgCardsData;
  mobileAppParentsData: ProjectSideImgCardsData;
  audienceData: ProjectAudienceData;
  personasData: ProjectPersonasData;
  insightsData: ProjectStrategicData;
  userFlowData: ProjectSideImgTextData;
  wireframesData: ProjectSideImgTextData;
  styleGuideData: ProjectStyleGuideData;
  componentsLibraryData: ProjectComponentsLibraryData;
  screensSection: {
    title: string;
    text: string;
  },
  onboardingScreenData: ProjectSideImgTextData;
  avatarSelectionScreenData: ProjectSideImgTextData;
  homeScreenData: ProjectSideImgTextData;
  brushingScreenData: ProjectSideImgTextData;
  giftRevealScreenData: ProjectSideImgTextData;
  dressRoomScreenData: ProjectSideImgTextData;
  avatarGalleryScreenData: ProjectSideImgTextData;
  parentalControlsScreenData: ProjectSideImgTextData;
  calendarManagementScreenData: ProjectSideImgTextData;
  lessonLearnedData: ProjectSideImgCardsData;
  thanksData: ProjectThanksData;
}

const TOC_SECTIONS: readonly TocSection[] = [
    { id: 'header', title: 'Overview' },
    { id: 'stacks', title: 'Tech Stack' },
    { id: 'role-impact', title: 'Role & Impact' },
    { id: 'nutshell', title: 'In a Nutshell' },
    { id: 'strategic-goals', title: 'Strategic Goals' },
    { id: 'design-process', title: 'Design Process' },
    { id: 'mobile-game-children', title: 'Mobile Game for Children' },
    { id: 'mobile-app-parents', title: 'Mobile App for Parents' },
    { id: 'target-audience', title: 'Target Audience' },
    { id: 'personas', title: 'Personas' },
    { id: 'insights', title: 'Insights' },
    { id: 'user-flow', title: 'User Flow' },
    { id: 'wireframes', title: 'Wireframes' },
    { id: 'style-guide', title: 'Style Guide' },
    { id: 'components-library', title: 'Components Library' },
    { id: 'mobile-app-screens', title: 'Mobile App Screens' },
    { id: 'lessons-learned', title: 'Lessons Learned' },
    { id: 'style-guide', title: 'Style Guide' },
    { id: 'thanks', title: 'Thanks For Watching!' },
];

const PROJECT_DATA = {
    headerData: {
      name: 'brush-along',
      title: 'Interactive Brushing Tracker for Children',
      description:
        'Created an engaging game app that turns dental care into play. Helps parents track progress while keeping children motivated and consistent.',
      img: { src: 'assets/images/projects/brush-along/header-image.webp', alt: 'Brush along project image' },
      circles: [
        ''
      ],
      logoUrl: 'assets/images/projects/brush-along/logo.webp',
    },
    stacksData: {
      projectName: 'brush-along',
      circles: [
        '',''
      ],
      services: [
        { name: 'UI/UX Design', icon: 'assets/images/icons/uiux.svg' },
        { name: 'Logo', icon: 'assets/images/icons/logo.svg' },
        {
          name: 'Illustration',
          icon: 'assets/images/icons/illustrator.svg',
        },
        {
          name: 'Game Design',
          icon: 'assets/images/icons/game.svg',
        },
        {
          name: 'Character Design',
          icon: 'assets/images/icons/face.svg',
        },
        {
          name: 'Prototyping',
          icon: 'assets/images/icons/square.svg',
        },
        {
          name: 'Visual Design',
          icon: 'assets/images/icons/shapes.svg',
        },
      ],
      technologies: [
        { name: 'Illustrator', icon: 'assets/images/icons/illustrator.svg' },
        { name: 'Photoshop', icon: 'assets/images/icons/photoshop.svg' },
        { name: 'Figma', icon: 'assets/images/icons/figma.svg' },

      ],
    },
    sideTextsData: {
      titleLeft: 'Role',
      titleRight: 'Impact',
      textLeft:
        "I handled the complete design process independently for this competition entry. This included developing the original concept, creating all character illustrations, designing the user interface and game mechanics, and building interactive prototypes. I made all creative decisions, from the visual style to the user flow, ensuring the app would be engaging for children while providing value for parents tracking their kids' brushing habits.",
      textRight:
      "While created as a competition entry, this project demonstrated my ability to design for a specific audience with unique needs. The concept addressed a real parenting challenge by turning a daily struggle into an engaging experience. It showcased my skills in character design, gamification, and creating interfaces that appeal to both children and adults. The project strengthened my understanding of designing playful yet functional experiences and validated my approach to solving problems through thoughtful, user-centered design."
    },
    nutshellData: {
      projectName: 'brush-along',
      title: 'In a Nutshell',
      text: 'Brush Along addresses the daily struggle parents face getting their children to brush properly. By turning dental care into an interactive game with colorful characters and rewards, the app motivates kids to brush consistently while providing parents with progress tracking tools to ensure healthy habits are being formed.'
    },
    strategicData: {
      title: 'Strategic Goals',
      sectionName: 'strategic-goals',
      text: 'Parents struggle to motivate children to brush their teeth consistently and properly, turning daily dental care into a frustrating routine. The goal was to create an engaging app that transforms brushing into a fun, rewarding experience for kids while providing parents with tools to track progress and build lasting healthy habits.',
      cards: [
        {
          title: '01',
          text: "Create a playful, game-based experience that captures children's attention and makes brushing feel like play rather than a chore. Use colorful characters, rewards, and interactive elements to maintain excitement.",
          subtitle: 'Make Brushing Engaging for Kids',
          projectName: 'brush-along',
          backgroundImages: ['assets/images/projects/tierro/lines.svg'],
        },
        {
          title: '02',
          text: 'Design a reward system that encourages children to brush regularly and properly. Build motivation through achievements, progress tracking, and positive reinforcement that makes kids want to return daily.',
          subtitle: 'Motivate Consistent Habits',
          projectName: 'brush-along',
          backgroundImages: ['assets/images/projects/tierro/lines.svg'],
        },
        {
          title: '03',
          text: 'Give parents visibility into their children\'s brushing habits with clear progress reports and tracking features. Enable easy monitoring without creating friction in the user experience.',
          subtitle: 'Provide Parental Tracking Tools',
          projectName: 'brush-along',
          backgroundImages: ['assets/images/projects/tierro/lines.svg'],
        },
        {
          title: '04',
          text: 'Create an interface that appeals to children with fun visuals and simple interactions, while giving parents the control and insights they need through intuitive management features.',
          subtitle: 'Design for Dual Audiences',
          projectName: 'brush-along',
          backgroundImages: ['assets/images/projects/tierro/lines.svg'],
        },
        {
          title: '05',
          text: 'Incorporate educational elements that teach proper brushing techniques and dental health importance. Make learning natural and engaging without feeling like instruction.',
          subtitle: 'Build Educational Value',
          projectName: 'brush-along',
          backgroundImages: ['assets/images/projects/tierro/lines.svg'],
        },
        {
          title: '06',
          text: 'Design characters, interactions, and language suitable for young children. Create an interface that\'s simple enough for kids to use independently while remaining engaging.',
          subtitle: 'Ensure Age-Appropriate Design',
          projectName: 'brush-along',
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
      projectName: 'brush-along',
    },
    processData: {
      projectName: 'brush-along',
      title: 'Design Process',
      description:
        "A user-centered approach balancing children's engagement with parents' practical needs, creating a playful yet functional dental care experience.",
      steps: [
        {
          title: '01.',
          subtitle: 'Research',
          text: "Studied parenting challenges and what motivates kids. Identified how gamification could solve dental hygiene struggles effectively.",
          projectName: 'prompt-management',
          backgroundImages: ['assets/images/projects/tierro/lines.svg'],
        },
        {
          title: '02.',
          subtitle: 'User Flow',
          text: "Mapped journeys for kids and parents: starting sessions, earning rewards, and tracking progress over time.",
          projectName: 'prompt-management',
          backgroundImages: ['assets/images/projects/tierro/lines.svg'],
        },
        {
          title: '03.',
          subtitle: 'Wireframes',
          text: "Sketched game interface, character selection, brushing timer, rewards, and parent dashboard for monitoring habits.",
          projectName: 'prompt-management',
          backgroundImages: ['assets/images/projects/tierro/lines.svg'],
        },
        {
          title: '04.',
          subtitle: 'Character Design',
          text: "Created friendly, expressive characters that appeal to young children. Each character has distinct personality to maintain engagement.",
          projectName: 'prompt-management',
          backgroundImages: ['assets/images/projects/tierro/lines.svg'],
        },
        {
          title: '05.',
          subtitle: 'Development',
          text: "Combined characters & illustrations into vibrant screens. Designed simple navigation kids could use independently with clear parent controls.",
            projectName: 'prompt-management',
          backgroundImages: ['assets/images/projects/tierro/lines.svg'],
        },
        {
          title: '06.',
          subtitle: 'Logo Design',
          text: "Created a playful logo communicating the app's purpose. Balanced fun aesthetics with professional credibility for parents.",
          projectName: 'prompt-management',
          backgroundImages: ['assets/images/projects/tierro/lines.svg'],
        },
        {
          title: '07.',
          subtitle: 'Clickable Prototype',
          text: "Built interactive prototype showing onboarding, brushing sessions, rewards, and tracking to validate the complete experience.",
          projectName: 'prompt-management',
          backgroundImages: ['assets/images/projects/tierro/lines.svg'],
        },
      ],
    },
    mobileGameChildrenData: {
      projectName: 'brush-along',
      title: 'Mobile Game for Children',
      text: "The app makes brushing fun and engaging with interactive characters and rewards. It encourages consistent brushing habits through a game-based approach and provides positive reinforcement with verbal praise and rewards.",
      sideDirection: 'left',
      cards: [
        {
          title: 'Engaging Experience',
          text: "Makes brushing fun with interactive characters and rewards that capture children's attention and keep them excited about dental care.",
          icon: 'assets/images/icons/mouse-circle.svg',
        },
        {
          title: 'Consistent Habits',
          text: "Encourages regular brushing through a game-based approach that motivates kids to return daily and complete their brushing sessions properly.",
          icon: 'assets/images/icons/calendar-tick.svg',
        },
        {
          title: 'Positive Reinforcement',
          text: 'Provides verbal praise and rewards for accomplishments, building confidence and creating positive associations with brushing teeth.',
          icon: 'assets/images/icons/like-shape.svg',
        },
      ],
      image: 'assets/images/projects/brush-along/mobile-game-children.webp',
      sectionName: 'mobile-game-children',
    },
    mobileAppParentsData: {
      projectName: 'brush-along',
      title: 'Mobile App for Parents',
      text: "The app allows easy tracking of children's brushing habits and enables setting and modifying designated brushing times. It helps ensure children are brushing properly and consistently.",
      sideDirection: 'right',
      cards: [
        {
          title: 'Easy Tracking',
          text: "Allows monitoring of children's brushing habits with clear visibility into completed sessions, streaks, and overall progress over time.",
          icon: 'assets/images/icons/lightning.svg',
        },
        {
          title: 'Customizable Schedule',
          text: "Enables setting and modifying brushing times to fit family routines, with reminders that help children remember their brushing sessions.",
          icon: 'assets/images/icons/calendar.svg',
        },
        {
          title: 'Effective Monitoring',
          text: 'Ensures children brush properly and consistently by providing detailed reports and insights into brushing patterns and adherence to schedules.',
          icon: 'assets/images/icons/clipboard-text.svg',
        },
      ],
      image: 'assets/images/projects/brush-along/mobile-app-parents.webp',
      sectionName: 'mobile-app-parents',
    },
    audienceData: {
      backgroundCircles: [
        '',
      ],
      projectName: 'brush-along',
      title: 'Target Audience',
      sideLeftTitle: 'Children',
      sideLeftCards: [
        {
          title: 'Primary Users',
          text: 'The main users are children aged 3-10 who need motivation to brush their teeth properly and consistently every day.',
          icon: 'assets/images/icons/user.svg',
        },
        {
          title: 'Engagement Focus',
          text: 'Kids who respond well to games, characters, and rewards, making the brushing process enjoyable and something they look forward to.',
          icon: 'assets/images/icons/maximize.svg',
        },
        {
          title: 'Habit Formation',
          text: 'Young children developing dental hygiene routines who benefit from positive reinforcement and interactive experiences that make brushing feel like play.',
          icon: 'assets/images/icons/calendar-tick.svg',
        },
      ],
      sideRightTitle: 'Parents',
      sideRightCards: [
        {
          title: 'Secondary Users',
          text: 'Parents who require an effective way to monitor and improve their children\'s brushing habits without daily battles or frustration.',
          icon: 'assets/images/icons/group-people.svg',
        },
        {
          title: 'Tracking Needs',
          text: 'Caregivers seeking visibility into their children\'s dental care routines with clear progress reports and consistent habit tracking over time.',
          icon: 'assets/images/icons/eye.svg',
        },
        {
          title: 'Peace of Mind',
          text: 'Parents who want assurance their children are brushing properly and consistently, with tools for managing schedules and ensuring better oral hygiene.',
          icon: 'assets/images/icons/shapes.svg',
        },
      ],
    },
    personasData: {
      projectName: 'brush-along',
      title: 'Personas',
      text: 'To ensure the app meets the needs of both children and parents, I developed detailed personas based on user interviews and pain points.',
      personas: [
        {
          name: 'Lily',
          image: 'assets/images/projects/brush-along/persona-lily.webp',
          attributes: [
            { icon: 'assets/images/icons/cake.svg', name: 'Age', value: '6 years' },
            { icon: 'assets/images/icons/location.svg', name: 'Location', value: 'San Francisco, CA' },
            { icon: 'assets/images/icons/education.svg', name: 'Education', value: "Kindergarten" },
            { icon: 'assets/images/icons/work.svg', name: 'Occupation', value: 'Lives with parents and an older brother' },
          ],
          wants: [
            {
              icon: 'assets/images/icons/happy-smile.svg',
              value:
                'Fun and engaging activities'
            },
            {
              icon: 'assets/images/icons/happy-smile.svg',
              value: 'Rewards and positive reinforcement'
            },
            {
              icon: 'assets/images/icons/happy-smile.svg',
              value: 'Easy-to-use and interactive apps'
            },
          ],
          frustrations: [
            {
              icon: 'assets/images/icons/sad-smile.svg',
              value:
                'Gets bored easily'
            },
            {
              icon: 'assets/images/icons/sad-smile.svg',
              value: 'Forgets to brush her teeth regularly'
            },
            {
              icon: 'assets/images/icons/sad-smile.svg',
              value: 'Needs constant reminders'
            },
          ],
          bio: 'Lily is a lively and imaginative 6-year-old who loves playing games on her tablet. She enjoys interactive characters and receives praise for her achievements. Her parents are looking for ways to make brushing teeth a more enjoyable and consistent habit for her.'
        },
        {
          name: 'Emma',
          image: 'assets/images/projects/brush-along/persona-emma.webp',
          attributes: [
            { icon: 'assets/images/icons/cake.svg', name: 'Age', value: '34 years' },
            { icon: 'assets/images/icons/location.svg', name: 'Location', value: 'San Francisco, CA' },
            { icon: 'assets/images/icons/education.svg', name: 'Education', value: 'Bachelor\'s Degree' },
            { icon: 'assets/images/icons/work.svg', name: 'Occupation', value: 'Married with two young children' },
          ],
          wants: [
            {
              icon: 'assets/images/icons/happy-smile.svg',
              value:
                'Effective tracking of children\'s brushing habits'
            },
            {
              icon: 'assets/images/icons/happy-smile.svg',
              value: 'Reliable reminders and scheduling'
            },
            {
              icon: 'assets/images/icons/happy-smile.svg',
              value: 'Assurance that kids are brushing properly'
            },
          ],
          frustrations: [
            {
              icon: 'assets/images/icons/sad-smile.svg',
              value:
                'Difficulty in monitoring kids brushing habits'
            },
            {
              icon: 'assets/images/icons/sad-smile.svg',
              value: 'Kids often forget to brush or do it ineffectively'
            },
            {
              icon: 'assets/images/icons/sad-smile.svg',
              value: 'Limited time to supervise brushing routines'
            },
          ],
          bio: 'Emma is a busy marketing manager and mother of two young children. She is tech-savvy and uses various apps to help manage her household. Emma is looking for a solution that ensures her children maintain good brushing habits without requiring constant supervision.',
        },
        {
          name: 'Jack',
          image: 'assets/images/projects/brush-along/persona-jack.webp',
          attributes: [
            { icon: 'assets/images/icons/cake.svg', name: 'Age', value: '5 years' },
            { icon: 'assets/images/icons/location.svg', name: 'Location', value: 'San Francisco, CA' },
            { icon: 'assets/images/icons/education.svg', name: 'Education', value: 'Preschool' },
            { icon: 'assets/images/icons/work.svg', name: 'Occupation', value: 'Lives with parents and a younger sister' },
          ],
          wants: [
            {
              icon: 'assets/images/icons/happy-smile.svg',
              value:
                'Fun and interactive games'
            },
            {
              icon: 'assets/images/icons/happy-smile.svg',
              value: 'Positive reinforcement'
            },
            {
              icon: 'assets/images/icons/happy-smile.svg',
              value: 'Simple and engaging apps'
            },
          ],
          frustrations: [
            {
              icon: 'assets/images/icons/sad-smile.svg',
              value:
                'Easily distracted'
            },
            {
              icon: 'assets/images/icons/sad-smile.svg',
              value: 'Needs frequent reminders to brush'
            },
            {
              icon: 'assets/images/icons/sad-smile.svg',
              value: 'Gets bored with routine activities'
            },
          ],
          bio: 'Jack is an energetic and curious 5-year-old who loves playing games with sounds and characters on his tablet. His parents are looking for a fun way to keep him engaged in brushing his teeth and developing a consistent routine.'
        },
        {
          name: 'David',
          image: 'assets/images/projects/brush-along/persona-david.webp',
          attributes: [
            { icon: 'assets/images/icons/cake.svg', name: 'Age', value: '37 years' },
            { icon: 'assets/images/icons/location.svg', name: 'Location', value: 'San Francisco, CA' },
            { icon: 'assets/images/icons/education.svg', name: 'Education', value: 'Master\'s Degree' },
            { icon: 'assets/images/icons/work.svg', name: 'Occupation', value: 'Married with two sons' },
          ],
          wants: [
            {
              icon: 'assets/images/icons/happy-smile.svg',
              value:
                'Reliable tracking of children\'s brushing habits'
            },
            {
              icon: 'assets/images/icons/happy-smile.svg',
              value: 'Assurance of proper brushing techniques'
            },
            {
              icon: 'assets/images/icons/happy-smile.svg',
              value: 'User-friendly app for managing children\'s routines'
            },
          ],
          frustrations: [
            {
              icon: 'assets/images/icons/sad-smile.svg',
              value:
                'Inconsistent brushing habits in kids'
            },
            {
              icon: 'assets/images/icons/sad-smile.svg',
              value: 'Lack of immediate feedback on brushing quality'
            },
            {
              icon: 'assets/images/icons/sad-smile.svg',
              value: 'Limited time to oversee daily routines'
            },
          ],
          bio: 'David is an IT consultant and father of two young sons. He relies on technology to manage household tasks efficiently. David seeks a dependable app to ensure his children brush their teeth correctly and consistently without requiring constant supervision.',
        },
      ],
      backgroundImages: [
        'assets/images/projects/brush-along/line.svg',
      ],
    },
    insightsData: {
      title: 'Insights',
      sectionName: 'insights',
      text: 'Through detailed analysis and user research, several key insights were identified to guide the design and development of the project.',
      cards: [
        {
          title: '01.',
          subtitle: 'Engagement',
          text: 'Children like playing and need fun. Interactive elements to stay engaged in brushing their teeth. Games and rewards are crucial motivators.',
          projectName: 'brush-along',
          backgroundImages: ['assets/images/projects/tierro/lines.svg'],
        },
        {
          title: '02.',
          subtitle: 'Ease of Use',
          text: 'Both children and parents prefer a simple and intuitive interface. Easy navigation and clear instructions are essential for adoption.',
          projectName: 'brush-along',
          backgroundImages: ['assets/images/projects/tierro/lines.svg'],
        },
        {
          title: '03.',
          subtitle: 'Positive Reinforcement',
          text: 'Positive feedback and rewards are effective in encouraging children to brush regularly and properly, building lasting habits.',
          projectName: 'brush-along',
          backgroundImages: ['assets/images/projects/tierro/lines.svg'],
        },
        {
          title: '04.',
          subtitle: 'Monitoring',
          text: 'Parents need to see progress and results to stay motivated. Regular reports and tracking features are essential for accountability.',
          projectName: 'brush-along',
          backgroundImages: ['assets/images/projects/tierro/lines.svg'],
        },
        {
          title: '05.',
          subtitle: 'Consistency',
          text: 'Maintaining a consistent brushing routine is a common challenge. Features that encourage and stick to a routine are important for both children and parents.',
          projectName: 'brush-along',
          backgroundImages: ['assets/images/projects/tierro/lines.svg'],
        },
        {
          title: '06.',
          subtitle: 'Flexibility',
          text: 'Parents appreciate the ability to use both mobile and tablet apps for monitoring, especially in households with multiple children to manage.',
          projectName: 'brush-along',
          backgroundImages: ['assets/images/projects/tierro/lines.svg'],
        },
        {
          title: '07.',
          subtitle: 'Tech Savviness',
          text: 'Parents and children are comfortable with various tech interactions, including touchscreen and animated feedback, which enhances user engagement and improves brushing routines.',
          projectName: 'brush-along',
          backgroundImages: ['assets/images/projects/tierro/lines.svg'],
        },
      ],
      backgroundImages: [
        'assets/images/projects/brush-along/brush.svg',
      ],
      projectName: 'brush-along',
    },
    userFlowData: {
      sideDirection: 'column',
      projectName: 'brush-along',
      title: 'User Flow',
      text: 'The navigation structure of "Brush Along" is designed to be user-friendly and intuitive, ensuring easy access for both children and parents. Key features include profile selection, a brushing game, tracking dashboard for parents, reward management, and settings for customization. This structure promotes seamless interaction and efficient use of the app\'s features.',
      image: 'assets/images/projects/brush-along/user-flow.webp',
      sectionName: 'user-flow',
    },
    wireframesData: {
      sideDirection: 'column',
      projectName: 'brush-along',
      title: 'Wireframes',
      text: 'The wireframes for "Brush Along" provide a clear visual blueprint of the app\'s layout and functionality. They emphasize user-friendly design, intuitive navigation, and engaging elements to ensure both children and parents can easily interact with the app.',
      image: 'assets/images/projects/brush-along/wireframes.webp',
      sectionName: 'wireframes',
      backgroundImages: [
        'assets/images/projects/brush-along/hill.webp',
        'assets/images/projects/brush-along/tree.webp',
      ],
    },
    styleGuideData: {
      projectName: 'brush-along',
      title: 'Style Guide',
      text: 'The style guide for "Brush Along" defines the visual and interactive elements, ensuring a cohesive and engaging user experience. It includes color schemes, typography, iconography, and design principles that reflect a fun, friendly, and accessible aesthetic for children and parents alike.',
      fontGuideTitle: 'Little One',
      fontGuide: ['Regular'],
      fontGuideImg: 'assets/images/projects/brush-along/aa.svg',
      fontGuideText: 'The typography for "Brush Along" is playful yet readable, using child-friendly fonts for the game elements and clean, modern fonts for the parent dashboard. It ensures clarity, accessibility, and a consistent visual appeal across the app.',
      colorGuideTitle: 'Color Palette',
      colorGuide: [
        { title: 'Brand', colors: [
          { name: 'Aero', value: '#FE7625' },
          { name: 'Smoky Black', value: '#FFF1D9' },
          { name: 'Black', value: '#FFCC01' },
          { name: 'White', value: '#6E451E' },
          { name: 'Light Brown', value: '#BE121E' },
          { name: 'Dark Brown', value: '#B0EE18' },
          { name: 'Green', value: '#6A8A45' },
          { name: 'Yellow', value: '#344224' },
          { name: 'Orange', value: '#4B4D4F' },
        ] },
      ],
    },
    componentsLibraryData: {
      projectName: 'brush-along',
      title: 'Components Library',
      text: 'The components library for "Brush Along" includes reusable UI elements such as buttons, icons, forms, and interactive widgets. These components ensure consistency, ease of development, and a cohesive user experience throughout the app.',
      images: [
        { src: 'assets/images/projects/brush-along/components-library-1.webp', alt: 'Components Library' },
        { src: 'assets/images/projects/brush-along/components-library-2.webp', alt: 'Components Library' },
        { src: 'assets/images/projects/brush-along/components-library-3.webp', alt: 'Components Library' },
        { src: 'assets/images/projects/brush-along/components-library-4.webp', alt: 'Components Library' },
        { src: 'assets/images/projects/brush-along/components-library-5.webp', alt: 'Components Library' },
        { src: 'assets/images/projects/brush-along/components-library-6.webp', alt: 'Components Library' },
      ],
      sectionName: 'components-library',
      backgroundImages: [
        'assets/images/projects/brush-along/line2.svg',
        'assets/images/projects/brush-along/crab.webp',
      ],
    },
    screensSection: {
      title: 'Brush Along Mobile App',
      text: 'Complete mobile app design featuring intuitive onboarding, character customization, interactive brushing sessions, and parental controls that prioritize engagement and habit tracking for children\'s dental care.',
    },
    onboardingScreenData: {
      sideDirection: 'left',
      projectName: 'brush-along',
      title: 'Welcome & Child Setup',
      text: 'Initial onboarding allows parents to set up each child with a unique name and avatar. This creates a personalized experience and builds excitement from the start.',
      video: 'assets/images/projects/brush-along/welcome-child-setup.webm',
      sectionName: 'welcome-screen',
    },
    avatarSelectionScreenData: {
      sideDirection: 'right',
      projectName: 'brush-along',
      title: 'Avatar Selection',
      text: 'Choosing Your Character Kids select their avatar when opening the app. This screen appears each time, allowing them to identify themselves and access their personal progress and rewards.',
      video: 'assets/images/projects/brush-along/avatar-selection.webm',
      sectionName: 'avatar-selection-screen',
    },
    homeScreenData: {
      sideDirection: 'left',
      projectName: 'brush-along',
      title: 'Home Screen',
      text: 'Interactive Hub The child\'s avatar appears center screen with four interactive options: wardrobe ball for dressing their character, brush icon for brushing sessions, avatar head for changing characters, and gear icon for parental settings.',
      image: 'assets/images/projects/brush-along/home-screen.webp',
      sectionName: 'home-screen',
    },
    brushingScreenData: {
      sideDirection: 'right',
      projectName: 'brush-along',
      title: 'Brushing Session Start',
      text: 'Interactive Brushing Time Engaging video plays during the two-minute brushing session with music throughout. At completion, avatar celebrates with "Well done!" and presents a gift box containing new avatar items.',
      video: 'assets/images/projects/brush-along/brushing-session-start.webm',
      sectionName: 'brushing-screen',
    },
    giftRevealScreenData: {
      sideDirection: 'left',
      projectName: 'brush-along',
      title: 'Gift Reveal & Rewards',
      text: 'Unlocking New Items Children click the gift box to reveal new clothing or accessories for their avatar. Star counter displays brushing streak, motivating consistent daily habits.',
      video: 'assets/images/projects/brush-along/gift-reveal-rewards.webm',
      sectionName: 'gift-reveal-screen',
    },
    dressRoomScreenData: {
      sideDirection: 'right',
      projectName: 'brush-along',
      title: 'Dress Room Customization',
      text: 'Avatar Wardrobe All earned items appear in the dress room. Children customize their avatar with unlocked accessories. Changes reflect immediately across all screens, maintaining personalization throughout the app.',
      video: 'assets/images/projects/brush-along/dress-room-customization.webm',
      sectionName: 'dress-room-screen',
    },
    avatarGalleryScreenData: {
      sideDirection: 'left',
      projectName: 'brush-along',
      title: 'Avatar Gallery & Unlocks',
      text: 'Character Collection Browse all available avatars with left/right navigation. Locked characters display required streak count. Achieving the goal unlocks new avatars, encouraging consistent brushing habits.',
      video: 'assets/images/projects/brush-along/avatar-gallery-unlocks.webm',
      sectionName: 'avatar-gallery-screen',
    },
    parentalControlsScreenData: {
      sideDirection: 'right',
      projectName: 'brush-along',
      title: 'Parental Controls & Settings',
      text: 'Secure Settings Math problem verification prevents children from accessing parental settings. Correct answer unlocks options; incorrect answer returns to main menu, ensuring age-appropriate access. Parental Dashboard Toggle sound and music controls. Adjust brushing session duration with custom time input. Access calendar editing for tracking and managing multiple children\'s brushing schedules.',
      video: 'assets/images/projects/brush-along/parental-controls-access.webm',
      sectionName: 'parental-controls-screen',
    },
    calendarManagementScreenData: {
      sideDirection: 'left',
      projectName: 'brush-along',
      title: 'Calendar Management',
      text: 'Tracking & Monitoring Carousel displays each child\'s individual calendar. Parents click any day to update status: not brushed, brushed once, or brushed multiple times, providing comprehensive habit tracking. Daily brushing goal progress is displayed with clear visual indicators.',
      video: 'assets/images/projects/brush-along/calendar-management.webm',
      sectionName: 'calendar-management-screen',
    },
    lessonLearnedData: {
      projectName: 'brush-along',
      title: '',
      sideDirection: 'left',
      cards: [
        {
          title: 'Designing for Kids Requires Different Thinking',
          text: 'Children interact with interfaces differently than adults. Bright colors, simple navigation, and immediate feedback became essential. Every element needed to be intuitive without instructions.',
          icon: 'assets/images/icons/user.svg',
        },
        {
          title: 'Gamification Drives Real Engagement',
          text: 'Rewards, streaks, and character customization proved powerful motivators. Kids responded to achievement systems that made brushing feel like playing rather than a chore.',
          icon: 'assets/images/icons/flash.svg',
        },
        {
          title: 'Dual Audiences Need Careful Balance',
          text: 'Creating an app that appeals to children while giving parents control required thoughtful separation. Features needed distinct interfaces without complicating the overall experience.',
          icon: 'assets/images/icons/calendar-circle.svg',
        },
        {
          title: 'Visual Characters Create Emotional Connection',
          text: 'Kids formed attachments to their avatars quickly. Personalization through customization increased engagement and made them want to return daily to care for their character.',
          icon: 'assets/images/icons/status-up.svg',
        },
        {
          title: 'Competition Work Validates Design Skills',
          text: 'Even without real-world implementation, this project proved my ability to solve specific problems through thoughtful design and create experiences that balance fun with functionality.',
          icon: 'assets/images/icons/diagram.svg',
        },
       
      ],
      image: 'assets/images/projects/brush-along/footer-characters.webp',
      sectionName: 'lesson-learned',
      backgroundImages: [
        'assets/images/projects/brush-along/footer-characters.webp',
        'assets/images/projects/brush-along/bird.webp',
        'assets/images/projects/brush-along/bee.webp',
      ],
    },
    thanksData: {
      projectName: 'brush-along',
      title: 'Thanks For Watching!',
      projectKicker: 'The next step',
      projectTitle: 'Ready to Start Your Project?',
      projectDescription: 'Tell me what you need and I’ll help you bring it to life.',
      backgroundCircles: [
        '',
      ],
      backgroundImages: [
        'assets/images/projects/brush-along/tree.webp',
      ],
    }
  } as const satisfies ProjectData;


@Component({
  selector: 'app-brush-along-project',
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
    ProjectAudienceComponent,
    ProjectPersonasComponent,
    ProjectComponentsLibraryComponent,
  ],
  templateUrl: './brush-along-project.html',
  styleUrl: './brush-along-project.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BrushAlongProjectComponent {
  private readonly fontLoaderService = inject(FontLoaderService);
  private cleanupFont?: () => void;

  readonly tocSections: TocSection[] = [...TOC_SECTIONS];
  readonly projectData: ProjectData = PROJECT_DATA;

  ngOnInit(): void {
    const fontHref = 'https://fonts.googleapis.com/css2?family=Lilita+One&display=swap';
    const fontId = 'brush-along-lilita-one';
    
    this.cleanupFont = this.fontLoaderService.loadFont(fontHref, fontId);
  }

  ngOnDestroy(): void {
    if (this.cleanupFont) {
      this.cleanupFont();
    }
  }
} 

