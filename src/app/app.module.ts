import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RouterOutlet } from '@angular/router';
import { PageLoginComponent } from './pages/page-login/page-login.component';
import { CardComponent } from './components/card/card.component';
import { NavBarComponent } from './pages/nav-bar/nav-bar.component';
import { HttpClientModule } from '@angular/common/http';
import { SideBarComponent } from './components/side-bar/side-bar.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BuscarComponent } from './components/buscar/buscar.component';
import { PageBuscaComponent } from './pages/page-busca/page-busca.component';
import { CriarContaComponent } from './components/criar-conta/criar-conta.component';
import { EsqueceuSenhaComponent } from './components/esqueceu-senha/esqueceu-senha.component';
import { HeaderComponent } from './components/header/header.component';
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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterOutlet,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule


  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
