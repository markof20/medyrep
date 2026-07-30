// Moduli ufficiali per esame, come da Piano di Studi 2025-26 — Medicina e
// Chirurgia (Ordinamento DM 1649/2023, "Riforma Bernini", Allegato 1).
// Ogni voce corrisponde a una riga della colonna SETTORE del corso integrato:
// stesso settore ripetuto più volte (es. lo stesso insegnamento diviso su più
// righe di CFU/TAF) resta comunque un modulo distinto, così come appare nel
// documento originale.
//
// Eccezione: "scienze-neurologiche" avrebbe 12 righe nel documento, ma ogni
// esame ha solo 10 livelli generati (LEVELS_PER_NODE in medContent.ts), quindi
// le righe che sono lo stesso settore semplicemente ripartito su più TAF
// (MEDS-12/A Neurologia ×3, MEDS-22/B Neuroradiologia ×2) sono state accorpate
// per restare entro il limite.

export const EXAM_MODULES: Record<string, string[]> = {
  // Scienze di Base
  "chimica-biochimica": ["BIOS-07/A - Biochimica"],
  fisica: [
    "PHYS-06/A - Fisica per le scienze della vita, l'ambiente e i beni culturali",
    "PHYS-03/A - Fisica sperimentale della materia e applicazioni",
    "PHYS-06/A - Fisica per le scienze della vita, l'ambiente e i beni culturali",
  ],
  biologia: ["BIOS-10/A - Biologia cellulare e applicata"],
  "abilita-informatiche": [
    "ANGL-01/C - Inglese",
    "ANGL-01/C - Inglese",
    "INFO-01/A - Informatica",
    "INFO-01/A - Informatica",
    "MEDS-24/A - Statistica medica",
    "MEDS-24/A - Statistica medica",
  ],
  "anatomia1-istologia-embriologia": [
    "BIOS-12/A - Anatomia Umana 1",
    "BIO/16 - Tirocinio Anatomia Umana 1",
    "BIOS-13/A - Istologia ed embriologia umana",
  ],
  "biochimica-biomol-genetica": [
    "BIOS-08/A - Biologia Molecolare",
    "BIOS-07/A - Biochimica",
    "BIOS-07/A - Tirocinio Biochimica",
    "MEDS-01/A - Genetica medica",
    "MEDS-01/A - Genetica medica",
  ],

  // Scienze Fisiologiche e Microbiologiche
  anatomia2: ["BIOS-12/A - Anatomia Umana 2", "BIOS-12/A - Tirocinio Anatomia Umana 2"],
  "microbio-immuno": [
    "MEDS-03/A - Microbiologia generale e Microbiologia clinica",
    "MEDS-03/A - Tirocinio Microbiologia generale e Microbiologia clinica",
    "MEDS-02/A - Immunologia",
  ],
  fisiologia1: ["BIOS-06/A - Fisiologia Umana 1", "BIOS-06/A - Tirocinio Fisiologia umana 1"],
  fisiologia2: ["BIOS-06/A - Fisiologia umana 2", "BIOS-06/A - Tirocinio Fisiologia umana 2"],
  "patgen1-genetica-medica": [
    "MEDS-02/A - Patologia generale 1",
    "MEDS-02/A - Tirocinio Patologia generale 1",
    "MEDS-01/A - Genetica medica",
    "MEDS-01/A - Genetica medica",
    "MEDS-01/A - Tirocinio Genetica medica",
  ],
  "scienze-umane": [
    "MEDS-02/A - Storia della medicina",
    "PAED-01/A - Pedagogia generale e sociale",
    "GSPS-05/A - Sociologia generale",
    "GSPS-05/A - Sociologia generale",
    "PSIC-01/A - Psicologia generale",
  ],

  // Patologia e Semeiotica Clinica
  patgen2: ["MEDS-02/A - Patologia generale"],
  "semeiotica-med-chir": [
    "MEDS-05/A - Medicina Interna",
    "MEDS-05/A - Tirocinio Medicina Interna",
    "MEDS-06/A - Tirocinio Chirurgia generale",
    "MEDS-06/A - Chirurgia generale",
    "MEDS-24/C - Scienze infermieristiche generali, cliniche, pediatriche e ostetrico-ginecologiche neonatali",
    "MEDS-24/B - Igiene generale ed applicata",
    "MEDS-24/B - Igiene generale ed applicata",
    "MEDS-26/D - Tirocinio Scienze tecniche mediche e chirurgiche avanzate",
    "MEDS-26/D - Scienze tecniche mediche e chirurgiche avanzate",
  ],
  "medicina-laboratorio": [
    "BIOS-09/A - Biochimica Clinica",
    "MEDS-02/B - Patologia Clinica",
    "MEDS-02/B - Tirocinio Patologia Clinica",
    "MEDS-02/B - Patologia Clinica",
    "MEDS-03/A - Microbiologia Clinica",
    "MEDS-03/A - Microbiologia Clinica",
  ],
  "endocrino-gastro-nutrizione": [
    "MEDS-08/A - Endocrinologia",
    "MEDS-08/A - Endocrinologia",
    "MEDS-08/A - Tirocinio Endocrinologia",
    "MEDS-10/A - Gastroenterologia",
    "MEDS-10/A - Tirocinio Gastroenterologia",
    "MEDS-08/C - Scienza dell'alimentazione e delle tecniche dietetiche applicate (Nutrizione clinica)",
    "MEDS-08/C - Scienza dell'alimentazione e delle tecniche dietetiche applicate (Nutrizione clinica)",
    "MEDS-08/C - Tirocinio Scienza dell'alimentazione e delle tecniche dietetiche applicate",
  ],
  "pat-sistemica-ricostruttiva": [
    "MEDS-10/C - Malattie Cutanee e Venere",
    "MEDS-10/C - Tirocinio Malattie Cutanee e Venere",
    "MEDS-16/A - Malattie Odontostomatologiche",
    "MEDS-16/A - Tirocinio Malattie Odontostomatologiche",
    "MEDS-15/B - Chirurgia Maxillo-facciale",
  ],
  "anatomia-patologica": [
    "MEDS-04/A - Anatomia patologica",
    "MEDS-04/A - Tirocinio Anatomia patologica",
    "MEDS-26/A - Scienze tecniche di medicina di laboratorio",
    "MEDS-25/A - Tirocinio Medicina legale",
    "MEDS-25/A - Medicina legale",
  ],

  // Farmacologia e Specialità Cliniche
  "farmaco-tossicologia": ["BIOS-11/A - Farmacologia", "BIOS-11/A - Tirocinio Farmacologia"],
  "scienze-comportamento": [
    "MEDS-11/A - Psichiatria",
    "MEDS-11/A - Psichiatria",
    "MEDS-11/A - Tirocinio Psichiatria",
    "BIOS-11/A - Farmacologia: modulo psicofarmacologia",
  ],
  "organi-senso": [
    "MEDS-17/A - Malattie dell'Apparato visivo",
    "MEDS-17/A - Malattie dell'Apparato visivo",
    "MEDS-17/A - Tirocinio Malattie dell'Apparato visivo",
    "MEDS-18/A - Otorinolaringoiatria",
    "MEDS-18/A - Tirocinio Otorinolaringoiatria",
    "MEDS-18/B - Tirocinio Audiologia e Foniatria",
    "MEDS-18/B - Audiologia e Foniatria",
  ],
  oncologia: [
    "MEDS-09/B - Malattie del Sangue",
    "MEDS-09/A - Oncologia Medica",
    "MEDS-09/A - Cure palliative",
    "MEDS-09/A - Tirocinio Oncologia Medica",
    "PSIC-04/B - Psicologia clinica",
    "MEDS-08/C - Scienza dell'alimentazione e delle tecniche dietetiche applicate (Nutrizione clinica)",
  ],
  "pat-cv-resp-renale": [
    "MEDS-07/B - Malattie dell'Apparato Cardiovascolare",
    "MEDS-07/B - Malattie dell'Apparato Cardiovascolare",
    "MEDS-07/B - Tirocinio Malattie dell'Apparato Cardiovascolare",
    "MEDS-07/A - Malattie apparato respiratorio",
    "MEDS-07/A - Tirocinio Malattie apparato respiratorio",
    "MEDS-08/B - Nefrologia",
    "MEDS-08/B - Tirocinio Nefrologia",
    "MEDS-08/B - Patologia Ricambio Idroelettrolitico, Dialisi e Trapianto",
    "MEDS-26/D - Scienze tecniche mediche e chirurgiche avanzate",
    "INF-05/A - Sistemi di elaborazione delle informazioni",
  ],
  "chirurgia-specialistica": [
    "MEDS-13/A - Chirurgia Toracica",
    "MEDS-13/C - Chirurgia Cardiaca",
    "MEDS-13/C - Chirurgia Cardiaca",
    "MEDS-13/C - Tirocinio Chirurgia Cardiaca",
    "MEDS-13/B - Chirurgia Vascolare",
    "MEDS-14/C - Tirocinio Urologia",
    "MEDS-14/C - Urologia",
    "MEDS-14/A - Chirurgia plastica",
  ],

  // Specialità Cliniche e Diagnostica
  "scienze-neurologiche": [
    "MEDS-12/A - Neurologia",
    "MEDS-12/A - Tirocinio Neurologia",
    "MEDS-26/D - Scienze tecniche mediche e chirurgiche avanzate",
    "MEDS-19/B - Medicina Fisica e Riabilitativa",
    "MEDS-15/A - Neurochirurgia",
    "MEDS-15/A - Tirocinio Neurochirurgia",
    "MEDS-22/B - Neuroradiologia",
    "MEDS-26/C - Scienze delle professioni sanitarie e della riabilitazione",
    "INF-05/A - Sistemi di elaborazione delle informazioni",
  ],
  "diagnostica-immagini-radioterapia": [
    "MEDS-22/A - Diagnostica Per Immagini e Radioterapia",
    "MEDS-22/A - Tirocinio Diagnostica Per Immagini e Radioterapia",
    "MEDS-22/A - Diagnostica Per Immagini: Modulo Medicina Nucleare",
    "MEDS-22/A - Diagnostica per Immagini e Radioterapia: Modulo di Radioterapia",
  ],
  "apparato-locomotore": [
    "MEDS-19/A - Malattie dell'apparato locomotore",
    "MEDS-19/A - Malattie dell'apparato locomotore",
    "MEDS-19/A - Tirocinio Malattie dell'apparato locomotore",
    "MEDS-19/B - Medicina Fisica e Riabilitativa",
    "MEDS-19/B - Tirocinio Medicina Fisica e Riabilitativa",
    "MEDS-09/C - Reumatologia",
  ],
  "igiene-medicina-legale": [
    "MEDS-25/B - Medicina del lavoro",
    "MEDS-24/B - Igiene generale ed applicata",
    "MEDS-24/B - Tirocinio Igiene generale ed applicata",
    "MEDS-25/A - Tirocinio Medicina legale",
    "MEDS-25/A - Medicina legale",
  ],
  "diagnostica-malattie-infettive": [
    "BIOS-11/A - Farmacologia",
    "MEDS-03/A - Microbiologia e Microbiologia clinica",
    "MEDS-10/B - Malattie Infettive",
    "MEDS-10/B - Malattie Infettive",
    "MEDS-10/B - Tirocinio Malattie Infettive",
  ],
  "gineco-ostetricia": [
    "MEDS-21/A - Ginecologia e Ostetricia",
    "MEDS-21/A - Tirocinio Ginecologia e Ostetricia",
    "MEDS-24/C - Scienze Infermieristiche ostetrico-ginecologiche",
  ],

  // Clinica Integrata ed Emergenze
  "clinica-medica": [
    "MEDS-05/A - Medicina Interna",
    "MEDS-05/A - Tirocinio Medicina Interna",
    "MEDS-05/A - Medicina Interna: Modulo Geriatria",
    "MEDS-05/A - Medicina Interna: Modulo Geriatria",
    "MEDS-09/C - Reumatologia",
  ],
  "chirurgia-gen-specialistica": [
    "MEDS-06/A - Chirurgia generale",
    "MEDS-06/A - Chirurgia generale",
    "MEDS-06/A - Chirurgia generale",
    "MEDS-06/A - Tirocinio Chirurgia generale",
    "MEDS-06/A - Chirurgia generale",
  ],
  "anestesia-rianimazione": [
    "MEDS-23/A - Anestesiologia: Modulo Terapia Intensiva e Rianimazione",
    "MEDS-23/A - Anestesiologia: Modulo Terapia Intensiva e Rianimazione",
    "MEDS-23/A - Anestesiologia: Corso ACLS",
    "MEDS-23/A - Anestesiologia: Modulo Terapia del dolore",
  ],
  "medicina-territorio-management": [
    "MEDS-05/A - Medicina del Territorio",
    "MEDS-05/A - Medicina del Territorio",
    "MEDS-02/A - Storia della medicina (etica)",
    "ECON-06/A - Economia aziendale",
  ],
  "emergenze-med-chir": [
    "MEDS-06/A - Chirurgia generale: Modulo Emergenze chirurgiche",
    "MEDS-13/B - Chirurgia Vascolare",
    "MEDS-05/A - Medicina Interna: Modulo Medicina d'urgenza",
    "MEDS-19/A - Malattie App. Locomotore: Modulo di Traumatologia",
    "MEDS-24/C - Scienze infermieristiche d'urgenza",
  ],
  pediatria: [
    "MEDS-20/A - Pediatria Generale e specialistica",
    "MEDS-20/A - Tirocinio Pediatria Generale e specialistica",
    "MEDS-20/B - Neuropsichiatria Infantile",
    "MEDS-01/A - Genetica Medica",
  ],
};
