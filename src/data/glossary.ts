// Begriffserklärungen – v.a. für die Nutzergruppe Privat / Hobbyhalter.
export const GLOSSARY: Record<string, string> = {
  Färse: 'Eine weibliche Kuh, die noch nicht gekalbt hat (noch kein Kalb bekommen hat).',
  Ochse: 'Ein kastrierter männlicher Rind, oft ruhiger und für die Mast geeignet.',
  Bulle: 'Ein geschlechtsreifes, männliches und unkastriertes Rind.',
  Ohrmarke:
    'Die gesetzlich vorgeschriebene Kennzeichnung jedes Rindes (Nummer beginnt mit Länderkürzel, z.B. DE). Dient der lückenlosen Rückverfolgung.',
  HIT: 'HI-Tier ("Herkunftssicherungs- und Informationssystem für Tiere") – die zentrale staatliche Datenbank, in der jedes Rind registriert ist.',
  BVD: 'Bovine Virusdiarrhoe – eine anzeigepflichtige Rinderseuche. "Unverdächtig" bedeutet, das Tier ist getestet und unauffällig.',
  BHV1:
    'Bovines Herpesvirus 1 (Rinderherpes). "Frei" bedeutet, der Bestand ist amtlich anerkannt frei davon.',
  EUROP:
    'Handelsklassen-System (E, U, R, O, P) zur Bewertung der Fleischigkeit eines Schlachttieres – E ist am besten, P am geringsten.',
  Fettklasse: 'Bewertung der Verfettung eines Schlachtkörpers von 1 (sehr mager) bis 5 (stark verfettet).',
  Fleckvieh: 'Eine sehr verbreitete Zweinutzungsrasse (Milch und Fleisch) im süddeutschen Raum.',
  Treuhand:
    'Sichere Bezahlung: Der Kaufbetrag wird zunächst auf einem neutralen Konto geparkt und erst an den Verkäufer ausgezahlt, wenn der Käufer die Tiere erhalten und bestätigt hat.',
  Lebendgewicht: 'Das Gewicht des lebenden Tieres (im Gegensatz zum Schlachtkörpergewicht).',
};

export const GLOSSARY_TERMS = Object.keys(GLOSSARY);
