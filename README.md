# Bürgertour App – Deployment & Anleitung

## Projektstruktur

```
reiseapp/
├── index.html      ← Komplette App (HTML + CSS + JS in einer Datei)
├── manifest.json   ← PWA-Manifest (App-Symbol, Farbe, Name)
├── sw.js           ← Service Worker (Offline-Caching)
├── icons/          ← App-Icons (selbst erstellen, siehe unten)
│   ├── icon-192.png
│   └── icon-512.png
└── README.md       ← Diese Datei
```

---

## GitHub Pages Deployment – Schritt für Schritt

### Schritt 1: GitHub-Account
Falls noch nicht vorhanden: https://github.com/join – kostenlos registrieren.

### Schritt 2: Neues Repository erstellen
1. github.com → „New repository" (grüner Button oben rechts)
2. Name: z.B. `buergerreise-app`
3. Visibility: **Public** (für GitHub Pages kostenlos)
4. „Create repository" klicken

### Schritt 3: Dateien hochladen
1. Im neuen Repository: „uploading an existing file" klicken
2. Alle Dateien (index.html, manifest.json, sw.js, icons/) per Drag & Drop hochladen
3. Commit-Nachricht eintragen, z.B. „Erste Version"
4. „Commit changes" klicken

### Schritt 4: GitHub Pages aktivieren
1. Repository → „Settings" (Zahnrad-Tab)
2. Links in der Sidebar: „Pages"
3. Source: „Deploy from a branch"
4. Branch: **main**, Ordner: **/ (root)**
5. „Save" klicken

### Schritt 5: App öffnen
- Nach ca. 1–2 Minuten ist die App erreichbar unter:
  `https://DEIN-USERNAME.github.io/buergerreise-app/`
- Diese URL auf dem Smartphone im Browser öffnen
- PWA-Installationshinweis erscheint automatisch (iOS: „Zum Home-Bildschirm")

---

## Icons erstellen (für PWA)

Einfachste Methode:
1. Auf https://favicon.io oder https://realfavicongenerator.net gehen
2. Ein Icon/Buchstaben-Logo erstellen (z.B. „BT" auf navy Hintergrund)
3. Als PNG in 192×192 und 512×512 herunterladen
4. In den `icons/`-Ordner des Repositories legen

---

## Service Worker einbinden (optional, für Offline-Fähigkeit)

Wenn du den Service Worker nutzen möchtest, füge am Ende von `index.html` vor `</body>` ein:

```html
<script>
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
      .then(() => console.log('Service Worker registriert'))
      .catch(err => console.warn('SW-Fehler:', err));
  }
</script>
```

---

## Daten exportieren & sichern

1. App öffnen → Tab „Daten"
2. „Daten exportieren" → JSON-Datei wird auf dem Gerät gespeichert
3. Diese Datei an einem sicheren Ort aufbewahren (Cloud, Mail, etc.)
4. Import: gleiche Seite → „Datei wählen & importieren"

---

## Inhalte anpassen

Alle Reisedaten sind im JavaScript-Block der `index.html` als `DEFAULT_DATA` definiert.
Du kannst dort Reiseplan, Ziele, Kontakte und Basisdaten direkt bearbeiten – 
einfach mit einem Texteditor (z.B. VS Code, Notepad++).

Alternativ: Daten über Export/Import pflegen, ohne den Code anzufassen.

---

## Spätere Erweiterungen (Ideen)

| Feature              | Technologie                        |
|---------------------|------------------------------------|
| Cloud-Sync           | Firebase / Supabase                |
| Login               | Firebase Auth / Supabase Auth      |
| Kartenfunktion      | Leaflet.js + OpenStreetMap         |
| Teilen mit anderen  | QR-Code-Generator + gemeinsame URL |
| Push-Benachrichtigung| Web Push API                       |
| Mehrsprachigkeit    | i18n-Bibliothek (z.B. i18next)    |
| Admin-Bereich       | Formular-gestützte Datenpflege     |
| MDM/MAM-Deployment  | Capacitor (iOS/Android-App-Wrapper)|

---

## Technische Details

- **Storage:** localStorage (kein Server nötig, Daten bleiben auf dem Gerät)
- **PWA:** manifest.json + Service Worker → offline nutzbar, installierbar
- **Framework:** Vanilla JS (kein React/Vue/Angular) – schlank, wartbar
- **Kompatibilität:** Alle modernen Browser, iOS Safari, Android Chrome
- **Deployment:** Statisch – kein Backend, kein Server nötig

---

*Erstellt mit Claude · Stand: Mai 2026*
