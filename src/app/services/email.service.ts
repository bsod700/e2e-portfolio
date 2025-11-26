import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface EmailData {
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  message: string;
}

export interface EmailResponse {
  success: boolean;
  message: string;
  clientEmailId?: string;
  adminEmailId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private http = inject(HttpClient);
  
  // Use Vercel serverless function endpoint
  // In production, this will be relative to your domain
  // For local dev, you need to run: vercel dev
  private apiUrl = '/api/send-email';

  /**
   * Send contact form email through backend API
   * Sends confirmation to client and notification to admin
   */
  sendContactEmail(data: EmailData): Observable<EmailResponse> {
    return this.http.post<EmailResponse>(this.apiUrl, data).pipe(
      map(response => {
        console.log('Email sent successfully:', response);
        return response;
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred while sending the email';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      const serverError = error.error;
      
      if (typeof serverError === 'object' && serverError !== null) {
        errorMessage = serverError.error || serverError.details || serverError.message || errorMessage;
      } else if (typeof serverError === 'string') {
        errorMessage = serverError;
      } else {
        errorMessage = error.message || errorMessage;
      }
    }

    console.error('Email service error:', errorMessage);
    console.error('Full error object:', error);
    return throwError(() => new Error(errorMessage));
  }
}

