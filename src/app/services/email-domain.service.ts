import { Injectable, inject } from '@angular/core';
import { from, map, of, catchError, switchMap } from 'rxjs';
import { SupabaseService } from './supabase.service';

export interface EmailDomainRecord {
  domain: string;
  created_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmailDomainService {
  private readonly supabaseService = inject(SupabaseService);
  private readonly TABLE_NAME = 'email_disposable_domains';

  getDisposableEmailDomains() {
    const client = this.supabaseService.client;
    if (!client) {
      return of<string[]>([]);
    }

    return from(
      client
        .from(this.TABLE_NAME)
        .select<'*', EmailDomainRecord>('*')
        .order('domain', { ascending: true })
    ).pipe(
      map(({ data, error }) => {
        if (error) {
          console.error('Error fetching disposable email domains:', error);
          return [] as string[];
        }
        return (data || []).map(record => record.domain.toLowerCase());
      }),
      catchError((error) => {
        console.error('Error in getDisposableEmailDomains:', error);
        return of<string[]>([]);
      })
    );
  }

  addDisposableEmailDomain(domain: string) {
    const client = this.supabaseService.client;
    if (!client) {
      return of({ success: false, error: 'Supabase client not initialized', domains: [] as string[] });
    }

    const normalizedDomain = domain.toLowerCase();

    return from(
      client
        .from(this.TABLE_NAME)
        .upsert(
          { domain: normalizedDomain, created_at: new Date().toISOString() } as EmailDomainRecord,
          { onConflict: 'domain' }
        )
    ).pipe(
      switchMap(({ error }) => {
        if (error) {
          return of<{ success: boolean; error?: string; domains: string[] }>({
            success: false,
            error: error.message || 'Failed to add domain',
            domains: []
          });
        }
        // After mutation, fetch the updated list so callers always receive fresh data
        return this.getDisposableEmailDomains().pipe(
          map((domains) => ({ success: true, domains }))
        );
      }),
      catchError((error) => {
        console.error('Error adding disposable email domain:', error);
        return of<{ success: boolean; error?: string; domains: string[] }>({
          success: false,
          error: error.message || 'Failed to add domain',
          domains: []
        });
      })
    );
  }

  deleteDisposableEmailDomain(domain: string) {
    const client = this.supabaseService.client;
    if (!client) {
      return of({ success: false, error: 'Supabase client not initialized', domains: [] as string[] });
    }

    const normalizedDomain = domain.toLowerCase();

    return from(
      client
        .from(this.TABLE_NAME)
        .delete()
        .eq('domain', normalizedDomain)
    ).pipe(
      switchMap(({ error }) => {
        if (error) {
          return of<{ success: boolean; error?: string; domains: string[] }>({
            success: false,
            error: error.message || 'Failed to delete domain',
            domains: []
          });
        }
        // After mutation, fetch the updated list so callers always receive fresh data
        return this.getDisposableEmailDomains().pipe(
          map((domains) => ({ success: true, domains }))
        );
      }),
      catchError((error) => {
        console.error('Error deleting disposable email domain:', error);
        return of<{ success: boolean; error?: string; domains: string[] }>({
          success: false,
          error: error.message || 'Failed to delete domain',
          domains: []
        });
      })
    );
  }
}


