# Viehhandel

Dieses Repository enthält ein einfaches Beispiel für eine Plattform zum Handel mit Kühen und Kälbern.

## Starten

### Backend & Frontend

```
cd backend
npm install
npm start
```

Der Server liefert anschließend das Frontend unter http://localhost:3000 aus.

## Hinweis
Dies ist nur ein Minimalbeispiel zur Demonstration der Architektur (React + Express) und bildet nicht alle Funktionen der Spezifikation ab.

## Erklärung
Der Prototyp umfasst derzeit lediglich eine sehr einfache Tierverwaltung:
- Das Express-Backend stellt die Endpunkte `GET /api/animals` und `POST /api/animals` bereit und speichert die Daten nur im Arbeitsspeicher.
- Das React-Frontend (geladen über ein CDN) zeigt die vorhandenen Tiere an und bietet ein Formular zum Hinzufügen neuer Angebote.
Die Einträge sind nicht persistent und werden bei einem Neustart des Servers zurückgesetzt.
