import { ZoningItem } from "./types";

const MAP = "https://cosmos.surrey.ca/external/";
const BYLAW = "https://www.surrey.ca/renovating-building-development/bylaws/zoning-bylaw";
const PDF = "https://www.surrey.ca/sites/default/files/bylaws/BYL_Zoning_12000.pdf";

// Starter set using shared PDF with page anchors
export const SURREY_ZONING: ZoningItem[] = [
  {
    city: "surrey",
    code: "ra",
    displayCode: "RA",
    name: "Acreage Residential Zone",
    category: "Residential",
    family: "R",
    mapUrl: MAP,
    pdfUrl: `${PDF}#page=100`,
    pdfPage: 100,
    bylawUrl: BYLAW,
    hubUrl: BYLAW,
    lastVerified: "2025-12-15"
  },
  {
    city: "surrey",
    code: "r1",
    displayCode: "R1",
    name: "Single Family Residential Zone",
    category: "Residential",
    family: "R",
    mapUrl: MAP,
    pdfUrl: `${PDF}#page=113`,
    pdfPage: 113,
    bylawUrl: BYLAW,
    hubUrl: BYLAW,
    lastVerified: "2025-12-15"
  },
  {
    city: "surrey",
    code: "r2",
    displayCode: "R2",
    name: "Single Family Residential Zone",
    category: "Residential",
    family: "R",
    mapUrl: MAP,
    pdfUrl: `${PDF}#page=123`,
    pdfPage: 123,
    bylawUrl: BYLAW,
    hubUrl: BYLAW,
    lastVerified: "2025-12-15"
  },
  {
    city: "surrey",
    code: "r3",
    displayCode: "R3",
    name: "Residential Zone",
    category: "Residential",
    family: "R",
    mapUrl: MAP,
    pdfUrl: `${PDF}#page=145`,
    pdfPage: 145,
    bylawUrl: BYLAW,
    hubUrl: BYLAW,
    lastVerified: "2025-12-15"
  },
  {
    city: "surrey",
    code: "r4",
    displayCode: "R4",
    name: "Residential Zone",
    category: "Residential",
    family: "R",
    mapUrl: MAP,
    pdfUrl: `${PDF}#page=155`,
    pdfPage: 155,
    bylawUrl: BYLAW,
    hubUrl: BYLAW,
    lastVerified: "2025-12-15"
  },
  {
    city: "surrey",
    code: "r5",
    displayCode: "R5",
    name: "Residential Zone",
    category: "Residential",
    family: "R",
    mapUrl: MAP,
    pdfUrl: `${PDF}#page=166`,
    pdfPage: 166,
    bylawUrl: BYLAW,
    hubUrl: BYLAW,
    lastVerified: "2025-12-15"
  },
  {
    city: "surrey",
    code: "r6",
    displayCode: "R6",
    name: "Residential Zone",
    category: "Residential",
    family: "R",
    mapUrl: MAP,
    pdfUrl: `${PDF}#page=182`,
    pdfPage: 182,
    bylawUrl: BYLAW,
    hubUrl: BYLAW,
    lastVerified: "2025-12-15"
  }
];
