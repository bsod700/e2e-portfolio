import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient | null = null;
  private platformId = inject(PLATFORM_ID);

  constructor() {
    if (isPlatformBrowser(this.platformId) && environment.supabase.anonKey && environment.supabase.url) {
      this.supabase = createClient(environment.supabase.url, environment.supabase.anonKey);
    }
  }

  get client(): SupabaseClient | null {
    return this.supabase;
  }
}

