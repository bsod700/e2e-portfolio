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
      question: "What's the typical project scope?",
      answer: "I take on full-cycle product builds that include UX, interface design, frontend and backend development, and automation. The focus is always on delivering complete, polished, and scalable digital solutions.",
      isOpen: true
    },
    {
      question: "Can you work with existing code or designs?",
      answer: "Yes, absolutely. I can seamlessly integrate with your existing codebase, design systems, or design files. Whether you need enhancements, refactoring, or building new features on top of existing work, I adapt to your current setup and maintain consistency with your established patterns.",
      isOpen: false
    },
    {
      question: "Do you handle everything in-house?",
      answer: "Yes, I handle the full product lifecycle in-house. From initial concept and UX design to frontend and backend development, AI integration, and deployment—everything is managed by me. This ensures consistency, faster iteration, and a unified vision throughout the project.",
      isOpen: false
    },
    {
      question: "Do you offer support after launch?",
      answer: "Yes, I provide ongoing support and maintenance after launch. This includes bug fixes, performance optimizations, feature updates, and technical assistance. I'm committed to ensuring your product continues to run smoothly and evolves with your business needs.",
      isOpen: false
    },
    {
      question: "Can you integrate AI or automate processes?",
      answer: "Definitely. I specialize in integrating AI capabilities and automation workflows into digital products. This includes LLM integration, RAG pipelines, vector databases, chatbots, recommendation systems, and custom automation solutions that streamline operations and enhance user experiences.",
      isOpen: false
    }
  ];

  toggleFaq(index: number) {
    this.faqs[index].isOpen = !this.faqs[index].isOpen;
  }
}
