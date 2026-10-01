# KG Gewinnverwendung – interaktiver Lernkurs

Dieser Kurs ist für Netlify vorbereitet. Er benötigt **keine SQL-Datenbank und kein Supabase**. Konten, Sitzungen und Lernfortschritt werden über **Netlify Functions + Netlify Blobs** gespeichert.

## Enthalten

- 7 Lernkapitel mit Erklärungen, Definitionen, Beispielen und Schaubildern
- 36 interaktive Aufgaben
- AFB-Kennzeichnung je Aufgabe
- Multiple Choice, Mehrfachauswahl, Richtig/Falsch-Logik, Zahlenaufgaben, Zuordnung/Drag & Drop, Reihenfolge, Freitext, Tabellenaufgaben
- umfangreiches Tabellenlabor zur Gewinnverteilung
- mehrere vollständige komplexe Gewinnverwendungsfälle
- Musterlösungen mit Rechenweg und beschrifteten Ausgangswerten
- Bestätigungsabfrage vor dem Öffnen einer Musterlösung
- Gastmodus mit Speicherung im Browser
- Schülerkonten mit Nickname + Passwort + Klasse
- Lehrerzugang mit Klasse
- Lernfortschritt über mehrere Geräte synchronisierbar
- Lehrer-Dashboard: Fortschritt einsehen, Nutzer entfernen, Fortschritt löschen, Passwörter neu setzen
- XP-System, Abzeichen, Avatar, Haustiere, Accessoires und freischaltbare Farbschemata
- responsive Darstellung für Desktop, Tablet sowie Android/iOS
- installierbares Web-App-Manifest und Offline-Cache für den statischen Kursinhalt

## 1. Repository bei GitHub anlegen

1. ZIP-Datei entpacken.
2. **Den Inhalt des entpackten Ordners** in ein neues GitHub-Repository hochladen. `netlify.toml` und `package.json` müssen im Wurzelverzeichnis des Repositories liegen.
3. Das Repository speichern/pushen.

## 2. Mit Netlify verbinden

1. In Netlify: **Add new project / Import an existing project**.
2. GitHub auswählen und das Repository verbinden.
3. Netlify liest die Einstellungen aus `netlify.toml` automatisch:
   - Publish directory: `site`
   - Functions directory: `netlify/functions`
   - Node 20
4. Deploy noch nicht zwingend starten; zuerst den Lehrer-Code setzen.

## 3. Lehrer-Code als Netlify-Variable setzen

In Netlify unter **Project configuration → Environment variables** eine Variable anlegen:

```text
TEACHER_CODE=IhrGewuenschterLehrerCode
```

Es ist **keine allgemeine AUTH-Variable und kein zusätzlicher geheimer Sitzungsschlüssel** erforderlich. Sitzungen verwenden zufällige, in Netlify Blobs gespeicherte Sitzungstoken.

Danach neu deployen.

## 4. Ersten Lehrerzugang anlegen

1. Die veröffentlichte Kursseite öffnen.
2. **Registrieren** wählen.
3. Rolle **Lehrer/in** wählen.
4. Klasse, Nickname und Passwort eingeben.
5. Den in Netlify gesetzten `TEACHER_CODE` eingeben.

Der Lehrer sieht anschließend ausschließlich Nutzer derselben Klasse.

## 5. Schülerzugänge

Schüler wählen **Registrieren → Schüler/in** und geben an:

- Klasse
- selbst gewählten Nickname
- selbst gewähltes Passwort

Der gleiche Nickname kann in unterschiedlichen Klassen verwendet werden. Innerhalb derselben Klasse muss der Nickname eindeutig sein.

## Gastmodus

Der Kurs funktioniert auch ohne Anmeldung. Der Fortschritt wird dann nur im Browser (`localStorage`) gespeichert. Bei einer späteren Anmeldung wird vorhandener lokaler Fortschritt mit dem Kontofortschritt zusammengeführt.

## Passwort zurücksetzen

Im Lehrer-Dashboard kann für einen Schüler ein neues vorläufiges Passwort gesetzt werden. Vorherige Sitzungen dieses Kontos werden dadurch ungültig.

## Fortschritt löschen

Der Lehrer kann:

- den Fortschritt eines einzelnen Schülers löschen,
- den Fortschritt aller Schüler der Klasse löschen,
- Schülerkonten entfernen.

Beim Zurücksetzen werden auch XP, freigeschaltete Shop-Elemente und kosmetische Einstellungen zurückgesetzt. Das Konto selbst bleibt bestehen, sofern es nicht ausdrücklich gelöscht wird.

## Datenspeicherung

Netlify Blobs speichert:

- Nickname
- Klasse
- Rolle
- Passwort-Hash + zufälliges Salt (kein Klartextpasswort)
- Lernfortschritt
- XP-/Shop-Status
- Sitzungsdaten

Es werden keine E-Mail-Adressen benötigt.

## Lokaler Test (optional)

Mit installierter Netlify CLI:

```bash
npm install
netlify dev
```

Für die Lehrerregistrierung lokal muss `TEACHER_CODE` ebenfalls in der lokalen Netlify-Umgebung gesetzt sein.

## Projektstruktur

```text
.
├── netlify.toml
├── package.json
├── README.md
├── netlify/
│   └── functions/
│       └── api.mjs
└── site/
    ├── index.html
    ├── app.js
    ├── course-data.js
    ├── styles.css
    ├── icon.svg
    ├── manifest.webmanifest
    └── sw.js
```

## Inhaltliche Hinweise

Der Lernkurs konzentriert sich auf die Berechnungsabfolge der Gewinnverwendung in der KG und besonders auf das korrekte Befüllen der Tabellen. Historische Fälle vor 2024 sind ausdrücklich als solche gekennzeichnet, wenn die damalige Behandlung ausstehender Einlagen benötigt wird.
