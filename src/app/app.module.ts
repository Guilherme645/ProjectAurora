import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { LoginComponent } from './components/login/login.component';
import { PageLoginComponent } from './pages/page-login/page-login.component';
import { CardComponent } from './components/card/card.component';
import { NavBarComponent } from './pages/nav-bar/nav-bar.component';
import { SideBarComponent } from './components/side-bar/side-bar.component';
import { HeaderComponent } from './components/header/header.component';
import { BuscarComponent } from './components/buscar/buscar.component';
import { PageBuscaComponent } from './pages/page-busca/page-busca.component';
import { CriarContaComponent } from './components/criar-conta/criar-conta.component';
import { EsqueceuSenhaComponent } from './components/esqueceu-senha/esqueceu-senha.component';
import { PageEsqueceuSenhaComponent } from './pages/page-esqueceu-senha/page-esqueceu-senha.component';
import { PageCriarContaComponent } from './pages/page-criar-conta/page-criar-conta.component';
import { HighSearchComponent } from './components/high-search/high-search.component';
import { InputBuscaComponent } from './components/input-busca/input-busca.component';
import { RelatorioModalComponent } from './components/relatorio-modal/relatorio-modal.component';
import { MensoesComponent } from './mensoes/mensoes.component';
import { ScrollTopComponent } from './components/scroll-top/scroll-top.component';
import { ModalAccountComponent } from './components/modal-account/modal-account.component';
import { TagFilterComponent } from './components/tag-filter/tag-filter.component';
import { VeiculosComponent } from './components/veiculos/veiculos.component';
import { ResultComponent } from './pages/result/result.component';
import { FiltrosComponent } from './components/filtros/filtros.component';
import { SearcBasicComponent } from './components/searc-basic/searc-basic.component';
import { SaveSearchComponent } from './components/save-search/save-search.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { LocalizacaoComponent } from './components/localizacao/localizacao.component';
import { BotaoxComponent } from './components/botaox/botaox.component';
import { SearchbasicmobileComponent } from './components/searchbasicmobile/searchbasicmobile.component';
import { BackButtonComponent } from './components/back-button/back-button.component';
import { PageMentionDetailComponent } from './pages/page-mention-detail/page-mention-detail.component';
import { EditMetionButtonComponent } from './components/edit-metion-button/edit-metion-button.component';
import { ShareButtonComponent } from './components/share-button/share-button.component';
import { HeaderMentionDetailsComponent } from './components/header-mention-details/header-mention-details.component';
import { PlayerComponent } from './components/player/player.component';
import { ViewEntidadesSearchComponent } from './components/view-entidades-search/view-entidades-search.component';
import { ResultSavedSearchComponent } from './pages/result-saved-search/result-saved-search.component';
import { FiltrosSavedSearchComponent } from './components/filtros-saved-search/filtros-saved-search.component';
import { SearchSavedSearchComponent } from './components/search-saved-search/search-saved-search.component';
import { MonitorCardComponent } from './components/monitor-card/monitor-card.component';
import { SimpleInputSearchComponent } from './components/simple-input-search/simple-input-search.component';
import { HeaderSavedSearchComponent } from './components/header-saved-search/header-saved-search.component';
import { PageSavedSearchComponent } from './pages/page-saved-search/page-saved-search.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PageLoginComponent,
    CardComponent,
    NavBarComponent,
    SideBarComponent,
    HeaderComponent,
    BuscarComponent,
    PageBuscaComponent,
    CriarContaComponent,
    EsqueceuSenhaComponent,
    PageEsqueceuSenhaComponent,
    PageCriarContaComponent,
    HighSearchComponent,
    InputBuscaComponent,
    RelatorioModalComponent,
    MensoesComponent,
    ScrollTopComponent,
    ModalAccountComponent,
    TagFilterComponent,
    VeiculosComponent,
    ResultComponent,
    FiltrosComponent,
    SearcBasicComponent,
    SaveSearchComponent,
    CalendarComponent,
    LocalizacaoComponent,
    BotaoxComponent,
    SearchbasicmobileComponent,
    BackButtonComponent,
    PageMentionDetailComponent,
    EditMetionButtonComponent,
    ShareButtonComponent,
  HeaderMentionDetailsComponent,
  PlayerComponent,
  ViewEntidadesSearchComponent,
  ResultSavedSearchComponent,
  FiltrosSavedSearchComponent,
  SearchSavedSearchComponent,
  MonitorCardComponent, 
  SimpleInputSearchComponent,
  HeaderSavedSearchComponent,
  PageSavedSearchComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule, // ✅ IMPORTANTE PARA AS ROTAS FUNCIONAREM
    FormsModule,
    ReactiveFormsModule
    
  ],
  providers: [provideHttpClient(withInterceptorsFromDi())],
  bootstrap: [AppComponent] // ✅ GARANTA QUE ESTÁ CORRETO
})
export class AppModule { }
