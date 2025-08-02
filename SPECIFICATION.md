# Viehhandel Spezifikation

Plattform für den Handel mit Kühen und Kälbern

## 1. Projektziel
Entwicklung einer webbasierten Handelsplattform für Nutztiere (Kühe, Kälber) mit gleichwertiger Integration:
- Auktionen
- Direktkäufe
- Vermittlungen
- Handelsbörse (Angebote & Gesuche)

## 2. Zielgruppe (primär)
- Landwirte
- Viehhändler
- Schlachtbetriebe

## 3. Kernfunktionalitäten (MVP)
- Anmeldung & Nutzerverwaltung
- Angebotserstellung & -verwaltung
- Auktion/Direktkauf/Vermittlungsabwicklung
- Nachrichtenfunktion
- Berichte & Dokumentation (Gesundheit, Herkunft)

## 4. Benutzerinteraktionen
- Tierangebot in 3 Schritten
- Direktkauf: Klick + Bestätigung
- Auktion: Gebot + automatischer Zuschlag
- Vermittlung: Kontaktaufnahme via Nachrichtensystem
- Automatische Benachrichtigungen (Gebot, Kauf, Status)

## 5. Technischer Stack
- Frontend: React (Web), React Native (Mobile)
- Backend: Node.js/Express oder Python/Django
- DB: PostgreSQL oder MongoDB
- Hosting: Cloud (AWS, Azure), Docker
- Zahlungsdienste: Stripe (Visa, MasterCard, PayPal, Klarna, ApplePay, GooglePay)
- Logistikintegration via REST-Schnittstelle

## 6. UX/UI
- Zielgruppe: männlich, landwirtschaftlich geprägt
- Design: minimalistisch, klare Struktur, kräftige Farben
- Nicht mobile-first, aber responsive
- Maximal drei Klicks zum Ziel

## 7. Compliance & Sicherheit
- Einhaltung EU-Tierschutz-, Zahlungs- und Datenschutzrecht (DSGVO, PSD2)
- HTTPS-Verschlüsselung
- Verschlüsselte Datenbanken
- 2FA & sichere Authentifizierung
- Regelmäßige Audits & Sicherheitsupdates

