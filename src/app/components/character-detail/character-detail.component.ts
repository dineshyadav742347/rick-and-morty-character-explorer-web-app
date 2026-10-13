import { Component, OnInit, DestroyRef, inject, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CharacterService } from '../../services/character.service';
import { Character, Episode } from '../../models/character.model';
import { APP_CONSTANTS } from '../../constants/app.constants';

@Component({
  selector: 'app-character-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './character-detail.component.html',
  styleUrls: ['./character-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CharacterDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly apiService = inject(CharacterService);
  private readonly destroyRef = inject(DestroyRef);

  readonly character = signal<Character | null>(null);
  readonly episodes = signal<Episode[]>([]);
  readonly filteredEpisodes = signal<Episode[]>([]);
  episodeSearchQuery = '';
  readonly loading = signal<boolean>(false);
  readonly episodesLoading = signal<boolean>(false);
  protected readonly constants = APP_CONSTANTS;

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const charId = +idParam;
      this.apiService.setSelectedCharacter(charId);
      this.loadCharacterDetails(charId);
    }
  }

  // Load character details by ID using Signals
  loadCharacterDetails(id: number) {
    this.loading.set(true);
    this.apiService.getCharacterById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (char) => {
          this.character.set(char);
          this.loading.set(false);
          this.loadEpisodes(char.episode);
        },
        error: () => {
          this.loading.set(false);
        }
      });
  }

  // Load list of episodes for the character using Signals
  loadEpisodes(episodeUrls: string[]) {
    this.episodesLoading.set(true);
    this.apiService.getEpisodes(episodeUrls)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (eps) => {
          const fetchedEps = Array.isArray(eps) ? eps : [eps];
          this.episodes.set(fetchedEps);
          this.filteredEpisodes.set([...fetchedEps]);
          this.episodesLoading.set(false);
        },
        error: () => {
          this.episodesLoading.set(false);
        }
      });
  }

  // Filter episodes based on search input
  filterEpisodes() {
    const query = this.episodeSearchQuery.toLowerCase().trim();
    const currentEps = this.episodes();
    if (!query) {
      this.filteredEpisodes.set([...currentEps]);
    } else {
      this.filteredEpisodes.set(
        currentEps.filter(ep => 
          ep.name.toLowerCase().includes(query) || ep.episode.toLowerCase().includes(query)
        )
      );
    }
  }

  // TrackBy function for high-performance episode list rendering
  trackByEpisodeId(index: number, episode: Episode): number {
    return episode.id;
  }
}