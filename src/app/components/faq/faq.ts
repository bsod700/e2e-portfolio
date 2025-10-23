import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface FAQ {
  question: string;
  answer: string;
  isOpen: boolean;
}

@Component({
  selector: 'app-faq',
  imports: [CommonModule],
  templateUrl: './faq.html',
  styleUrl: './faq.scss'
})
export class FaqComponent {
  faqs: FAQ[] = [
    {
      question: "What's your typical project scope?",
      answer: "I work on a wide range of projects, from small landing pages to complex full-stack applications. Each project is unique, and I tailor my approach to meet your specific needs, whether it's a complete build from scratch or enhancing an existing system.",
      isOpen: false
    },
    {
      question: "Can you provide web development and UX design?",
      answer: "Absolutely! I specialize in both development and design, offering end-to-end solutions. I can handle everything from wireframing and UI/UX design to frontend and backend development, ensuring a seamless and cohesive final product.",
      isOpen: false
    },
    {
      question: "Do you offer support after project?",
      answer: "Yes, I provide ongoing support and maintenance after project completion. This includes bug fixes, updates, and technical assistance to ensure your application runs smoothly and stays up-to-date with the latest technologies.",
      isOpen: false
    },
    {
      question: "Can you integrate AI or automation processes?",
      answer: "Definitely! I have experience integrating AI capabilities, machine learning models, and automation workflows into applications. Whether it's chatbots, recommendation systems, or process automation, I can help you leverage AI to enhance your product.",
      isOpen: false
    },
    {
      question: "How do I request other services?",
      answer: "Simply reach out through the contact form or email me directly. We'll discuss your requirements, timeline, and budget to create a custom solution that fits your needs. I'm flexible and happy to accommodate various project types and scopes.",
      isOpen: false
    }
  ];

  toggleFaq(index: number) {
    this.faqs[index].isOpen = !this.faqs[index].isOpen;
  }
}
