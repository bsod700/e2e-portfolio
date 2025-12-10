import { Component } from '@angular/core';
import { FooterComponent } from '../../components/layout';

@Component({
  selector: 'app-about-page',
  imports: [
    FooterComponent
  ],
  templateUrl: './about-page.html',
  styleUrl: './about-page.scss'
})
export class AboutPageComponent {
  workExperiences = [
    {
      period: '2020 - Present',
      role: 'Senior Full Stack Developer & UI/UX Designer',
      company: 'Freelance',
      description: 'Leading end-to-end development projects for 500+ clients worldwide. Specializing in modern web applications, UI/UX design, and AI integration. Building scalable solutions using Angular, React, Node.js, and cutting-edge technologies.',
      achievements: [
        'Delivered 500+ successful projects across various industries',
        'Achieved 98% client satisfaction rate',
        'Specialized in complex enterprise applications and startups',
        'Integrated AI/ML solutions for enhanced user experiences'
      ]
    },
    {
      period: '2018 - 2020',
      role: 'Full Stack Developer',
      company: 'Tech Solutions Inc.',
      description: 'Developed and maintained web applications using modern JavaScript frameworks. Collaborated with cross-functional teams to deliver high-quality products.',
      achievements: [
        'Built RESTful APIs serving 100K+ daily requests',
        'Reduced application load time by 60%',
        'Implemented CI/CD pipelines for automated deployments',
        'Mentored junior developers in best practices'
      ]
    },
    {
      period: '2016 - 2018',
      role: 'UI/UX Designer & Frontend Developer',
      company: 'Creative Digital Agency',
      description: 'Crafted user-centered designs and implemented responsive web interfaces. Focused on creating intuitive and accessible digital experiences.',
      achievements: [
        'Designed and developed 50+ websites and applications',
        'Improved user engagement by 45% through UX optimization',
        'Created comprehensive design systems',
        'Led workshops on modern web design principles'
      ]
    },
    {
      period: '2015 - 2016',
      role: 'Junior Frontend Developer',
      company: 'StartupLab',
      description: 'Started my professional journey building responsive websites and learning modern development practices. Collaborated with designers to bring mockups to life.',
      achievements: [
        'Developed pixel-perfect implementations of designs',
        'Learned and applied Agile methodologies',
        'Contributed to open-source projects',
        'Built reusable component libraries'
      ]
    }
  ];

  skills = [
    {
      category: 'Frontend Development',
      items: ['Angular', 'React', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'SASS', 'Tailwind CSS']
    },
    {
      category: 'Backend Development',
      items: ['Node.js', 'Express', 'Python', 'Django', 'PostgreSQL', 'MongoDB', 'REST APIs', 'GraphQL']
    },
    {
      category: 'Design & Tools',
      items: ['Figma', 'Adobe XD', 'Photoshop', 'Illustrator', 'UI/UX Design', 'Prototyping', 'User Research']
    },
    {
      category: 'AI & Modern Tech',
      items: ['OpenAI API', 'Machine Learning', 'AI Integration', 'Automation', 'Cloud Services', 'DevOps']
    }
  ];
}

