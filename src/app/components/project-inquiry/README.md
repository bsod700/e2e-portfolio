# Project Inquiry Component

A modern, interactive component that replaces traditional CTA buttons with an engaging project inquiry form.

## Features

- **Flexible Input**: Users can describe their project in their own words, select project types, or both
- **Project Type Selector**: Quick-select buttons for common project types (Website, Application, AI Automation, etc.)
- **Smart Message Generation**: Automatically combines user input and selected types into a formatted inquiry
- **Contact Form Modal**: Clean, focused modal for collecting contact information
- **Flexible Contact Options**: Users can provide name, email, and/or phone number
- **No Required Fields**: Users choose how to communicate their needs (text, types, or both)

## User Flow

1. User enters project description in the input field ("What are we building?") **OR** selects project types **OR** both
2. User selects one or more project types from the available options (optional if description is provided)
3. User clicks the arrow button or presses Enter to generate inquiry
4. Modal appears showing the formatted inquiry message
5. User provides contact information (name, email, phone - at least one required)
6. Inquiry is sent via mailto link to your email

**Note**: Users must provide either a description, select at least one project type, or both to proceed.

## Customization

### Project Types

Edit the `projectTypes` array in `project-inquiry.ts` to customize available options:

```typescript
projectTypes: ProjectType[] = [
  { id: 'website', label: 'Website', icon: '🌐' },
  { id: 'application', label: 'Application', icon: '📱' },
  // Add more types as needed
];
```

### Email Recipient

Update the email address in the `submitInquiry()` method:

```typescript
window.location.href = `mailto:your-email@example.com?subject=${subject}&body=${body}`;
```

### Styling

The component uses CSS variables from the global styles:
- `--color-primary`: Primary color for accents
- `--color-bg-secondary`: Modal background
- `--gradient-primary`: Button gradients
- Various text and spacing variables

Customize in `project-inquiry.scss` for component-specific styles.

## Integration

The component is already integrated into the hero section. To use elsewhere:

1. Import the component:
```typescript
import { ProjectInquiryComponent } from '../project-inquiry/project-inquiry';
```

2. Add to component imports:
```typescript
@Component({
  imports: [ProjectInquiryComponent],
  // ...
})
```

3. Use in template:
```html
<app-project-inquiry></app-project-inquiry>
```

## Future Enhancements

Consider implementing:
- Backend API integration instead of mailto
- Form validation
- Analytics tracking
- Success/error notifications
- Save draft functionality
- Multi-language support

