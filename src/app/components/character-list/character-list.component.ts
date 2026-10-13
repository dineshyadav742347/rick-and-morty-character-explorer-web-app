import { Component, OnInit, DestroyRef, inject, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CharacterService } from '../../services/character.service';
import { AuthService } from '../../services/auth.service';
import { Character } from '../../models/character.model';
import { PaginationComponent } from '../pagination/pagination.component';
import { APP_CONSTANTS } from '../../constants/app.constants';

@Component({
  selector: 'app-character-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, PaginationComponent],
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CharacterListComponent implements OnInit {
  protected readonly apiService = inject(CharacterService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  readonly characters = signal<Character[]>([]);
  readonly info = signal({ count: 0, pages: 1, next: null as string | null, prev: null as string | null });
  
  currentPage = 1;
  searchQuery = '';
  viewMode: 'grid' | 'list' = 'grid';

  readonly loading = signal<boolean>(false);
  readonly errorMessage = signal<string>('');
  readonly showUnauthorizedAlert = signal<boolean>(false);
  protected readonly constants = APP_CONSTANTS;
  private searchTimeout: any;

  ngOnInit() {
    // Restore preserved state from CharacterService
    this.currentPage = this.apiService.currentPage();
    this.searchQuery = this.apiService.searchQuery();
    this.viewMode = this.apiService.viewMode();

    // Check if redirected from unauthorized route guard
    this.route.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {
        if (params['unauthorized']) {
          this.showUnauthorizedAlert.set(true);
        }
      });
    
    this.loadCharacters();
  }

  // Load characters list from API service using Signals
  loadCharacters() {
    this.loading.set(true);
    this.errorMessage.set('');
    
    this.apiService.getCharacters(this.currentPage, this.searchQuery)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.characters.set(response.results);
          this.info.set(response.info);
          this.loading.set(false);
        },
        error: (err) => {
          this.loading.set(false);
          if (err.status === 404) {
            this.characters.set([]);
            this.errorMessage.set(this.constants.MESSAGES.NO_CHARACTERS_FOUND);
          } else {
            this.errorMessage.set(this.constants.MESSAGES.LOAD_ERROR);
          }
        }
      });
  }

  // Handle search input with debounce
  onSearch() {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.currentPage = 1;
      this.apiService.setCurrentPage(1);
      this.apiService.setSearchQuery(this.searchQuery);
      this.loadCharacters();
    }, 300);
  }

  // Change view mode and persist in CharacterService
  changeViewMode(mode: 'grid' | 'list') {
    this.viewMode = mode;
    this.apiService.setViewMode(mode);
  }

  // Change current page and reload data, persisting in CharacterService
  changePage(newPage: number) {
    this.currentPage = newPage;
    this.apiService.setCurrentPage(newPage);
    this.loadCharacters();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Navigate to character details if user has admin role and save selection state
  selectCharacter(id: number) {
    this.apiService.setSelectedCharacter(id);
    if (!this.authService.isAdmin()) {
      this.showUnauthorizedAlert.set(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    this.router.navigate(['/characters', id]);
  }

  // TrackBy function for high-performance *ngFor rendering
  trackByCharacterId(index: number, character: Character): number {
    return character.id;
  }
}