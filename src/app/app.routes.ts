import { Routes } from '@angular/router';
import { CharacterListComponent } from './components/character-list/character-list.component';
import { adminGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'characters', pathMatch: 'full' },
  { path: 'characters', component: CharacterListComponent },
  { 
    path: 'characters/:id', 
    loadComponent: () => import('./components/character-detail/character-detail.component').then(m => m.CharacterDetailComponent),
    canActivate: [adminGuard] 
  },
  { path: '**', redirectTo: 'characters' }
];