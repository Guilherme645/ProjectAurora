import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageLoginComponent } from './pages/page-login/page-login.component';
import { NavBarComponent } from './pages/nav-bar/nav-bar.component';
import { PageBuscaComponent } from './pages/page-busca/page-busca.component';
import { PageCriarContaComponent } from './pages/page-criar-conta/page-criar-conta.component';
import { PageEsqueceuSenhaComponent } from './pages/page-esqueceu-senha/page-esqueceu-senha.component';
import { ResultComponent } from './pages/result/result.component';
import { PageMentionDetailComponent } from './pages/page-mention-detail/page-mention-detail.component';
import { ResultSavedSearchComponent } from './pages/result-saved-search/result-saved-search.component';
import { PageSavedSearchComponent } from './pages/page-saved-search/page-saved-search.component';
import { DescricaoContainerComponent } from './descricao-container/descricao-container.component';
import { ClippingComponent } from './components/clipping/clipping.component';

export const routes: Routes = [ 
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: PageLoginComponent },
  { path: 'navBar', component: NavBarComponent },
  { path: 'busca', component: PageBuscaComponent },
  { path: 'esqueceu', component: PageEsqueceuSenhaComponent },
  { path: 'criar', component: PageCriarContaComponent },
  { path: 'resultado', component: ResultComponent },
  { path: 'mention-details', component: PageMentionDetailComponent },
  { path: 'result-saved-search', component: ResultSavedSearchComponent },
  { path: 'saved-search', component: PageSavedSearchComponent },
  { path: 'textos', component: DescricaoContainerComponent },
    { path: 'clippings', component: ClippingComponent },





];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
