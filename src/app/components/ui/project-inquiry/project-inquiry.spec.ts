import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectInquiryComponent } from './project-inquiry';

describe('ProjectInquiryComponent', () => {
  let component: ProjectInquiryComponent;
  let fixture: ComponentFixture<ProjectInquiryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectInquiryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectInquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle project type selection', () => {
    expect(component.isSelected('website')).toBeFalsy();
    
    component.toggleProjectType('website');
    expect(component.isSelected('website')).toBeTruthy();
    
    component.toggleProjectType('website');
    expect(component.isSelected('website')).toBeFalsy();
  });

  it('should generate inquiry with project description and types', () => {
    component.projectDescription = 'Build a modern e-commerce platform';
    component.toggleProjectType('website');
    component.toggleProjectType('ecommerce');
    
    component.generateInquiry();
    
    expect(component.generatedMessage).toContain('Build a modern e-commerce platform');
    expect(component.generatedMessage).toContain('Website');
    expect(component.generatedMessage).toContain('E-commerce');
    expect(component.showContactForm).toBeTruthy();
  });

  it('should generate inquiry with only project types (no description)', () => {
    component.projectDescription = '';
    component.toggleProjectType('website');
    component.toggleProjectType('application');
    
    component.generateInquiry();
    
    expect(component.generatedMessage).toContain('Website');
    expect(component.generatedMessage).toContain('Application');
    expect(component.showContactForm).toBeTruthy();
  });

  it('should generate inquiry with only description (no types)', () => {
    component.projectDescription = 'Custom solution needed';
    
    component.generateInquiry();
    
    expect(component.generatedMessage).toContain('Custom solution needed');
    expect(component.showContactForm).toBeTruthy();
  });

  it('should reset form after submission', () => {
    component.projectDescription = 'Test project';
    component.toggleProjectType('website');
    component.contactEmail = 'test@example.com';
    component.showContactForm = true;
    
    component.resetForm();
    
    expect(component.projectDescription).toBe('');
    expect(component.selectedTypes.size).toBe(0);
    expect(component.contactEmail).toBe('');
    expect(component.showContactForm).toBeFalsy();
  });
});

