import {
  Component,
  ElementRef,
  AfterViewInit,
  ViewChild,
  OnDestroy,
  HostListener
} from '@angular/core';

import Globe, { GlobeInstance } from 'globe.gl';
import * as THREE from 'three';
import maplibregl, { Map as MapLibreMap, Marker } from 'maplibre-gl';
import Supercluster from 'supercluster';

type RadioPoint = { id: number; lat: number; lng: number; size: number; color: string; label: string; rangeKm: number; };
type PinPoint = { id: number; lat: number; lng: number; rangeM: number; };
@Component({
  selector: 'app-globe',
  standalone: false,
  templateUrl: './globe.component.html',
  styleUrls: ['./globe.component.css']
})
export class GlobeComponent implements AfterViewInit, OnDestroy {
  @ViewChild('globeContainer') globeContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('mapContainer') mapContainer!: ElementRef<HTMLDivElement>;

  public world!: GlobeInstance;
  private map?: MapLibreMap;
  public isMapMode = false;

  private ro?: ResizeObserver;
  private mapMarkers: Marker[] = [];
  private selectedRadio: RadioPoint | null = null;
  public isFullscreen = false;
  private pinMaterial?: THREE.SpriteMaterial;

  private isSyncingFromGlobe = false;
  private isSyncingFromMap = false;
  private mapFocusLockUntil = 0;

  private readonly ENTER_MAP_ALT = 0.95;
  private readonly EXIT_MAP_ZOOM = 4.6;
  private readonly MAP_FOCUS_ZOOM = 9.5;

  // As 4 grandes rádios que NUNCA somem
  private data: RadioPoint[] = [
    { id: 0, lat: -15.7942, lng: -47.8822, size: 12, color: '#ff4d4d', label: 'Rádio Itatiaia', rangeKm: 220 },
    { id: 1, lat: -23.5505, lng: -46.6333, size: 18, color: '#22c55e', label: 'BandNews FM', rangeKm: 320 },
    { id: 2, lat: -22.9068, lng: -43.1729, size: 10, color: '#3b82f6', label: 'Jovem Pan', rangeKm: 180 },
    { id: 3, lat: -30.0346, lng: -51.2177, size: 15, color: '#a855f7', label: 'Rádio Gaúcha', rangeKm: 260 }
  ];

  private pins: PinPoint[] = []; // Pontos sendo exibidos agora
  private allPins: PinPoint[] = []; // Backup de todos os 2000 pontos
  private coverageGroup?: THREE.Group;

  private onControlsChange = () => {
    if (!this.world || this.isMapMode || this.isSyncingFromMap) return;
    this.updateGlobeClusters();
    const pov = this.world.pointOfView();
    if ((pov?.altitude ?? 2) < this.ENTER_MAP_ALT) {
      if (!this.selectedRadio) this.selectedRadio = this.getNearestRadio(pov?.lat ?? -15, pov?.lng ?? -50);
      this.setMapMode(true, { focusSelected: true });
    }
  };

  async ngAfterViewInit() {
    this.initGlobe();
    this.initMap();

    this.allPins = await this.loadPinsFromCsv('assets/brasil_2000_lat_lon_com_alcance.csv');

    // Ao invés de carregar o supercluster ou pinos individuais no globo, 
    // nós apenas desenhamos as 5 bolhas regionais iniciais.
    this.renderGlobeRegionalBubbles(); 

    this.ro = new ResizeObserver(() => this.resizeAll());
    this.ro.observe(this.globeContainer.nativeElement);
  }

  public applyRegionFilter(region: string) {
    if (region === 'all') {
      this.setMapMode(false);
      this.world.pointOfView({ lat: -15, lng: -50, altitude: 2.2 }, 800);
      
      // Volta a mostrar as 5 bolhas regionais
      this.renderGlobeRegionalBubbles(); 
      
    } else {
      // Usa o nosso helper novo para filtrar os pinos da região pro mapa 2D
      this.pins = this.allPins.filter(p => this.getRegionForPin(p.lat, p.lng) === region);

      const bounds = this.getRegionCenter(region);

      // Limpa as bolhas do globo para o voo ficar limpo
      this.world.objectsData([]); 

      this.world.pointOfView({ lat: bounds.lat, lng: bounds.lng, altitude: 0.8 }, 800);

      setTimeout(() => {
        this.setMapMode(true);
        if (this.map) {
          this.installMapPinsLayer(); 
          const geojson = this.pinsToGeoJSON(this.pins);
          if (this.map.getSource('pins-src')) {
            (this.map.getSource('pins-src') as any).setData(geojson);
          }
          this.map.flyTo({ center: [bounds.lng, bounds.lat], zoom: 5.5, essential: true });
        }
      }, 850);
    }
  }

