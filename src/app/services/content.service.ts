import { Injectable, inject } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { SupabaseService } from './supabase.service';

export interface HomePageContent {
  id?: string;
  badge_text: string;
  hero_title: string;
  hero_description: string;
  updated_at?: string;
}

export interface ServiceContent {
  id?: string;
  service_id: string;
  icon?: string;
  title: string;
  description: string;
  full_description?: string;
  services?: string[];
  benefits?: string[];
  code_example?: string;
  display_order?: number;
  updated_at?: string;
}

export interface HomeServiceCard {
  id?: string;
  service_id: string;
  icon?: string;
  title: string;
  description: string;
  display_order?: number;
  updated_at?: string;
}

export interface ProjectContent {
  id?: string;
  project_id: string;
  type: string;
  title: string;
  description: string;
  logo_url?: string;
  image_src?: string;
  image_alt?: string;
  background_images?: string[];
  link?: string;
  display_order?: number;
  updated_at?: string;
}

export interface TestimonialContent {
  id?: string;
  name: string;
  role: string;
  text: string;
  avatar?: string;
  display_order?: number;
  updated_at?: string;
}

export interface FAQContent {
  id?: string;
  question: string;
  answer: string;
  is_open?: boolean;
  display_order?: number;
  updated_at?: string;
}

export interface LegalPageContent {
  id?: string;
  page_type: 'accessibility-statement' | 'privacy-policy' | 'terms-conditions';
  title: string;
  last_updated?: string;
  sections: LegalPageSection[];
  updated_at?: string;
}

