import { Injectable, inject, PLATFORM_ID, TransferState, makeStateKey } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Observable, from, of, throwError } from 'rxjs';
import { map, catchError, switchMap, tap, shareReplay, finalize } from 'rxjs/operators';
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

export interface ServicesSectionHeader {
  id?: string;
  kicker: string;
  title: string;
  description: string;
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
  services?: string[];
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

// TransferState keys for SSR
const HOME_PAGE_CONTENT_KEY = makeStateKey<HomePageContent | null>('home_page_content');
const HOME_SERVICES_SECTION_KEY = makeStateKey<HomeServiceCard[]>('home_services_section');
const SERVICES_SECTION_HEADER_KEY = makeStateKey<ServicesSectionHeader | null>('services_section_header');
const SERVICES_CONTENT_KEY = makeStateKey<ServiceContent[]>('services_content');
const PROJECTS_CONTENT_KEY = makeStateKey<ProjectContent[]>('projects_content');
const TESTIMONIALS_CONTENT_KEY = makeStateKey<TestimonialContent[]>('testimonials_content');
const FAQ_CONTENT_KEY = makeStateKey<FAQContent[]>('faq_content');
const LEGAL_PAGE_CONTENT_KEY = makeStateKey<Record<string, LegalPageContent | null>>('legal_pages_content');

type UpdateResult<T> = { success: boolean; error?: string; data?: T };
type SupabaseResponse<T> = { data: T | null; error: any };
type StateKey<T> = ReturnType<typeof makeStateKey<T>>;

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  private readonly supabaseService = inject(SupabaseService);
  private readonly transferState = inject(TransferState);
  private readonly platformId = inject(PLATFORM_ID);
  
  // Cache observables to prevent duplicate requests
  private readonly cache = new Map<string, Observable<any>>();

  /**
   * Helper method to check TransferState cache
   */
  private getFromTransferState<T>(key: StateKey<T>, defaultValue: T | null = null): T | null {
    if (isPlatformBrowser(this.platformId)) {
      const cached = this.transferState.get<T | null>(key, null);
      return cached !== null ? cached : defaultValue;
    }
    return defaultValue;
  }

  /**
   * Helper method to set TransferState cache
   */
  private setTransferState<T>(key: StateKey<T>, value: T): void {
    if (isPlatformServer(this.platformId)) {
      this.transferState.set(key, value);
    }
  }

  /**
   * Helper method to get Supabase client or return error observable
   */
  private getClientOrError(): Observable<never> | null {
    const client = this.supabaseService.client;
    if (!client) {
      return throwError(() => new Error('Supabase client not initialized'));
    }
    return null;
  }

