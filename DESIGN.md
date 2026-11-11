# Webflasher — UI-Spec (Ant Design)

Vorlage für die Umsetzung in React mit antd v5. Die vier HTML-Dateien sind die
Artboards aus dem Design-Canvas als eigenständige Seiten — antds Oberfläche ist
dort in reinem CSS nachgebaut, als visuelle Referenz für Markup und Maße.
Im Code werden daraus echte antd-Komponenten; `antd-theme.js` enthält das
passende `ConfigProvider`-Theme.

| Datei | Screen |
|---|---|
| `index.html` | Startseite, erklärt das Tool |
| `flash.html` | Editor + Speicher (Hex), Ruhezustand |
| `console.html` | gleiche Seite, Flash läuft + Serial Monitor |
| `states.html` | Erfolg, Fehler, Verbindungsverlust, leerer Zustand |

## Welche antd-Komponente wofür

| Stelle im Entwurf | Komponente |
|---|---|
| Navbar | `Layout.Header` + `Menu mode="horizontal" theme="dark"` |
| Gerätestatus, „ungespeichert", Chip-Liste | `Tag` (success / warning / default / processing) |
| Toolbar über dem Editor | `Space` + `Button` (`type="primary"` für Flashen) |
| Datei hochladen | `Upload` mit `showUploadList={false}`, Button als Trigger |
| Datei-Tabs, Speicher/Konsole | `Tabs` (`type="line"`, Ink-Bar unten) |
| Adresse / Länge / Baudrate | `Form` + `Input` / `Select`, Labels oben |
| Erase / Verify / Reboot | `Checkbox` oder `Switch` |
| Fortschritt beim Schreiben | `Progress` (`strokeWidth={8}`, `showInfo={false}`) + eigene Schrittliste |
| Flash erfolgreich | `Result status="success"` |
| Flash fehlgeschlagen, Web Serial fehlt | `Alert type="error"` / `type="warning"` mit `description` |
| Gerät getrennt | `notification.error` mit `btn` und `duration: 0` |
| Speicher noch nicht gelesen | `Empty` mit eigenem `description` + Button |
| Gerät wird erkannt | `Spin` mit `tip` |
| Karten auf der Startseite | `Card` (`bordered`) |
| Zuletzt verwendet | `List` mit `actions` |

Kein antd-Pendant, also eigene Komponenten: **Code-Feld** (später CodeMirror 6
oder Monaco), **Hex-Dump** (virtualisierte Liste, nicht `Table`) und
**Serial-Log** (virtualisierte Liste, Autoscroll am Ende). Farben dafür stehen
in `codeTokens` in `antd-theme.js`.

## Layout der Flash-Seite

```
┌─ Layout.Header ─────────────────────────────────────────────────┐
│ Logo │ Menu: Start · Flashen · Einstellungen │ Tag │ Trennen    │
├─ Toolbar ───────────────────────────────────────────────────────┤
│ Hochladen · Speichern · Speichern als │ Datei │ Debuggen · FLASHEN │
├────────────────────────────────┬────────────────────────────────┤
│ Code-Feld (flex: 3 1 540px)    │ Tabs (flex: 2 1 380px)         │
│  Tabs: Dateien                 │  Speicher | Konsole            │
│  Editor + Zeilennummern        │  Adresse/Länge/Lesen → Hex     │
│  Statuszeile                   │  bzw. Progress + Serial        │
└────────────────────────────────┴────────────────────────────────┘
```

- 60/40 über `flex: 3 1 540px` / `flex: 2 1 380px` in einem
  `flex-wrap: wrap`-Container — bei schmalem Viewport stapeln die Spalten.
  Kein `Row`/`Col` mit festem `span`, sonst bricht die Hex-Spalte zu früh um.
- Die rechte Spalte ist **ein** Panel mit zwei Tabs. Beim Start des Flashens
  programmatisch auf *Konsole* wechseln: oben `Progress` mit Schrittliste,
  darunter der Serial Monitor.
- Während des Flashens: Editor `opacity: .55` und `readOnly`, Toolbar-Buttons
  `disabled`, Primärbutton `loading` mit „Flashen läuft …", Abbrechen sitzt im
  Fortschritts-Block.

## Regeln, die das Design trägt

1. **Blau nur für Aktionen und Fortschritt**, nie für Status. Status läuft über
   `colorSuccess` / `colorWarning` / `colorError`.
2. **`fontFamilyCode` für Maschinendaten** — Ports, Offsets, Hashes, Baudraten,
   Byte-Zähler, Log- und Hex-Inhalte. Labels und Fließtext in der UI-Schrift.
3. **Log-Zeilen tragen `[I] [W] [E] [D]`** als Text, damit sie ohne
   Farbunterscheidung lesbar bleiben.
4. **Flächen-Hierarchie:** Layout `#000`, Panels `#141414`, Code/Log/Hex wieder
   `#000`. Der Editor ist die dunkelste Fläche, nicht die hellste.
5. **Controls auf 40 px** (`controlHeight`) statt antds 32 px — Tooling-UI wird
   schnell zu klein zum Treffen. Icon-only-Buttons brauchen `aria-label`,
   dekorative SVGs `aria-hidden="true"`.
6. **Meta-Text `#8C8C8C`**, nicht antds `colorTextTertiary` — das fällt bei
   12 px unter 4.5:1 Kontrast.

## Offen

- *Einstellungen* in der Navbar hat noch keinen Screen — Baudrate, Flash-Offset
  sowie Erase/Verify/Reboot-Schalter brauchen dort einen Platz.
- Die Liste der unterstützten Ziele auf der Startseite ist ein Platzhalter.
