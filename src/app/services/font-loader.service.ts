import { Injectable, inject, OnDestroy } from '@angular/core';
import { DOCUMENT } from '@angular/common';

/**
 * Service for dynamically loading fonts into the document head.
 * Prevents duplicate font loading and provides automatic cleanup.
 */
@Injectable({
  providedIn: 'root'
})
export class FontLoaderService implements OnDestroy {
  private readonly document = inject(DOCUMENT);
  private readonly loadedFonts = new Map<string, HTMLLinkElement>();
  private readonly referenceCount = new Map<string, number>();

  /**
   * Loads a font stylesheet into the document head.
   * If the font is already loaded, it increments the reference count.
   * 
   * @param href - The URL of the font stylesheet to load
   * @param fontId - A unique identifier for the font (used to track and prevent duplicates)
   * @returns A cleanup function that should be called when the font is no longer needed
   */
  loadFont(href: string, fontId: string): () => void {
    if (!href || !fontId) {
      console.warn('FontLoaderService: href and fontId are required');
      return () => {};
    }

    // Check if font is already loaded
    const existingLink = this.loadedFonts.get(fontId);
    if (existingLink) {
      // Increment reference count
      const count = this.referenceCount.get(fontId) || 0;
      this.referenceCount.set(fontId, count + 1);
      
      // Return cleanup function that decrements reference count
      return () => {
        const currentCount = this.referenceCount.get(fontId) || 0;
        if (currentCount > 1) {
          this.referenceCount.set(fontId, currentCount - 1);
        } else {
          this.removeFont(fontId);
        }
      };
    }

    // Check if link already exists in DOM (from previous load)
    const head = this.document.head;
    const existingDomLink = head.querySelector<HTMLLinkElement>(
      `link[data-font-id="${fontId}"]`
    );

    if (existingDomLink) {
      this.loadedFonts.set(fontId, existingDomLink);
      const count = this.referenceCount.get(fontId) || 0;
      this.referenceCount.set(fontId, count + 1);
      
      return () => {
        const currentCount = this.referenceCount.get(fontId) || 0;
        if (currentCount > 1) {
          this.referenceCount.set(fontId, currentCount - 1);
        } else {
          this.removeFont(fontId);
        }
      };
    }

    // Create and append new font link
    const linkEl = this.document.createElement('link');
    linkEl.rel = 'stylesheet';
    linkEl.href = href;
    linkEl.setAttribute('data-font-id', fontId);

    head.appendChild(linkEl);
    this.loadedFonts.set(fontId, linkEl);
    this.referenceCount.set(fontId, 1);

    // Return cleanup function
    return () => {
      const currentCount = this.referenceCount.get(fontId) || 0;
      if (currentCount > 1) {
        this.referenceCount.set(fontId, currentCount - 1);
      } else {
        this.removeFont(fontId);
      }
    };
  }

  /**
   * Removes a font from the document head.
   * Only removes if reference count is 0.
   * 
   * @param fontId - The unique identifier of the font to remove
   */
  private removeFont(fontId: string): void {
    const linkElement = this.loadedFonts.get(fontId);
    if (linkElement?.parentNode) {
      linkElement.parentNode.removeChild(linkElement);
      this.loadedFonts.delete(fontId);
      this.referenceCount.delete(fontId);
    }
  }

  /**
   * Checks if a font is currently loaded.
   * 
   * @param fontId - The unique identifier of the font to check
   * @returns True if the font is loaded, false otherwise
   */
  isFontLoaded(fontId: string): boolean {
    return this.loadedFonts.has(fontId);
  }

  /**
   * Cleans up all loaded fonts when the service is destroyed.
   */
  ngOnDestroy(): void {
    // Remove all fonts
    for (const fontId of this.loadedFonts.keys()) {
      this.removeFont(fontId);
    }
  }
}