  ngOnDestroy(): void {
    try { this.world?.controls()?.removeEventListener('change', this.onControlsChange); } catch {}
    try { this.ro?.disconnect(); } catch {}
    try { this.mapMarkers.forEach(m => m.remove()); } catch {}
    this.mapMarkers = [];
    try { this.map?.remove(); } catch {}
    try { if (this.coverageGroup && this.world?.scene()) this.world.scene().remove(this.coverageGroup); } catch {}
  }

 

  private getRegionCenter(region: string): { lat: number, lng: number } {
    switch(region) {
      case 'sudeste': return { lat: -21.0, lng: -45.0 };
      case 'sul': return { lat: -27.0, lng: -51.0 };
      case 'nordeste': return { lat: -10.0, lng: -40.0 };
      case 'norte': return { lat: -4.0, lng: -60.0 };
      case 'centro-oeste': return { lat: -15.0, lng: -55.0 };
      default: return { lat: -15.0, lng: -50.0 };
    }
  }

  // ---------------------------
  // GLOBO 3D
  // ---------------------------
  private initGlobe() {
    const el = this.globeContainer.nativeElement;
    this.world = new (Globe as any)(el)
      .backgroundColor('rgba(0,0,0,0)')
      .showAtmosphere(true)
      .atmosphereColor('#80d4f6')
      .atmosphereAltitude(0.15)
     

    const canvas = document.createElement('canvas');
    canvas.width = 1024; canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#5eb8ff'); gradient.addColorStop(1, '#00f5d4');
      ctx.fillStyle = gradient; ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    this.world.globeMaterial(new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(canvas) }));

    fetch('https://raw.githubusercontent.com/vasturiano/globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
      .then(res => res.json())
      .then(countries => {
        this.world.polygonsData(countries.features)
          .polygonCapColor(() => '#d0fcf4').polygonSideColor(() => 'rgba(0,0,0,0)').polygonStrokeColor(() => '#bdf2e8');
      });

    this.world.controls().autoRotate = false;
    this.world.controls().enableZoom = true;
    this.world.controls().enableRotate = false;
    this.world.controls().enablePan = false;
    this.world.pointOfView({ lat: -15, lng: -50, altitude: 2.2 });
    this.addClouds();
    this.installGlobeCoverageAreas();
    this.world.controls().addEventListener('change', this.onControlsChange);
  }

  private onRadioClickedById(id: number) {
    const r = this.data.find(x => x.id === id);
    if (!r) return;
    this.selectedRadio = r;
    this.world.pointOfView({ lat: r.lat, lng: r.lng, altitude: 0.9 }, 650);
    setTimeout(() => { this.setMapMode(true, { focusSelected: true }); }, 520);
  }

  private addClouds() { /* Mantido original */ }
  private installGlobeCoverageAreas() { /* Mantido original */ }

  // ✅ CORREÇÃO "TEMPESTADE ROXA": Tamanho 3D fixo em scale 2.5
  private async installGlobePins() {
    if (!this.world) return;

    if (!this.pinMaterial) {
      const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r="28" fill="#a855f7" stroke="white" stroke-width="4"/>
        <g transform="translate(16, 16) scale(1.33)" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z"></path><path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
        </g>
      </svg>`.trim();

      const texture = await new THREE.TextureLoader().loadAsync('data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg));
      this.pinMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false });
    }

    this.world
      .objectsData(this.pins) // Se for "all", passa array vazio e limpa a tela
      .objectLat((d: any) => d.lat)
      .objectLng((d: any) => d.lng)
      .objectAltitude(0.01)
      .objectThreeObject(() => {
        const sprite = new THREE.Sprite(this.pinMaterial);
        sprite.scale.set(2.5, 2.5, 1); // 👈 Tchau, tempestade roxa!
        return sprite;
      });
  }

  // ---------------------------
  // MAPA 2D E CLUSTERIZAÇÃO
  // ---------------------------
  private initMap() {
    const rasterStyle: any = {
      version: 8,
      glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
      sources: {
        'osm-raster': {
          type: 'raster',
          tiles: [
            'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
            'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
            'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
          ],
          tileSize: 256, attribution: '© OpenStreetMap contributors'
        }
      },
      layers: [{ id: 'osm', type: 'raster', source: 'osm-raster' }]
    };

    this.map = new maplibregl.Map({
      container: this.mapContainer.nativeElement,
      style: rasterStyle, center: [-50, -15], zoom: 3, attributionControl: false
    });

    this.map.on('load', () => {
      this.installMapMarkers();
      this.installMapStaticCoverageLayers();
      this.installMapPinsLayer();
    });

    this.map.on('zoomend', () => {
      if (this.isMapMode && this.map!.getZoom() <= this.EXIT_MAP_ZOOM) this.setMapMode(false);
    });
    this.map.on('move', () => { if (this.isMapMode) this.syncGlobeToMap(); });
    this.map.on('zoom', () => { if (this.isMapMode) this.syncGlobeToMap(); });
  }

  private installMapMarkers() { /* Mantido original (os 4 hubs) */ }
  private installMapStaticCoverageLayers() { /* Mantido original */ }

  // ✅ CLUSTERIZAÇÃO CORRIGIDA DO MAPLIBRE
 // ✅ CLUSTERIZAÇÃO E RAIOS CORRIGIDOS DO MAPLIBRE
  private async installMapPinsLayer() {
    if (!this.map || !this.map.loaded()) return;

    await this.ensureRadioIconOnMap();
    const geojson = this.pinsToGeoJSON(this.pins);

    if (this.map.getSource('pins-src')) {
      (this.map.getSource('pins-src') as any).setData(geojson);
    } else {
      this.map.addSource('pins-src', { 
        type: 'geojson', 
        data: geojson,
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50 
      });
    }

    // 1. Camada das Bolhas de Agrupamento (Clusters)
    if (!this.map.getLayer('clusters')) {
      this.map.addLayer({
        id: 'clusters', type: 'circle', source: 'pins-src', filter: ['has', 'point_count'],
        paint: {
          'circle-color': ['step', ['get', 'point_count'], '#a855f7', 100, '#8b5cf6', 500, '#6d28d9'],
          'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 500, 40],
          'circle-stroke-width': 3, 'circle-stroke-color': '#ffffff'
        }
      });
    }

    // 2. Número dentro da Bolha
    if (!this.map.getLayer('cluster-count')) {
      this.map.addLayer({
        id: 'cluster-count', type: 'symbol', source: 'pins-src', filter: ['has', 'point_count'],
        layout: { 'text-field': '{point_count_abbreviated}', 'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'], 'text-size': 14 },
        paint: { 'text-color': '#ffffff' }
      });
    }

    // 🟢 3. NOVA CAMADA: O Raio de Alcance da Rádio (Translúcido)
    // Desenhamos isso ANTES do ícone para ficar no fundo
    if (!this.map.getLayer('pins-radius')) {
      this.map.addLayer({
        id: 'pins-radius',
        type: 'circle',
        source: 'pins-src',
        filter: ['!', ['has', 'point_count']], // Só desenha quando não é cluster
        paint: {
          // O raio aumenta conforme você dá zoom no mapa para simular uma área física real
          'circle-radius': [
            'interpolate', ['linear'], ['zoom'],
            5, 10,   // No zoom 5, raio de 10px
            10, 40,  // No zoom 10, raio de 40px
            15, 150  // No zoom 15 (bem perto), raio gigante de 150px
          ],
          'circle-color': '#a855f7',
          'circle-opacity': 0.15, // Bem transparente
          'circle-stroke-width': 2,
          'circle-stroke-color': '#a855f7',
          'circle-stroke-opacity': 0.5
        }
      });
    }

    // 🟢 4. Camada do Ícone Individual de Fone de Ouvido
    if (!this.map.getLayer('pins-icons')) {
      this.map.addLayer({
        id: 'pins-icons', type: 'symbol', source: 'pins-src', filter: ['!', ['has', 'point_count']],
        layout: { 
          'icon-image': 'radio-pin', 
          'icon-allow-overlap': true, 
          'icon-anchor': 'center', 
          'icon-size': 0.9 // 🟢 AUMENTADO DE 0.5 para 0.9 (Quase o dobro do tamanho)
        }
      });
    }

    this.map.off('click', 'clusters', this.onClusterClick as any);
    this.map.off('click', 'pins-icons', this.onPinsIconClick as any);
    this.map.on('click', 'clusters', this.onClusterClick as any);
    this.map.on('click', 'pins-icons', this.onPinsIconClick as any);
    
    this.map.on('mouseenter', 'clusters', () => this.map!.getCanvas().style.cursor = 'pointer');
    this.map.on('mouseleave', 'clusters', () => this.map!.getCanvas().style.cursor = '');
  }

  // CORREÇÃO DO ASYNC AWAIT NO CLIQUE DO CLUSTER
  private onClusterClick = async (e: maplibregl.MapMouseEvent) => {
    if (!this.map) return;
    const features = this.map.queryRenderedFeatures(e.point, { layers: ['clusters'] });
    const clusterId = features[0].properties['cluster_id'];
    const source = this.map.getSource('pins-src') as maplibregl.GeoJSONSource;
    
    try {
      const zoom = await source.getClusterExpansionZoom(clusterId);
      this.map.easeTo({
        center: (features[0].geometry as any).coordinates as [number, number],
        zoom: zoom
      });
    } catch (err) { console.warn('Erro cluster', err); }
  };

  private onPinsIconClick = (e: maplibregl.MapMouseEvent) => { /* Mantido original */ };

  // ---------------------------
  // HELPERS E MODO + SYNC
  // ---------------------------
  private setMapMode(on: boolean, opts?: { focusSelected?: boolean }) {
    if (on === this.isMapMode) return;
    this.isMapMode = on;
    
    // 🟢 ENTRANDO NO MAPA 2D
    if (on) {
      this.mapFocusLockUntil = Date.now() + 900;
      requestAnimationFrame(() => this.map?.resize());
      setTimeout(() => this.map?.resize(), 250);
      this.world.controls().enableRotate = false; 
      this.world.controls().enablePan = false; 
      this.world.controls().enableZoom = true;
      if (opts?.focusSelected) setTimeout(() => this.focusSelectedRadio(true), 70);
      return;
    }

    // 🔴 SAINDO DO MAPA 2D (ZOOM OUT) E VOLTANDO PARA O GLOBO
    this.world.controls().enableRotate = false; 
    this.world.controls().enablePan = false; 
    this.world.controls().enableZoom = true;
    
    // 1. Força a câmera voar de volta para o centro do Brasil com altitude global
    this.world.pointOfView({ lat: -15, lng: -50, altitude: 2.2 }, 800);
    
    // 2. Redesenha as 5 bolhas gigantes regionais
    this.renderGlobeRegionalBubbles();
    
    // 3. Restaura os pinos na memória para garantir que não fique travado em uma região
    this.pins = this.allPins;
  }
  private focusSelectedRadio(animate: boolean) { /* Mantido original */ }
  private syncGlobeToMap() { /* Mantido original */ }
  private mapZoomToAltitude(z: number): number { return Math.min(3, Math.max(0.07, Math.pow(2, (12 - z) / 2.2))); }
  
  private async loadPinsFromCsv(url: string): Promise<PinPoint[]> {
  const res = await fetch(url);
  const text = await res.text();
  const lines = text.split(/\r?\n/).filter(l => l.trim().length);

  if (lines.length <= 1) return [];

  const header = lines[0].split(',').map(s => s.trim().toLowerCase());
  const hasHeader = header.includes('latitude') || header.includes('lat');

  const idx = (nameCandidates: string[]) => {
    const i = header.findIndex(h => nameCandidates.includes(h));
    return i >= 0 ? i : -1;
  };

  let idI = 0, latI = 1, lngI = 2, rangeI = -1;

  if (hasHeader) {
    idI = idx(['id']);
    latI = idx(['lat', 'latitude']);
    lngI = idx(['lng', 'lon', 'longitude']);
    rangeI = idx(['alcance_m', 'range_m', 'range', 'range_meters', 'rangem']);
  }

  const dataLines = hasHeader ? lines.slice(1) : lines;
  const pts: PinPoint[] = [];

  for (const line of dataLines) {
    const parts = line.split(',').map(s => s.trim());
    if (parts.length < 3) continue;

    const id = Number(parts[idI] ?? parts[0]);
    const lat = Number(parts[latI] ?? parts[1]);
    const lng = Number(parts[lngI] ?? parts[2]);

    // se não tiver coluna, usa default 800m
    const rangeM = rangeI >= 0 ? Number(parts[rangeI]) : 800;

    if (
      Number.isFinite(id) &&
      Number.isFinite(lat) &&
      Number.isFinite(lng) &&
      Number.isFinite(rangeM)
    ) {
      pts.push({ id, lat, lng, rangeM });
    }
  }

  return pts;
}
 private pinsToGeoJSON(points: PinPoint[]): GeoJSON.FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: points.map(p => ({
      type: 'Feature',
      properties: { id: p.id, rangeM: p.rangeM },
      geometry: { type: 'Point', coordinates: [p.lng, p.lat] }
    }))
  };
}


  private getNearestRadio(lat: number, lng: number): RadioPoint { return this.data[0]; } // Simplificado
  private resizeAll() { try { this.world.width(this.globeContainer.nativeElement.clientWidth || 600); this.world.height(this.globeContainer.nativeElement.clientHeight || 500); this.map?.resize(); } catch {} }
  private escapeHtml(s: string) { return (s || '').replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m] as string)); }
  private latLngToVector3(lat: number, lng: number, radius: number) { const phi = (90 - lat) * (Math.PI / 180); const theta = (lng + 180) * (Math.PI / 180); return new THREE.Vector3(-radius * Math.sin(phi) * Math.cos(theta), radius * Math.cos(phi), radius * Math.sin(phi) * Math.sin(theta)); }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent) { if (event.key === 'Escape' && this.isFullscreen) this.toggleFullscreen(); }
  toggleFullscreen() { this.isFullscreen = !this.isFullscreen; setTimeout(() => this.resizeAll(), 100); }

  private async ensureRadioIconOnMap() {
    if (!this.map || this.map.hasImage('radio-pin')) return;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><circle cx="32" cy="32" r="28" fill="#a855f7" stroke="white" stroke-width="4"/><g transform="translate(16, 16) scale(1.33)" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z"></path><path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></g></svg>`.trim();
    const img = new Image(); img.crossOrigin = 'anonymous'; img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    await new Promise<void>((resolve) => { img.onload = () => resolve(); });
    this.map.addImage('radio-pin', img, { pixelRatio: 2 });
  }
 private clusterIndex = new Supercluster({
    radius: 120, // 👈 Aumentado para "sugar" a região inteira em uma bolha só
    maxZoom: 14
  });
private updateGlobeClusters() {
  if (!this.world || !this.pinMaterial) return;

  // Usa os pontos atuais (se estiver vazio, usa todos para mostrar a bolha do Brasil inteiro)
  const pointsToCluster = this.pins.length > 0 ? this.pins : this.allPins;

  // Alimenta o cluster com os pontos corretos da região (ou do Brasil todo)
  this.clusterIndex.load(pointsToCluster.map(p => ({
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [p.lng, p.lat] },
    properties: { id: p.id }
  })));

  const pov = this.world.pointOfView();
  const zoom = Math.floor(this.altitudeToZoom(pov.altitude));
  
  // Pega os agrupamentos (bolhas) para o zoom atual
  const clusters = this.clusterIndex.getClusters([-180, -90, 180, 90], zoom);

  this.world
    .objectsData(clusters)
    // 👇 A MÁGICA QUE FALTAVA: Dizer ao globo onde posicionar as bolhas!
    .objectLat((d: any) => d.geometry.coordinates[1])
    .objectLng((d: any) => d.geometry.coordinates[0])
    .objectAltitude(0.01)
    .objectThreeObject((d: any) => {
      const isCluster = d.properties?.cluster;
      
      if (isCluster) {
        // Renderiza a bolha com o número
        return this.createClusterSprite(d.properties.point_count);
      } else {
        // Renderiza o ícone de fone individual
        const sprite = new THREE.Sprite(this.pinMaterial);
        sprite.scale.set(2.5, 2.5, 1);
        return sprite;
      }
    });
}
private async initPinMaterial() {
  if (!this.pinMaterial) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><circle cx="32" cy="32" r="28" fill="#a855f7" stroke="white" stroke-width="4"/><g transform="translate(16, 16) scale(1.33)" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z"></path><path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></g></svg>`.trim();
    const texture = await new THREE.TextureLoader().loadAsync('data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg));
    this.pinMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false });
  }
}
private createClusterSprite(count: number): THREE.Sprite {
    const size = 256; // 🟢 Aumentado de 128 para 256 para o texto ficar bem nítido
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext('2d');

    if (context) {
      let color = '#a855f7'; 
      let radius = 70; // 🟢 Raio base aumentado (era 35)
      
      if (count >= 500) { 
        color = '#6d28d9'; 
        radius = 110; // 🟢 Raio gigante (era 55)
      } else if (count >= 100) { 
        color = '#8b5cf6'; 
        radius = 90;  // 🟢 Raio médio (era 45)
      }

      const centerX = size / 2;
      const centerY = size / 2;

      // Desenha o círculo
      context.beginPath();
      context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
      context.fillStyle = color;
      context.fill();
      context.lineWidth = 6; // 🟢 Borda mais grossa
      context.strokeStyle = '#ffffff'; 
      context.stroke();

      // Desenha o número
      context.font = 'bold 60px Arial'; // 🟢 Fonte quase o dobro do tamanho
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillStyle = '#ffffff';
      context.fillText(count.toString(), centerX, centerY + 4); 
    }

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ 
      map: texture, 
      transparent: true, 
      depthWrite: false 
    });
    const sprite = new THREE.Sprite(material);

    // 🟢 Ajuste a escala final no globo de 4.5 para 8.5
    sprite.scale.set(17.0, 17.0, 1);

    return sprite;
  }

