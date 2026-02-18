import { Component, ElementRef, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import Globe, { GlobeInstance } from 'globe.gl';
import * as THREE from 'three';
import maplibregl, { Map as MapLibreMap, Marker } from 'maplibre-gl';

type RadioPoint = {
  id: number;          // ✅ ID fixo (resolve o bug do clique)
  lat: number;
  lng: number;
  size: number;
  color: string;
  label: string;
  rangeKm: number;     // alcance (visual)
};

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

  // ✅ trava de sync
  private isSyncingFromGlobe = false;
  private isSyncingFromMap = false;
  private mapFocusLockUntil = 0;

  // ✅ entra no MAP quando aproximar no globo
  private readonly ENTER_MAP_ALT = 0.95;

  // ✅ sai do MAP quando der zoom out no MAP
  private readonly EXIT_MAP_ZOOM = 4.6;

  private readonly MAP_FOCUS_ZOOM = 9.5;

  private data: RadioPoint[] = [
    { id: 0, lat: -15.7942, lng: -47.8822, size: 12, color: '#ff4d4d', label: 'Rádio Itatiaia', rangeKm: 220 },
    { id: 1, lat: -23.5505, lng: -46.6333, size: 18, color: '#22c55e', label: 'BandNews FM', rangeKm: 320 },
    { id: 2, lat: -22.9068, lng: -43.1729, size: 10, color: '#3b82f6', label: 'Jovem Pan', rangeKm: 180 },
    { id: 3, lat: -30.0346, lng: -51.2177, size: 15, color: '#a855f7', label: 'Rádio Gaúcha', rangeKm: 260 }
  ];

  // --------
  // GLOBE coverage meshes
  // --------
  private coverageGroup?: THREE.Group;

  // ✅ no map mode NÃO usa onControlsChange pra “sair”
  private onControlsChange = () => {
    if (!this.world) return;
    if (this.isMapMode) return;
    if (this.isSyncingFromMap) return;

    const pov = this.world.pointOfView();
    const alt = pov?.altitude ?? 2;

    if (alt < this.ENTER_MAP_ALT) {
      if (!this.selectedRadio) {
        this.selectedRadio = this.getNearestRadio(pov?.lat ?? -15, pov?.lng ?? -50);
      }
      this.setMapMode(true, { focusSelected: true });
    }
  };

  ngAfterViewInit() {
    this.initGlobe();
    this.initMap();

    this.ro = new ResizeObserver(() => this.resizeAll());
    this.ro.observe(this.globeContainer.nativeElement);
  }

  ngOnDestroy(): void {
    try { this.world?.controls()?.removeEventListener('change', this.onControlsChange); } catch {}
    try { this.ro?.disconnect(); } catch {}

    try { this.mapMarkers.forEach(m => m.remove()); } catch {}
    this.mapMarkers = [];

    try { this.map?.remove(); } catch {}

    try {
      if (this.coverageGroup && this.world?.scene()) {
        this.world.scene().remove(this.coverageGroup);
      }
    } catch {}
  }

  // ---------------------------
  // GLOBO
  // ---------------------------
  private initGlobe() {
    const el = this.globeContainer.nativeElement;
    const w = el.clientWidth || 600;
    const h = el.clientHeight || 500;

    this.world = new (Globe as any)(el)
      .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
      .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
      .backgroundColor('rgba(0,0,0,0)')
      .width(w)
      .height(h)
      .showAtmosphere(true)
      .atmosphereColor('#ffffff')
      .atmosphereAltitude(0.1)

      // ✅ SEM ringsData (sem animação)

      // ✅ ícones no globo (clicáveis)
      .htmlElementsData(this.data)
      .htmlElement((d: any) => {
        // ✅ resolve o rádio de forma determinística
        const id = Number(d?.id);
        const r = this.data.find(x => x.id === id) ?? this.data[0];

        const node = document.createElement('div');
        node.style.transform = 'translate(-50%, -50%)';
        node.style.cursor = 'pointer';
        node.style.pointerEvents = 'auto';

        node.innerHTML = `
          <div title="${this.escapeHtml(r.label)}"
               style="width:24px;height:24px;border-radius:9999px;background:${this.escapeHtml(r.color)};
                      border:1px solid #fff;display:flex;align-items:center;justify-content:center;
                      box-shadow:0 6px 18px rgba(0,0,0,.25)">
            <span class="material-symbols-outlined" style="font-size:14px;color:#fff;line-height:1">radio</span>
          </div>
        `;

        const stop = (ev: Event) => { ev.preventDefault(); ev.stopPropagation(); };

        node.addEventListener('pointerdown', stop, { passive: false });
        node.addEventListener('mousedown', stop, { passive: false });
        node.addEventListener('touchstart', stop, { passive: false });

        node.addEventListener('click', (ev) => {
          stop(ev);
          this.onRadioClickedById(r.id); // ✅ não usa objeto “d”
        });

        return node;
      });

    this.world.controls().autoRotate = false;
    this.world.controls().enableZoom = true;

    // foco inicial Brasil
    this.world.pointOfView({ lat: -15, lng: -50, altitude: 2.2 });

    this.addClouds();

    // ✅ coverage estática no globo
    this.installGlobeCoverageAreas();

    this.world.controls().addEventListener('change', this.onControlsChange);
  }

  private onRadioClickedById(id: number) {
    const r = this.data.find(x => x.id === id);
    if (!r) return;

    this.selectedRadio = r;

    // voa até o rádio no globo
    this.world.pointOfView({ lat: r.lat, lng: r.lng, altitude: 0.9 }, 650);

    // entra no mapa depois do voo
    setTimeout(() => {
      this.setMapMode(true, { focusSelected: true });
    }, 520);
  }

  private addClouds() {
    const loader = new THREE.TextureLoader();
    loader.load('//unpkg.com/three-globe/example/img/clouds.png', (cloudsTexture) => {
      const clouds = new THREE.Mesh(
        new THREE.SphereGeometry(this.world.getGlobeRadius() * 1.005, 75, 75),
        new THREE.MeshPhongMaterial({ map: cloudsTexture, transparent: true })
      );
      this.world.scene().add(clouds);
    });
  }

  private installGlobeCoverageAreas() {
    const scene = this.world.scene();
    const R = this.world.getGlobeRadius();

    if (this.coverageGroup) scene.remove(this.coverageGroup);
    this.coverageGroup = new THREE.Group();

    for (const d of this.data) {
      const radiusOnGlobe = (d.rangeKm / 1000) * (R * 0.55);
      const discGeom = new THREE.CircleGeometry(Math.max(0.001, radiusOnGlobe), 96);

      const mat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(d.color),
        transparent: true,
        opacity: 0.18,
        depthWrite: false
      });

      const disc = new THREE.Mesh(discGeom, mat);

      const pos = this.latLngToVector3(d.lat, d.lng, R * 1.001);
      disc.position.copy(pos);

      disc.lookAt(new THREE.Vector3(0, 0, 0));
      disc.rotateX(Math.PI / 2);

      const ringGeom = new THREE.RingGeometry(radiusOnGlobe * 0.98, radiusOnGlobe * 1.0, 128);
      const ringMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(d.color),
        transparent: true,
        opacity: 0.35,
        depthWrite: false
      });

      const ring = new THREE.Mesh(ringGeom, ringMat);
      ring.position.copy(pos);
      ring.lookAt(new THREE.Vector3(0, 0, 0));
      ring.rotateX(Math.PI / 2);

      this.coverageGroup.add(disc);
      this.coverageGroup.add(ring);
    }

    scene.add(this.coverageGroup);
  }

  // ---------------------------
  // MAPA
  // ---------------------------
  private initMap() {
    const rasterStyle: any = {
      version: 8,
      sources: {
        'osm-raster': {
          type: 'raster',
          tiles: [
            'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
            'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
            'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
          ],
          tileSize: 256,
          attribution: '© OpenStreetMap contributors'
        }
      },
      layers: [{ id: 'osm', type: 'raster', source: 'osm-raster' }]
    };

    this.map = new maplibregl.Map({
      container: this.mapContainer.nativeElement,
      style: rasterStyle,
      center: [-50, -15],
      zoom: 3,
      attributionControl: false
    });

    this.map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right');

    this.map.on('load', () => {
      this.installMapMarkers();
      this.installMapStaticCoverageLayers();
    });

    this.map.on('movestart', () => {
      if (!this.isMapMode) return;
      this.mapFocusLockUntil = 0;
    });

    this.map.on('zoomend', () => {
      if (!this.isMapMode || !this.map) return;
      if (this.map.getZoom() <= this.EXIT_MAP_ZOOM) this.setMapMode(false);
    });

    this.map.on('move', () => {
      if (!this.isMapMode) return;
      this.syncGlobeToMap();
    });

    this.map.on('zoom', () => {
      if (!this.isMapMode) return;
      this.syncGlobeToMap();
    });
  }

  private installMapMarkers() {
    if (!this.map) return;

    this.mapMarkers.forEach(m => m.remove());
    this.mapMarkers = [];

    for (const d of this.data) {
      const el = document.createElement('div');
      el.style.cursor = 'pointer';
      el.style.pointerEvents = 'auto';

      el.innerHTML = `
        <div title="${this.escapeHtml(d.label)}"
             style="width:24px;height:24px;border-radius:9999px;background:${this.escapeHtml(d.color)};
                    border:1px solid #fff;display:flex;align-items:center;justify-content:center;
                    box-shadow:0 6px 18px rgba(0,0,0,.25)">
          <span class="material-symbols-outlined" style="font-size:14px;color:#fff;line-height:1">radio</span>
        </div>
      `;

      el.addEventListener('click', (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        this.selectedRadio = d;
        this.focusSelectedRadio(true);
      });

      const mk = new maplibregl.Marker({ element: el, anchor: 'center' })
        .setLngLat([d.lng, d.lat])
        .addTo(this.map);

      this.mapMarkers.push(mk);
    }
  }

  private installMapStaticCoverageLayers() {
    if (!this.map) return;

    const geojson: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: this.data.map((d) => ({
        type: 'Feature',
        properties: { id: d.id, color: d.color, label: d.label, rangeKm: d.rangeKm },
        geometry: { type: 'Point', coordinates: [d.lng, d.lat] }
      }))
    };

    if (this.map.getSource('radios-src')) {
      (this.map.getSource('radios-src') as any).setData(geojson);
    } else {
      this.map.addSource('radios-src', { type: 'geojson', data: geojson });
    }

    const COLOR_EXPR: any = ['coalesce', ['get', 'color'], '#ff4d4d'];
    const RANGE_EXPR: any = ['coalesce', ['get', 'rangeKm'], 180];

    if (!this.map.getLayer('radio-coverage-fill')) {
      this.map.addLayer({
        id: 'radio-coverage-fill',
        type: 'circle',
        source: 'radios-src',
        paint: {
          'circle-color': COLOR_EXPR,
          'circle-opacity': 0.10,
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            3, ['*', RANGE_EXPR, 0.14],
            8, ['*', RANGE_EXPR, 0.70],
            12, ['*', RANGE_EXPR, 1.65],
            16, ['*', RANGE_EXPR, 3.00]
          ]
        }
      });
    }

    if (!this.map.getLayer('radio-coverage-stroke')) {
      this.map.addLayer({
        id: 'radio-coverage-stroke',
        type: 'circle',
        source: 'radios-src',
        paint: {
          'circle-color': 'rgba(0,0,0,0)',
          'circle-opacity': 0,
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            3, ['*', RANGE_EXPR, 0.14],
            8, ['*', RANGE_EXPR, 0.70],
            12, ['*', RANGE_EXPR, 1.65],
            16, ['*', RANGE_EXPR, 3.00]
          ],
          'circle-stroke-color': COLOR_EXPR,
          'circle-stroke-width': 2,
          'circle-stroke-opacity': 0.35
        }
      });
    }

    if (!this.map.getLayer('radio-dot')) {
      this.map.addLayer({
        id: 'radio-dot',
        type: 'circle',
        source: 'radios-src',
        paint: {
          'circle-color': COLOR_EXPR,
          'circle-opacity': 1,
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 3, 3, 10, 4, 14, 6, 16, 7],
          'circle-stroke-color': '#ffffff',
          'circle-stroke-width': 1.5,
          'circle-stroke-opacity': 1
        }
      });
    }

    try { this.map.moveLayer('radio-dot'); } catch {}
  }

  // ---------------------------
  // MODO + SYNC
  // ---------------------------
  private setMapMode(on: boolean, opts?: { focusSelected?: boolean }) {
    if (on === this.isMapMode) return;

    this.isMapMode = on;

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

    this.world.controls().enableRotate = true;
    this.world.controls().enablePan = true;
    this.world.controls().enableZoom = true;

    const c = this.map?.getCenter();
    if (c) this.world.pointOfView({ lat: c.lat, lng: c.lng, altitude: 1.7 }, 450);
    else if (this.selectedRadio) this.world.pointOfView({ lat: this.selectedRadio.lat, lng: this.selectedRadio.lng, altitude: 1.7 }, 450);
  }

  private focusSelectedRadio(animate: boolean) {
    if (!this.map) return;

    if (!this.selectedRadio) {
      const pov = this.world.pointOfView();
      this.selectedRadio = this.getNearestRadio(pov?.lat ?? -15, pov?.lng ?? -50);
    }

    const r = this.selectedRadio;

    this.isSyncingFromGlobe = true;

    this.map.flyTo({
      center: [r.lng, r.lat],
      zoom: Math.max(this.MAP_FOCUS_ZOOM, this.map.getZoom()),
      speed: 1.2,
      curve: 1.5,
      essential: true
    });

    setTimeout(() => { this.isSyncingFromGlobe = false; }, animate ? 900 : 80);
  }

  private syncGlobeToMap() {
    if (!this.map) return;
    if (this.isSyncingFromGlobe) return;
    if (Date.now() < this.mapFocusLockUntil) return;

    const c = this.map.getCenter();
    const zoom = this.map.getZoom();

    // ✅ IMPORTANT: não troca o selectedRadio automaticamente aqui
    // senão ele “pula” pra outro ponto enquanto você mexe
    const altitude = this.mapZoomToAltitude(zoom);

    this.isSyncingFromMap = true;
    this.world.pointOfView({ lat: c.lat, lng: c.lng, altitude }, 0);
    setTimeout(() => { this.isSyncingFromMap = false; }, 0);
  }

  private mapZoomToAltitude(z: number): number {
    const alt = Math.pow(2, (12 - z) / 2.2);
    return Math.min(3, Math.max(0.07, alt));
  }

  // ---------------------------
  // helpers
  // ---------------------------
  private getNearestRadio(lat: number, lng: number): RadioPoint {
    let best = this.data[0];
    let bestD = Infinity;

    for (const r of this.data) {
      const dLat = r.lat - lat;
      const dLng = r.lng - lng;
      const d = dLat * dLat + dLng * dLng;
      if (d < bestD) { bestD = d; best = r; }
    }
    return best;
  }

  private resizeAll() {
    const el = this.globeContainer.nativeElement;
    const w = el.clientWidth || 600;
    const h = el.clientHeight || 500;

    try { this.world.width(w); this.world.height(h); } catch {}
    try { this.map?.resize(); } catch {}
    try { this.installGlobeCoverageAreas(); } catch {}
  }

  private escapeHtml(s: string) {
    return (s || '').replace(/[&<>"']/g, (m) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[m] as string));
  }

  private latLngToVector3(lat: number, lng: number, radius: number) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);

    const x = -radius * Math.sin(phi) * Math.cos(theta);
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);

    return new THREE.Vector3(x, y, z);
  }
}
