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

  updateDisposableEmailDomain(oldDomain: string, newDomain: string) {
    const client = this.supabaseService.client;
    if (!client) {
      return of<{ success: boolean; error?: string; domains: string[] }>({
        success: false,
        error: 'Supabase client not initialized',
        domains: []
      });
    }

    const oldNormalized = oldDomain.toLowerCase();
    const newNormalized = newDomain.toLowerCase();

    // If nothing changed, just return the current list
    if (oldNormalized === newNormalized) {
      return this.getDisposableEmailDomains().pipe(
        map((domains) => ({ success: true, domains }))
      );
    }

    // Upsert the new domain, then delete the old one, then return the refreshed list
    return from(
      client
        .from(this.TABLE_NAME)
        .upsert(
          { domain: newNormalized, created_at: new Date().toISOString() } as EmailDomainRecord,
          { onConflict: 'domain' }
        )
    ).pipe(
      switchMap(({ error }) => {
        if (error) {
          return of<{ success: boolean; error?: string; domains: string[] }>({
            success: false,
            error: error.message || 'Failed to update domain',
            domains: []
          });
        }

        // If the old domain and new domain are different, attempt to delete the old
        if (oldNormalized !== newNormalized) {
          return from(
            client
              .from(this.TABLE_NAME)
              .delete()
              .eq('domain', oldNormalized)
          ).pipe(
            switchMap(({ error: deleteError }) => {
              if (deleteError) {
                return of<{ success: boolean; error?: string; domains: string[] }>({
                  success: false,
                  error: deleteError.message || 'Failed to remove old domain',
                  domains: []
                });
              }
              return this.getDisposableEmailDomains().pipe(
                map((domains) => ({ success: true, domains }))
              );
            })
          );
        }

        // If domains are effectively the same, just fetch the updated list
        return this.getDisposableEmailDomains().pipe(
          map((domains) => ({ success: true, domains }))
        );
      }),
      catchError((error) => {
        console.error('Error updating disposable email domain:', error);
        return of<{ success: boolean; error?: string; domains: string[] }>({
          success: false,
          error: error.message || 'Failed to update domain',
          domains: []
        });
      })
    );
  }
}


