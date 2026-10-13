import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { Character, CharacterApiResponse, Episode } from '../models/character.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;

  // Signals to store and preserve selection, pagination, search, and view mode state across navigation
  readonly selectedCharacterId = signal<number | null>(null);
  readonly currentPage = signal<number>(1);
  readonly searchQuery = signal<string>('');
  readonly viewMode = signal<'grid' | 'list'>('grid');

  setSelectedCharacter(id: number | null) {
    this.selectedCharacterId.set(id);
  }

  setCurrentPage(page: number) {
    this.currentPage.set(page);
  }

  setSearchQuery(query: string) {
    this.searchQuery.set(query);
  }

  setViewMode(mode: 'grid' | 'list') {
    this.viewMode.set(mode);
  }

  // Fetch paginated characters with optional name filter
  getCharacters(page: number = 1, name?: string): Observable<CharacterApiResponse> {
    let params = new HttpParams().set('page', page.toString());
    if (name) {
      params = params.set('name', name);
    }
    return this.http.get<CharacterApiResponse>(`${this.baseUrl}/character`, { params });
  }

  // Fetch single character details by ID
  getCharacterById(id: number): Observable<Character> {
    return this.http.get<Character>(`${this.baseUrl}/character/${id}`);
  }

  // Fetch multiple episodes in parallel
  getEpisodes(episodeUrls: string[]): Observable<Episode[]> {
    if (!episodeUrls || episodeUrls.length === 0) {
      return of([]);
    }
    const requests = episodeUrls.map(url => this.http.get<Episode>(url));
    return forkJoin(requests);
  }
}