export interface LegalPageSection {
  id?: string;
  heading: string;
  content: string;
  list_items?: string[];
  display_order: number;
}

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  private supabaseService = inject(SupabaseService);
  private readonly TABLE_NAME = 'home_page_content';

  getHomePageContent(): Observable<HomePageContent | null> {
    const client = this.supabaseService.client;
    if (!client) {
      return new Observable(observer => {
        observer.next(null);
        observer.complete();
      });
    }

    return from(
      client
        .from(this.TABLE_NAME)
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1)
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching content:', error);
          return null;
        }
        return data as HomePageContent | null;
      }),
      catchError(error => {
        console.error('Error in getHomePageContent:', error);
        return [null];
      })
    );
  }

  updateHomePageContent(content: Partial<HomePageContent>): Observable<{ success: boolean; error?: string; data?: HomePageContent }> {
    const client = this.supabaseService.client;
    if (!client) {
      return of({ success: false, error: 'Supabase client not initialized' });
    }

    return from(
      client
        .from(this.TABLE_NAME)
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1)
        .single()
    ).pipe(
      switchMap(({ data: existingData, error: fetchError }) => {
        if (fetchError && fetchError.code !== 'PGRST116') {
          return of({ success: false, error: fetchError.message });
        }

        if (existingData) {
          return from(
            client
              .from(this.TABLE_NAME)
              .update({
                ...content,
                updated_at: new Date().toISOString()
              })
              .eq('id', existingData.id)
              .select()
              .single()
          ).pipe(
            map(({ data, error }) => {
              if (error) {
                return { success: false, error: error.message };
              }
              return { success: true, data: data as HomePageContent };
            })
          );
        } else {
          return from(
            client
              .from(this.TABLE_NAME)
              .insert({
                ...content,
                updated_at: new Date().toISOString()
              })
              .select()
              .single()
          ).pipe(
            map(({ data, error }) => {
              if (error) {
                return { success: false, error: error.message };
              }
              return { success: true, data: data as HomePageContent };
            })
          );
        }
      }),
      catchError((error) => {
        return of({ success: false, error: error.message || 'An error occurred' });
      })
    );
  }

  // Home Page Services Section (Service Cards)
  getHomeServicesSection(): Observable<HomeServiceCard[]> {
    const client = this.supabaseService.client;
    if (!client) {
      return of([]);
    }

    return from(
      client
        .from('home_services_section')
        .select('*')
        .order('display_order', { ascending: true })
    ).pipe(
      map(({ data, error }) => {
        if (error) {
          console.error('Error fetching home services section:', error);
          return [];
        }
        return (data || []) as HomeServiceCard[];
      }),
      catchError(() => of([]))
    );
  }

  updateHomeServiceCard(service: Partial<HomeServiceCard>): Observable<{ success: boolean; error?: string; data?: HomeServiceCard }> {
    const client = this.supabaseService.client;
    if (!client) {
      return of({ success: false, error: 'Supabase client not initialized' });
    }

    if (!service.service_id) {
      return of({ success: false, error: 'service_id is required' });
    }

    return from(
      client
        .from('home_services_section')
        .upsert({
          ...service,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'service_id'
        })
        .select()
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) {
          return { success: false, error: error.message };
        }
        return { success: true, data: data as HomeServiceCard };
      }),
      catchError((error) => of({ success: false, error: error.message || 'An error occurred' }))
    );
  }

  // Services Content (Service Detail Pages)
  getServicesContent(): Observable<ServiceContent[]> {
    const client = this.supabaseService.client;
    if (!client) {
      return of([]);
    }

    return from(
      client
        .from('services_content')
        .select('*')
        .order('display_order', { ascending: true })
    ).pipe(
      map(({ data, error }) => {
        if (error) {
          console.error('Error fetching services:', error);
          return [];
        }
        return (data || []).map(item => ({
          ...item,
          services: Array.isArray(item.services) ? item.services : [],
          benefits: Array.isArray(item.benefits) ? item.benefits : []
        })) as ServiceContent[];
      }),
      catchError(() => of([]))
    );
  }

  updateServiceContent(service: Partial<ServiceContent>): Observable<{ success: boolean; error?: string; data?: ServiceContent }> {
    const client = this.supabaseService.client;
    if (!client) {
      return of({ success: false, error: 'Supabase client not initialized' });
    }

    if (!service.service_id) {
      return of({ success: false, error: 'service_id is required' });
    }

    return from(
      client
        .from('services_content')
        .upsert({
          ...service,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'service_id'
        })
        .select()
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) {
          return { success: false, error: error.message };
        }
        return { success: true, data: data as ServiceContent };
      }),
      catchError((error) => of({ success: false, error: error.message || 'An error occurred' }))
    );
  }

  // Projects Content
  getProjectsContent(): Observable<ProjectContent[]> {
    const client = this.supabaseService.client;
    if (!client) {
      return of([]);
    }

    return from(
      client
        .from('projects_content')
        .select('*')
        .order('display_order', { ascending: true })
    ).pipe(
      map(({ data, error }) => {
        if (error) {
          console.error('Error fetching projects:', error);
          return [];
        }
        return (data || []).map(item => ({
          ...item,
          background_images: Array.isArray(item.background_images) ? item.background_images : []
        })) as ProjectContent[];
      }),
      catchError(() => of([]))
    );
  }

  updateProjectContent(project: Partial<ProjectContent>): Observable<{ success: boolean; error?: string; data?: ProjectContent }> {
    const client = this.supabaseService.client;
    if (!client) {
      return of({ success: false, error: 'Supabase client not initialized' });
    }

    if (!project.project_id) {
      return of({ success: false, error: 'project_id is required' });
    }

    return from(
      client
        .from('projects_content')
        .upsert({
          ...project,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'project_id'
        })
        .select()
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) {
          return { success: false, error: error.message };
        }
        return { success: true, data: data as ProjectContent };
      }),
      catchError((error) => of({ success: false, error: error.message || 'An error occurred' }))
    );
  }

  // Testimonials Content
  getTestimonialsContent(): Observable<TestimonialContent[]> {
    const client = this.supabaseService.client;
    if (!client) {
      return of([]);
    }

    return from(
      client
        .from('testimonials_content')
        .select('*')
        .order('display_order', { ascending: true })
    ).pipe(
      map(({ data, error }) => {
        if (error) {
          console.error('Error fetching testimonials:', error);
          return [];
        }
        return (data || []) as TestimonialContent[];
      }),
      catchError(() => of([]))
    );
  }

  updateTestimonialContent(testimonial: Partial<TestimonialContent>): Observable<{ success: boolean; error?: string; data?: TestimonialContent }> {
    const client = this.supabaseService.client;
    if (!client) {
      return of({ success: false, error: 'Supabase client not initialized' });
    }

    return from(
      client
        .from('testimonials_content')
        .upsert({
          ...testimonial,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'id'
        })
        .select()
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) {
          return { success: false, error: error.message };
        }
        return { success: true, data: data as TestimonialContent };
      }),
      catchError((error) => of({ success: false, error: error.message || 'An error occurred' }))
    );
  }

  // FAQ Content
  getFAQContent(): Observable<FAQContent[]> {
    const client = this.supabaseService.client;
    if (!client) {
      return of([]);
    }

    return from(
      client
        .from('faq_content')
        .select('*')
        .order('display_order', { ascending: true })
    ).pipe(
      map(({ data, error }) => {
        if (error) {
          console.error('Error fetching FAQs:', error);
          return [];
        }
        return (data || []) as FAQContent[];
      }),
      catchError(() => of([]))
    );
  }

  updateFAQContent(faq: Partial<FAQContent>): Observable<{ success: boolean; error?: string; data?: FAQContent }> {
    const client = this.supabaseService.client;
    if (!client) {
      return of({ success: false, error: 'Supabase client not initialized' });
    }

    return from(
      client
        .from('faq_content')
        .upsert({
          ...faq,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'id'
        })
        .select()
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) {
          return { success: false, error: error.message };
        }
        return { success: true, data: data as FAQContent };
      }),
      catchError((error) => of({ success: false, error: error.message || 'An error occurred' }))
    );
  }

  deleteFAQContent(id: string): Observable<{ success: boolean; error?: string }> {
    const client = this.supabaseService.client;
    if (!client) {
      return of({ success: false, error: 'Supabase client not initialized' });
    }

    if (!id) {
      return of({ success: false, error: 'FAQ ID is required' });
    }

    return from(
      client
        .from('faq_content')
        .delete()
        .eq('id', id)
    ).pipe(
      map(({ error }) => {
        if (error) {
          return { success: false, error: error.message };
        }
        return { success: true };
      }),
      catchError((error) => of({ success: false, error: error.message || 'An error occurred' }))
    );
  }

  // Legal Pages Content
  getLegalPageContent(pageType: 'accessibility-statement' | 'privacy-policy' | 'terms-conditions'): Observable<LegalPageContent | null> {
    const client = this.supabaseService.client;
    if (!client) {
      return of(null);
    }

    return from(
      client
        .from('legal_pages_content')
        .select('*, sections:legal_page_sections(*)')
        .eq('page_type', pageType)
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching legal page content:', error);
          return null;
        }
        if (data) {
          // Sort sections by display_order
          if (data.sections && Array.isArray(data.sections)) {
            data.sections.sort((a: LegalPageSection, b: LegalPageSection) => 
              (a.display_order || 0) - (b.display_order || 0)
            );
          }
        }
        return data as LegalPageContent | null;
      }),
      catchError(() => of(null))
    );
  }

  updateLegalPageContent(content: Partial<LegalPageContent>): Observable<{ success: boolean; error?: string; data?: LegalPageContent }> {
    const client = this.supabaseService.client;
    if (!client) {
      return of({ success: false, error: 'Supabase client not initialized' });
    }

    if (!content.page_type) {
      return of({ success: false, error: 'page_type is required' });
    }

    const sections = content.sections || [];
    delete content.sections; // Remove sections from main content

    return from(
      client
        .from('legal_pages_content')
        .upsert({
          ...content,
          last_updated: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'page_type'
        })
        .select()
        .single()
    ).pipe(
      switchMap(({ data: pageData, error: pageError }) => {
        if (pageError) {
          return of({ success: false, error: pageError.message });
        }

        if (!pageData || !sections.length) {
          return of({ success: true, data: pageData as LegalPageContent });
        }

        // Update sections
        const sectionUpdates = sections.map((section, index) => ({
          ...section,
          page_id: pageData.id,
          display_order: section.display_order ?? index
        }));

        return from(
          client
            .from('legal_page_sections')
            .upsert(sectionUpdates, {
              onConflict: 'id'
            })
            .select()
        ).pipe(
          map(({ data: sectionsData, error: sectionsError }) => {
            if (sectionsError) {
              return { success: false, error: sectionsError.message };
            }
            return { 
              success: true, 
              data: { ...pageData, sections: sectionsData || [] } as LegalPageContent 
            };
          })
        );
      }),
      catchError((error) => of({ success: false, error: error.message || 'An error occurred' }))
    );
  }
}