// Helper para converter altitude em zoom
// Helper para converter altitude em zoom
  private altitudeToZoom(alt: number): number {
    // Força zooms baixos no globo para garantir as bolhas gigantes regionais
    if (alt > 1.8) return 2; // Visão global: Agrupa em pouquíssimas bolhas
    if (alt > 1.2) return 3; // Visão média: Separa por macro-regiões (Sul, Sudeste)
    return 4; // Perto: Divide um pouco mais antes de virar 2D
  }
  // Descobre a região de um ponto baseado nas suas coordenadas
  private getRegionForPin(lat: number, lng: number): string | null {
    if (lat <= -14 && lat >= -25 && lng >= -53 && lng <= -39) return 'sudeste';
    if (lat <= -22 && lng <= -48) return 'sul';
    if (lat >= -18 && lat <= -1 && lng >= -48 && lng <= -34) return 'nordeste';
    if (lat >= -13 && lng <= -44) return 'norte';
    if (lat <= -9 && lat >= -24 && lng <= -50 && lng >= -65) return 'centro-oeste';
    return null;
  }

  // Gera a lista das 5 bolhas gigantes
  private getRegionalBubbles() {
    const counts: Record<string, number> = {
      'sudeste': 0, 'sul': 0, 'nordeste': 0, 'norte': 0, 'centro-oeste': 0
    };

    // Conta quantas rádios tem em cada região
    this.allPins.forEach(p => {
      const reg = this.getRegionForPin(p.lat, p.lng);
      if (reg && counts[reg] !== undefined) counts[reg]++;
    });

    const bubbles = [];
    for (const [region, count] of Object.entries(counts)) {
      if (count > 0) {
        const center = this.getRegionCenter(region);
        bubbles.push({
          isRegionalBubble: true, // Identificador para o clique
          region: region,
          lat: center.lat,
          lng: center.lng,
          count: count
        });
      }
    }
    return bubbles;
  }
  private renderGlobeRegionalBubbles() {
    if (!this.world) return;

    const regionalData = this.getRegionalBubbles();

    this.world
      .objectsData(regionalData)
      .objectLat((d: any) => d.lat)
      .objectLng((d: any) => d.lng)
      // 🟢 O SEGREDO ESTÁ AQUI: Aumentamos a altitude de 0.01 para 0.08
      // Isso faz a bolha flutuar acima da superfície e não ser cortada pela terra!
      .objectAltitude(0.10) 
      .objectThreeObject((d: any) => {
        return this.createClusterSprite(d.count);
      });

    this.world.onObjectClick((obj: any) => {
      if (obj.isRegionalBubble) {
        this.applyRegionFilter(obj.region);
      }
    });
  }
}