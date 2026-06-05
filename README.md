# 🐄 Viehhandel

**Sicher handeln statt nur inserieren.** Eine Online-Handelsplattform für Rinder und Kälber –
gebaut mit React + Vite + TypeScript und automatisch auf **GitHub Pages** deployt.

> Live-Demo (nach Aktivierung von Pages): **https://bernhardmayr.github.io/viehhandel/**

## Alleinstellungsmerkmal (USP)

Konkurrenzplattformen (Bullship, landwirt.com, agrarboerse.eu, DeineTierwelt) sind im Kern reine
**Kleinanzeigen-/Kontaktbörsen**. Viehhandel wickelt den **gesamten Handel** ab und kombiniert vier
Dinge, die reine Börsen nicht bieten:

1. **🔒 Treuhand-Zahlung mit Käuferschutz** – Geld wird erst nach Erhalt der Tiere freigegeben.
2. **✓ Verifizierte Betriebe** – geprüfte Identität, HIT-Betriebsnummer und Bewertungen.
3. **📋 HIT-/Tierpass-Integration** – Ohrmarke, Herkunftskette, BVD/BHV1-Status, Impfungen und
   papierlose Ab-/Ummeldung (simuliert).
4. **🚚 Integrierte Transportbörse** – tierschutzkonformer Transport mit zertifizierten Fahrern,
   direkt im Checkout buchbar.

## Nutzergruppen & rollenspezifische Eingabe

| Rolle | Besonderheit in der Dateneingabe |
|---|---|
| 🚜 **Landwirt:in** | Einfacher 3-Schritt-Wizard (Tierdaten → HIT/Gesundheit → Vermarktung) |
| 📦 **Viehhändler:in** | **Schnell-/Masseneingabe** (Tabelle, „Zeile duplizieren") + **Bestandsverwaltung** |
| 🥩 **Schlachtbetrieb** | Zusätzliche Schlachtdaten (Lebendgewicht, EUROP-Klasse, Fettklasse), Sammelgesuche |
| 🏡 **Privat/Hobby** | Geführte Formulare mit **Erklärungen zu Fachbegriffen** (Tooltips) |

## Features

- Marktplatz mit Filter (Kategorie, Handelsart, Gesundheitsstatus, „nur verifiziert")
- Direktkauf, Vermittlung, Gesuche und **Live-Auktion mit Echtzeit-Geboten** (Countdown + simulierte Gegengebote)
- Nachrichten zwischen Käufer:innen und Anbieter:innen
- Vollständiger Treuhand-Ablauf mit Fortschrittsanzeige
- Responsive Design, kräftige Farben, max. 3 Klicks zum Ziel (gemäß `SPECIFICATION.md`)

## Technik

- **React 18 + Vite 5 + TypeScript**, `react-router-dom` mit `HashRouter` (Pages-tauglich, keine 404 bei Reload)
- State über React Context + `useReducer`, Persistenz im Browser (`localStorage`)
- Keine externe Backend-Abhängigkeit – reine Frontend-Demo mit vorbefüllten Beispieldaten

## Lokal starten

```bash
npm install
npm run dev        # Entwicklung (http://localhost:5173/viehhandel/)
npm run build      # Produktions-Build nach dist/
npm run preview    # gebaute App lokal testen
```

### Demo-Zugänge

Über den Login-Schnellzugang (Passwort jeweils `demo`):
`landwirt@demo.de`, `haendler@demo.de`, `schlachthof@demo.de`, `hobby@demo.de`.
Über „Demodaten zurücksetzen" im Footer lässt sich der Ausgangszustand wiederherstellen.

## Deployment auf GitHub Pages

Der Workflow `.github/workflows/deploy.yml` baut die App und deployt sie automatisch bei jedem Push.

**Einmalige manuelle Aktivierung:**
1. GitHub → Repo **Settings → Pages → Build and deployment → Source: „GitHub Actions"**.
2. Repo-Name muss `viehhandel` lauten (sonst `base` in `vite.config.ts` anpassen).
3. Der Workflow läuft auf den Branches `main` und `claude/viehandel-ecommerce-site-PP3tE`.
   Ggf. unter **Settings → Environments → github-pages** die Deployment-Branch-Policy erweitern.

> **Hinweis:** Reine Frontend-Demo. Es finden keine echten Zahlungen statt; alle Daten liegen lokal
> im Browser. Für den Produktivbetrieb wären ein echtes Backend, Authentifizierung, ein
> Zahlungsdienstleister (z.B. Stripe) und eine echte HI-Tier-Anbindung erforderlich.
