import { inject } from '@angular/core';
import { ResolveFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs';
import { ContentService, LegalPageContent } from '../services/content.service';

/**
 * Resolver for legal page content
 * Fetches the legal page content before the route loads
 * 
 * @param route - The activated route snapshot
 * @param state - The router state snapshot
 * @returns Observable of LegalPageContent or null
 */
export const legalPageResolver: ResolveFn<LegalPageContent | null> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<LegalPageContent | null> => {
  try {
    const contentService = inject(ContentService);
    
    // Determine page type from route path
    const path = state.url;
    let pageType: 'accessibility-statement' | 'privacy-policy' | 'terms-conditions';
    
    if (path.includes('terms-conditions')) {
      pageType = 'terms-conditions';
    } else if (path.includes('privacy-policy')) {
      pageType = 'privacy-policy';
    } else if (path.includes('accessibility-statement')) {
      pageType = 'accessibility-statement';
    } else {
      // Fallback - should not happen with proper routing
      pageType = 'terms-conditions';
    }
    
    return contentService.getLegalPageContent(pageType).pipe(
      catchError((error) => {
        console.error(`Error resolving legal page content for ${pageType}:`, error);
        return of(null);
      })
    );
  } catch (error) {
    console.error('Error in legal page resolver:', error);
    return of(null);
  }
};

