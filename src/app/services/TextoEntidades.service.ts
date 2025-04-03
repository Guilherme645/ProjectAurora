import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TextoEntidadesService {
  private textoOriginal: string = `
    O lançamento de "Vingadores: Doomsday", previsto para o dia 25 de dezembro de 2025, tem gerado uma enorme expectativa em fãs de todo o mundo. O filme promete ser um marco na história dos filmes de super-heróis, reunindo os maiores heróis do Universo Cinematográfico Marvel (MCU) em uma batalha épica contra uma ameaça jamais vista.
    
    Dirigido por John Doe, o filme traz de volta os protagonistas icônicos, incluindo Tony Stark (Robert Downey Jr.), Capitão América (Chris Evans), Thor (Chris Hemsworth) e Natasha Romanoff (Scarlett Johansson). Além disso, o filme apresenta novos heróis como a Capitã Marvel (Brie Larson) e o misterioso personagem introduzido por Richard Green, que está sendo mantido em segredo até o lançamento.
    
    A história de "Vingadores: Doomsday" começa com a descoberta de uma antiga ameaça que estava oculta no universo há séculos. Os heróis são chamados à ação pela SHIELD (Strategic Homeland Intervention, Enforcement and Logistics Division), liderada por Nick Fury (Samuel L. Jackson), para impedir que essa ameaça destrua a Terra. No entanto, a chegada de novos vilões, como o terrível Ultron (James Spader), que retorna com uma versão ainda mais poderosa, complica ainda mais a missão.
    
    O filme também introduz uma nova organização secreta, conhecida como "Os Guardiões do Multiverso", que está manipulando os eventos nos bastidores. Os Guardiões são liderados pelo enigmático líder, conhecido apenas como "Vortex", que será interpretado por Liam Neeson. Essa organização está tentando abrir um portal para uma realidade paralela onde os Vingadores serão derrotados, o que ameaça a estabilidade do multiverso.
    
    O grande vilão de "Vingadores: Doomsday" é um ser cósmico chamado "Doomsday", cuja presença foi anunciada ao longo dos filmes da Marvel como uma ameaça iminente. Interpretado por Dwayne "The Rock" Johnson, Doomsday é uma entidade com poder quase ilimitado, capaz de destruir planetas inteiros com um único golpe. Sua verdadeira motivação será revelada nas cenas finais do filme, deixando os fãs com um cliffhanger que promete gerar muito mais tensão no universo Marvel.
    
    A batalha final, que ocorre na cidade de Nova York, contará com uma impressionante coreografia de cenas de ação, incluindo um confronto épico entre os heróis e Doomsday, que será filmado em uma combinação de CGI e efeitos práticos de tirar o fôlego. A luta será uma das mais intensas já vistas nos cinemas, com os Vingadores unidos contra um inimigo que desafia todas as suas habilidades.
    
    A produção do filme foi marcada por um intenso trabalho de efeitos especiais, com o auxílio de empresas como a Industrial Light & Magic (ILM) e a Weta Digital, que trabalharam em estreita colaboração para criar os impressionantes efeitos visuais. As filmagens aconteceram em várias locações ao redor do mundo, incluindo Nova York, Los Angeles, Londres e Paris.
    
    O filme será lançado em cinemas 3D e IMAX, e os fãs poderão ver as cenas mais épicas com uma experiência imersiva nunca antes vista. O diretor John Doe afirmou em entrevista que "Vingadores: Doomsday" é um filme que não é apenas sobre grandes batalhas, mas também sobre os conflitos internos dos heróis, suas escolhas e o impacto que suas ações têm no mundo.
    
    "Vingadores: Doomsday" é um filme que marca o fim de uma era para o MCU e o início de uma nova fase, onde novos heróis e vilões irão se destacar. O filme será um divisor de águas para a Marvel e para o cinema como um todo, deixando os fãs ansiosos por mais aventuras no multiverso. O filme será lançado mundialmente no dia 25 de dezembro de 2025, e os ingressos já estão à venda em vários sites e cinemas parceiros.
    
    Com o lançamento de "Vingadores: Doomsday", a Marvel está prestes a atingir novas alturas, e com certeza este será um dos filmes mais assistidos e comentados do ano.
  `;

  private entidades = {
    pessoas: [
      "John Doe", "Robert Downey Jr.", "Chris Evans", "Chris Hemsworth", "Scarlett Johansson", "Brie Larson", "Richard Green", 
      "Samuel L. Jackson", "James Spader", "Liam Neeson", "Dwayne 'The Rock' Johnson"
    ],
    lugares: ["Nova York", "Los Angeles", "Londres", "Paris"],
    organizacoes: ["SHIELD", "Os Guardiões do Multiverso", "Marvel Studios", "Industrial Light & Magic", "Weta Digital"],
    datas: ["25/12/2025"]
  };

  getTextoOriginal(): string {
    return this.textoOriginal;
  }

  getEntidades(): { pessoas: string[], lugares: string[], organizacoes: string[], datas: string[] } {
    return { ...this.entidades };
  }

  substituirEntidades(opcoes: { pessoas?: boolean, lugares?: boolean, organizacoes?: boolean, datas?: boolean }): string {
    let textoMarcado = this.textoOriginal;
    const escaparRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    if (opcoes.pessoas) {
      this.entidades.pessoas.forEach(pessoa => {
        const regex = new RegExp(escaparRegex(pessoa), 'g');
        textoMarcado = textoMarcado.replace(regex, `<span class="entity-person">${pessoa}</span>`);
      });
    }
    if (opcoes.lugares) {
      this.entidades.lugares.forEach(lugar => {
        const regex = new RegExp(escaparRegex(lugar), 'g');
        textoMarcado = textoMarcado.replace(regex, `<span class="entity-location">${lugar}</span>`);
      });
    }
    if (opcoes.organizacoes) {
      this.entidades.organizacoes.forEach(org => {
        const regex = new RegExp(escaparRegex(org), 'g');
        textoMarcado = textoMarcado.replace(regex, `<span class="entity-organization">${org}</span>`);
      });
    }
    if (opcoes.datas) {
      this.entidades.datas.forEach(data => {
        const regex = new RegExp(escaparRegex(data), 'g');
        textoMarcado = textoMarcado.replace(regex, `<span class="entity-date">${data}</span>`);
      });
    }

    // Adicionando cores de fundo e texto para cada tipo de entidade
    textoMarcado = textoMarcado.replace(/<span class="entity-person">(.+?)<\/span>/g, 
      '<span style="background-color: #bbdefb; color: #0d47a1; font-weight: bold; padding: 0 5px; border-radius: 4px;">$1</span>');
      
    textoMarcado = textoMarcado.replace(/<span class="entity-location">(.+?)<\/span>/g, 
      '<span style="background-color: #c8e6c9; color: #388e3c; font-weight: bold; padding: 0 5px; border-radius: 4px;">$1</span>');
      
    textoMarcado = textoMarcado.replace(/<span class="entity-organization">(.+?)<\/span>/g, 
      '<span style="background-color: #ffccbc; color: #c62828; font-weight: bold; padding: 0 5px; border-radius: 4px;">$1</span>');
      
    textoMarcado = textoMarcado.replace(/<span class="entity-date">(.+?)<\/span>/g, 
      '<span style="background-color: #fff9c4; color: #f57f17; font-weight: bold; padding: 0 5px; border-radius: 4px;">$1</span>');

    return textoMarcado;
  }
}