  /**
   * Generic method to fetch single record from a table
   */
  private fetchSingle<T>(
    tableName: string,
    transferKey: StateKey<T | null>,
    orderBy: string = 'updated_at',
    transform?: (data: any) => T
  ): Observable<T | null> {
    // Check cache first
    const cached = this.getFromTransferState(transferKey);
    if (cached !== null) {
      return of(cached);
    }

    // Check if observable is already in flight
    const cacheKey = `fetch_${tableName}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const client = this.supabaseService.client;
    if (!client) {
      return of(null);
    }

    const observable = from(
      client
        .from(tableName)
        .select('*')
        .order(orderBy, { ascending: false })
        .limit(1)
        .single()
    ).pipe(
      map(({ data, error }: SupabaseResponse<T>) => {
        if (error && error.code !== 'PGRST116') {
          console.error(`Error fetching ${tableName}:`, error);
          return null;
        }
        return transform ? transform(data) : (data as T | null);
      }),
      tap((data: T | null) => this.setTransferState(transferKey, data)),
      shareReplay(1),
      catchError((error) => {
        console.error(`Error in fetchSingle for ${tableName}:`, error);
        return of(null);
      }),
      finalize(() => this.cache.delete(cacheKey))
    );

    this.cache.set(cacheKey, observable);
    return observable;
  }

  /**
   * Generic method to fetch multiple records from a table
   */
  private fetchMultiple<T>(
    tableName: string,
    transferKey: StateKey<T[]>,
    orderBy: string = 'display_order',
    transform?: (data: any[]) => T[]
  ): Observable<T[]> {
    // Check cache first
    const cached = this.getFromTransferState(transferKey, []);
    if (cached !== null && cached.length >= 0) {
      return of(cached);
    }

    // Check if observable is already in flight
    const cacheKey = `fetch_${tableName}_multiple`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const client = this.supabaseService.client;
    if (!client) {
      return of([]);
    }

    const observable = from(
      client
        .from(tableName)
        .select('*')
        .order(orderBy, { ascending: true })
    ).pipe(
      map(({ data, error }: SupabaseResponse<T[]>) => {
        if (error) {
          console.error(`Error fetching ${tableName}:`, error);
          return [];
        }
        const items = (data || []) as T[];
        return transform ? transform(items) : items;
      }),
      tap((data: T[]) => this.setTransferState(transferKey, data)),
      shareReplay(1),
      catchError(() => of([])),
      finalize(() => this.cache.delete(cacheKey))
    );

    this.cache.set(cacheKey, observable);
    return observable;
  }

  /**
   * Generic method to update or insert a single record
   */
  private upsertSingle<T extends { id?: string; updated_at?: string }>(
    tableName: string,
    content: Partial<T>,
    conflictColumn: string,
    getExistingQuery: () => any
  ): Observable<UpdateResult<T>> {
    const error = this.getClientOrError();
    if (error) {
      return of({ success: false, error: 'Supabase client not initialized' });
    }

    const client = this.supabaseService.client!;

    return from(getExistingQuery() as Promise<SupabaseResponse<T>>).pipe(
      switchMap(({ data: existingData, error: fetchError }) => {
        if (fetchError && fetchError.code !== 'PGRST116') {
          return of({ success: false, error: fetchError.message });
        }

        const updateData = {
          ...content,
          updated_at: new Date().toISOString()
        };

        if (existingData) {
          return from(
            client
              .from(tableName)
              .update(updateData)
              .eq('id', existingData.id)
              .select()
              .single()
          ).pipe(
            map(({ data, error }: SupabaseResponse<T>) => {
              if (error) {
                return { success: false, error: error.message };
              }
              return { success: true, data: data as T };
            })
          );
        } else {
          return from(
            client
              .from(tableName)
              .insert(updateData)
              .select()
              .single()
          ).pipe(
            map(({ data, error }: SupabaseResponse<T>) => {
              if (error) {
                return { success: false, error: error.message };
              }
              return { success: true, data: data as T };
            })
          );
        }
      }),
      catchError((error) => of({ success: false, error: error.message || 'An error occurred' }))
    );
  }

  /**
   * Generic method to upsert with conflict resolution
   */
  private upsertWithConflict<T extends { updated_at?: string }>(
    tableName: string,
    content: Partial<T>,
    conflictColumn: string
  ): Observable<UpdateResult<T>> {
    const error = this.getClientOrError();
    if (error) {
      return of({ success: false, error: 'Supabase client not initialized' });
    }

    const client = this.supabaseService.client!;

    if (!(content as any)[conflictColumn]) {
      return of({ success: false, error: `${conflictColumn} is required` });
    }

    return from(
      client
        .from(tableName)
        .upsert(
          {
            ...content,
            updated_at: new Date().toISOString()
          },
          { onConflict: conflictColumn }
        )
        .select()
        .single()
    ).pipe(
      map(({ data, error }: SupabaseResponse<T>) => {
        if (error) {
          return { success: false, error: error.message };
        }
        return { success: true, data: data as T };
      }),
      catchError((error) => of({ success: false, error: error.message || 'An error occurred' }))
    );
  }

  getHomePageContent(): Observable<HomePageContent | null> {
    return this.fetchSingle<HomePageContent>(
      'home_page_content',
      HOME_PAGE_CONTENT_KEY
    );
  }

  updateHomePageContent(content: Partial<HomePageContent>): Observable<UpdateResult<HomePageContent>> {
    const client = this.supabaseService.client;
    if (!client) {
      return of({ success: false, error: 'Supabase client not initialized' });
    }

    return this.upsertSingle<HomePageContent>(
      'home_page_content',
      content,
      'id',
      () => client
        .from('home_page_content')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1)
        .single()
    ).pipe(
      tap((result) => {
        if (result.success && result.data) {
          // Invalidate cache
          this.cache.delete('fetch_home_page_content');
          this.setTransferState(HOME_PAGE_CONTENT_KEY, result.data);
        }
      })
    );
  }

  // Home Page Services Section (Service Cards)
  getHomeServicesSection(): Observable<HomeServiceCard[]> {
    return this.fetchMultiple<HomeServiceCard>(
      'home_services_section',
      HOME_SERVICES_SECTION_KEY
    );
  }

  updateHomeServiceCard(service: Partial<HomeServiceCard>): Observable<UpdateResult<HomeServiceCard>> {
    return this.upsertWithConflict<HomeServiceCard>(
      'home_services_section',
      service,
      'service_id'
    ).pipe(
      tap((result) => {
        if (result.success) {
          this.cache.delete('fetch_home_services_section_multiple');
        }
      })
    );
  }

  // Services Section Header
  getServicesSectionHeader(): Observable<ServicesSectionHeader | null> {
    return this.fetchSingle<ServicesSectionHeader>(
      'services_section_header',
      SERVICES_SECTION_HEADER_KEY
    );
  }

  updateServicesSectionHeader(content: Partial<ServicesSectionHeader>): Observable<UpdateResult<ServicesSectionHeader>> {
    const client = this.supabaseService.client;
    if (!client) {
      return of({ success: false, error: 'Supabase client not initialized' });
    }

    return this.upsertSingle<ServicesSectionHeader>(
      'services_section_header',
      content,
      'id',
      () => client
        .from('services_section_header')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1)
        .single()
    ).pipe(
      tap((result) => {
        if (result.success && result.data) {
          this.cache.delete('fetch_services_section_header');
          this.setTransferState(SERVICES_SECTION_HEADER_KEY, result.data);
        }
      })
    );
  }

  // Services Content (Service Detail Pages)
  getServicesContent(): Observable<ServiceContent[]> {
    return this.fetchMultiple<ServiceContent>(
      'services_content',
      SERVICES_CONTENT_KEY,
      'display_order',
      (items) => items.map(item => ({
        ...item,
        services: Array.isArray(item.services) ? item.services : [],
        benefits: Array.isArray(item.benefits) ? item.benefits : []
      })) as ServiceContent[]
    );
  }

  updateServiceContent(service: Partial<ServiceContent>): Observable<UpdateResult<ServiceContent>> {
    return this.upsertWithConflict<ServiceContent>(
      'services_content',
      service,
      'service_id'
    ).pipe(
      tap((result) => {
        if (result.success) {
          this.cache.delete('fetch_services_content_multiple');
        }
      })
    );
  }

  // Projects Content
  getProjectsContent(): Observable<ProjectContent[]> {
    return this.fetchMultiple<ProjectContent>(
      'projects_content',
      PROJECTS_CONTENT_KEY,
      'display_order',
      (items) => items.map(item => ({
        ...item,
        background_images: Array.isArray(item.background_images) ? item.background_images : [],
        services: Array.isArray(item.services) ? item.services : []
      })) as ProjectContent[]
    );
  }

  updateProjectContent(project: Partial<ProjectContent>): Observable<UpdateResult<ProjectContent>> {
    return this.upsertWithConflict<ProjectContent>(
      'projects_content',
      project,
      'project_id'
    ).pipe(
      tap((result) => {
        if (result.success) {
          this.cache.delete('fetch_projects_content_multiple');
        }
      })
    );
  }

  // Testimonials Content
  getTestimonialsContent(): Observable<TestimonialContent[]> {
    return this.fetchMultiple<TestimonialContent>(
      'testimonials_content',
      TESTIMONIALS_CONTENT_KEY
    );
  }

  updateTestimonialContent(testimonial: Partial<TestimonialContent>): Observable<UpdateResult<TestimonialContent>> {
    return this.upsertWithConflict<TestimonialContent>(
      'testimonials_content',
      testimonial,
      'id'
    ).pipe(
      tap((result) => {
        if (result.success) {
          this.cache.delete('fetch_testimonials_content_multiple');
        }
      })
    );
  }

  deleteTestimonialContent(id: string): Observable<{ success: boolean; error?: string }> {
    const error = this.getClientOrError();
    if (error) {
      return of({ success: false, error: 'Supabase client not initialized' });
    }

    if (!id) {
      return of({ success: false, error: 'Testimonial ID is required' });
    }

    const client = this.supabaseService.client!;

    return from(
      client
        .from('testimonials_content')
        .delete()
        .eq('id', id)
    ).pipe(
      map(({ error }) => {
        if (error) {
          return { success: false, error: error.message };
        }
        // Invalidate cache
        this.cache.delete('fetch_testimonials_content_multiple');
        return { success: true };
      }),
      catchError((error) => of({ success: false, error: error.message || 'An error occurred' }))
    );
  }

  // FAQ Content
  getFAQContent(): Observable<FAQContent[]> {
    return this.fetchMultiple<FAQContent>(
      'faq_content',
      FAQ_CONTENT_KEY
    );
  }

  updateFAQContent(faq: Partial<FAQContent>): Observable<UpdateResult<FAQContent>> {
    return this.upsertWithConflict<FAQContent>(
      'faq_content',
      faq,
      'id'
    ).pipe(
      tap((result) => {
        if (result.success) {
          this.cache.delete('fetch_faq_content_multiple');
        }
      })
    );
  }

  deleteFAQContent(id: string): Observable<{ success: boolean; error?: string }> {
    const error = this.getClientOrError();
    if (error) {
      return of({ success: false, error: 'Supabase client not initialized' });
    }

    if (!id) {
      return of({ success: false, error: 'FAQ ID is required' });
    }

    const client = this.supabaseService.client!;

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
        // Invalidate cache
        this.cache.delete('fetch_faq_content_multiple');
        return { success: true };
      }),
      catchError((error) => of({ success: false, error: error.message || 'An error occurred' }))
    );
  }

  // Legal Pages Content
  getLegalPageContent(pageType: 'accessibility-statement' | 'privacy-policy' | 'terms-conditions'): Observable<LegalPageContent | null> {
    // Check TransferState first (client-side hydration)
    if (isPlatformBrowser(this.platformId)) {
      const cachedPages = this.transferState.get<Record<string, LegalPageContent | null> | null>(LEGAL_PAGE_CONTENT_KEY, null);
      if (cachedPages && cachedPages[pageType] !== undefined) {
        return of(cachedPages[pageType]);
      }
    }

    // Check if observable is already in flight
    const cacheKey = `fetch_legal_page_${pageType}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const client = this.supabaseService.client;
    if (!client) {
      return of(null);
    }

    const observable = from(
      client
        .from('legal_pages_content')
        .select('*, sections:legal_page_sections(*)')
        .eq('page_type', pageType)
        .single()
    ).pipe(
      map(({ data, error }: SupabaseResponse<LegalPageContent>) => {
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
      tap((data: LegalPageContent | null) => {
        // Store in TransferState on server
        if (isPlatformServer(this.platformId)) {
          const cachedPages = this.transferState.get<Record<string, LegalPageContent | null>>(LEGAL_PAGE_CONTENT_KEY, {});
          this.transferState.set(LEGAL_PAGE_CONTENT_KEY, {
            ...cachedPages,
            [pageType]: data
          });
        }
      }),
      shareReplay(1),
      catchError(() => of(null)),
      finalize(() => this.cache.delete(cacheKey))
    );

    this.cache.set(cacheKey, observable);
    return observable;
  }

  updateLegalPageContent(content: Partial<LegalPageContent>): Observable<UpdateResult<LegalPageContent>> {
    const error = this.getClientOrError();
    if (error) {
      return of({ success: false, error: 'Supabase client not initialized' });
    }

    if (!content.page_type) {
      return of({ success: false, error: 'page_type is required' });
    }

    const client = this.supabaseService.client!;
    const sections = content.sections || [];
    const pageType = content.page_type;
    const contentWithoutSections = { ...content };
    delete contentWithoutSections.sections;

    return from(
      client
        .from('legal_pages_content')
        .upsert({
          ...contentWithoutSections,
          last_updated: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'page_type'
        })
        .select()
        .single()
    ).pipe(
      switchMap(({ data: pageData, error: pageError }: SupabaseResponse<LegalPageContent>) => {
        if (pageError) {
          return of({ success: false, error: pageError.message });
        }

        if (!pageData) {
          return of({ success: true, data: { ...contentWithoutSections, sections: [] } as LegalPageContent });
        }

        if (!sections.length) {
          // Delete all sections if none provided
          return from(
            client
              .from('legal_page_sections')
              .delete()
              .eq('page_id', pageData.id)
          ).pipe(
            map(() => ({ success: true, data: { ...pageData, sections: [] } as LegalPageContent }))
          );
        }

        // Prepare section updates
        const sectionUpdates = sections.map((section, index) => ({
          ...section,
          page_id: pageData.id,
          display_order: section.display_order ?? index
        }));

        // Upsert sections
        return from(
          client
            .from('legal_page_sections')
            .upsert(sectionUpdates, {
              onConflict: 'id'
            })
            .select()
        ).pipe(
          switchMap(({ data: upsertedSections, error: sectionsError }: SupabaseResponse<LegalPageSection[]>) => {
            if (sectionsError) {
              return of({ success: false, error: sectionsError.message });
            }

            // Determine which IDs should remain
            const idsToKeep = sectionUpdates
              .map(s => (s as any).id)
              .filter((id: unknown): id is string | number => !!id)
              .map(String);

            // Delete sections that are no longer present
            const deleteQuery = idsToKeep.length > 0
              ? client
                  .from('legal_page_sections')
                  .delete()
                  .eq('page_id', pageData.id)
                  .not('id', 'in', `(${idsToKeep.join(',')})`)
              : client
                  .from('legal_page_sections')
                  .delete()
                  .eq('page_id', pageData.id);

            return from(deleteQuery).pipe(
              switchMap(({ error: deleteError }) => {
                if (deleteError) {
                  return of({ success: false, error: deleteError.message });
                }

                // Fetch final sections list
                return from(
                  client
                    .from('legal_page_sections')
                    .select('*')
                    .eq('page_id', pageData.id)
                    .order('display_order', { ascending: true })
                ).pipe(
                  map(({ data: finalSections, error: finalError }: SupabaseResponse<LegalPageSection[]>) => {
                    if (finalError) {
                      return { success: false, error: finalError.message };
                    }
                    return {
                      success: true,
                      data: { ...pageData, sections: finalSections || [] } as LegalPageContent
                    };
                  })
                );
              })
            );
          })
        );
      }),
      tap((result: UpdateResult<LegalPageContent>) => {
        if (result.success && 'data' in result && result.data) {
          // Invalidate all caches for this page type
          const cacheKey = `fetch_legal_page_${pageType}`;
          this.cache.delete(cacheKey);
          
          // Clear TransferState cache to force fresh fetch on next request
          // This ensures the updated content is fetched on the next page load
          if (isPlatformBrowser(this.platformId)) {
            // On client, clear the cached page from TransferState
            const cachedPages = this.transferState.get<Record<string, LegalPageContent | null>>(LEGAL_PAGE_CONTENT_KEY, {});
            delete cachedPages[pageType];
            this.transferState.set(LEGAL_PAGE_CONTENT_KEY, cachedPages);
          }
          // On server, TransferState will be fresh on next request anyway
        }
      }),
      catchError((error) => of({ success: false, error: error.message || 'An error occurred' }))
    );
  }

  /**
   * Clear all caches for a specific legal page
   * This forces a fresh fetch from the database on the next request
   */
  clearLegalPageCache(pageType: 'accessibility-statement' | 'privacy-policy' | 'terms-conditions'): void {
    // Clear in-memory cache
    const cacheKey = `fetch_legal_page_${pageType}`;
    this.cache.delete(cacheKey);

    // Clear TransferState cache (client-side)
    if (isPlatformBrowser(this.platformId)) {
      const cachedPages = this.transferState.get<Record<string, LegalPageContent | null>>(LEGAL_PAGE_CONTENT_KEY, {});
      delete cachedPages[pageType];
      this.transferState.set(LEGAL_PAGE_CONTENT_KEY, cachedPages);
    }

    // Clear localStorage cache (if exists)
    if (isPlatformBrowser(this.platformId) && typeof window !== 'undefined' && window.localStorage) {
      const localStorageKey = `legal_page_${pageType.replace('-', '_')}`;
      try {
        window.localStorage.removeItem(localStorageKey);
      } catch (error) {
        console.warn('Failed to clear localStorage cache:', error);
      }
    }
  }

  /**
   * Clear all caches for all legal pages
   */
  clearAllLegalPagesCache(): void {
    this.clearLegalPageCache('accessibility-statement');
    this.clearLegalPageCache('privacy-policy');
    this.clearLegalPageCache('terms-conditions');
  }
}

