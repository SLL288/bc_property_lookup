export type VancouverZone = {
  code: string;
  group: string;
  label: string;
  officialPdf?: string;
  libraryUrl: string;
  mapUrl: string;
};

const LIBRARY = "https://vancouver.ca/home-property-development/zoning-and-land-use-policies-document-library.aspx";
const MAP = "https://maps.vancouver.ca/zoning/";

export const VANCOUVER_ZONES: VancouverZone[] = [
  {
    code: "R1-1",
    group: "Residential Inclusive",
    label: "Residential Inclusive District",
    officialPdf: "https://bylaws.vancouver.ca/zoning/zoning-by-law-district-schedule-r1-1.pdf",
    libraryUrl: LIBRARY,
    mapUrl: MAP
  },
  {
    code: "RT-1",
    group: "Two-Family / Infill",
    label: "Two-Family Dwelling District",
    officialPdf: "https://bylaws.vancouver.ca/zoning/zoning-by-law-district-schedule-rt-1.pdf",
    libraryUrl: LIBRARY,
    mapUrl: MAP
  },
  {
    code: "RT-2",
    group: "Two-Family / Infill",
    label: "Two-Family Dwelling District",
    officialPdf: "https://bylaws.vancouver.ca/zoning/zoning-by-law-district-schedule-rt-2.pdf",
    libraryUrl: LIBRARY,
    mapUrl: MAP
  },
  {
    code: "RT-3",
    group: "Two-Family / Infill",
    label: "Two-Family Dwelling District",
    officialPdf: "https://bylaws.vancouver.ca/zoning/zoning-by-law-district-schedule-rt-3.pdf",
    libraryUrl: LIBRARY,
    mapUrl: MAP
  },
  {
    code: "RT-4",
    group: "Two-Family / Infill",
    label: "Two-Family Dwelling District",
    officialPdf: "https://bylaws.vancouver.ca/zoning/zoning-by-law-district-schedule-rt-4.pdf",
    libraryUrl: LIBRARY,
    mapUrl: MAP
  },
  {
    code: "RT-5",
    group: "Two-Family / Infill",
    label: "Two-Family Dwelling District",
    officialPdf: "https://bylaws.vancouver.ca/zoning/zoning-by-law-district-schedule-rt-5.pdf",
    libraryUrl: LIBRARY,
    mapUrl: MAP
  },
  {
    code: "RT-6",
    group: "Two-Family / Infill",
    label: "Two-Family Dwelling District",
    officialPdf: "https://bylaws.vancouver.ca/zoning/zoning-by-law-district-schedule-rt-6.pdf",
    libraryUrl: LIBRARY,
    mapUrl: MAP
  },
  {
    code: "RT-7",
    group: "Two-Family / Infill",
    label: "Two-Family Dwelling District",
    officialPdf: "https://bylaws.vancouver.ca/zoning/zoning-by-law-district-schedule-rt-7.pdf",
    libraryUrl: LIBRARY,
    mapUrl: MAP
  },
  {
    code: "RT-8",
    group: "Two-Family / Infill",
    label: "Two-Family Dwelling District",
    officialPdf: "https://bylaws.vancouver.ca/zoning/zoning-by-law-district-schedule-rt-8.pdf",
    libraryUrl: LIBRARY,
    mapUrl: MAP
  },
  {
    code: "RT-9",
    group: "Two-Family / Infill",
    label: "Two-Family Dwelling District",
    officialPdf: "https://bylaws.vancouver.ca/zoning/zoning-by-law-district-schedule-rt-9.pdf",
    libraryUrl: LIBRARY,
    mapUrl: MAP
  },
  {
    code: "RT-10",
    group: "Two-Family / Infill",
    label: "Two-Family Dwelling District",
    officialPdf: "https://bylaws.vancouver.ca/zoning/zoning-by-law-district-schedule-rt-10.pdf",
    libraryUrl: LIBRARY,
    mapUrl: MAP
  },
  {
    code: "RT-11",
    group: "Two-Family / Infill",
    label: "Two-Family Dwelling District",
    officialPdf: "https://bylaws.vancouver.ca/zoning/zoning-by-law-district-schedule-rt-11.pdf",
    libraryUrl: LIBRARY,
    mapUrl: MAP
  },
  {
    code: "RM-1",
    group: "Multiple Dwelling",
    label: "Multiple Dwelling District",
    officialPdf: "https://bylaws.vancouver.ca/zoning/zoning-by-law-district-schedule-rm-1.pdf",
    libraryUrl: LIBRARY,
    mapUrl: MAP
  },
  {
    code: "RM-2",
    group: "Multiple Dwelling",
    label: "Multiple Dwelling District",
    officialPdf: "https://bylaws.vancouver.ca/zoning/zoning-by-law-district-schedule-rm-2.pdf",
    libraryUrl: LIBRARY,
    mapUrl: MAP
  },
  {
    code: "RM-3",
    group: "Multiple Dwelling",
    label: "Multiple Dwelling District",
    officialPdf: "https://bylaws.vancouver.ca/zoning/zoning-by-law-district-schedule-rm-3.pdf",
    libraryUrl: LIBRARY,
    mapUrl: MAP
  },
  {
    code: "RM-4",
    group: "Multiple Dwelling",
    label: "Multiple Dwelling District",
    officialPdf: "https://bylaws.vancouver.ca/zoning/zoning-by-law-district-schedule-rm-4.pdf",
    libraryUrl: LIBRARY,
    mapUrl: MAP
  },
  {
    code: "RM-5",
    group: "Multiple Dwelling",
    label: "Multiple Dwelling District",
    officialPdf: "https://bylaws.vancouver.ca/zoning/zoning-by-law-district-schedule-rm-5.pdf",
    libraryUrl: LIBRARY,
    mapUrl: MAP
  },
  {
    code: "RM-6",
    group: "Multiple Dwelling",
    label: "Multiple Dwelling District",
    officialPdf: "https://bylaws.vancouver.ca/zoning/zoning-by-law-district-schedule-rm-6.pdf",
    libraryUrl: LIBRARY,
    mapUrl: MAP
  },
  {
    code: "C-1",
    group: "Commercial",
    label: "Commercial District",
    officialPdf: "https://bylaws.vancouver.ca/zoning/zoning-by-law-district-schedule-c-1.pdf",
    libraryUrl: LIBRARY,
    mapUrl: MAP
  },
  {
    code: "C-2",
    group: "Commercial",
    label: "Commercial District",
    officialPdf: "https://bylaws.vancouver.ca/zoning/zoning-by-law-district-schedule-c-2.pdf",
    libraryUrl: LIBRARY,
    mapUrl: MAP
  },
  {
    code: "FC-1",
    group: "False Creek",
    label: "False Creek District",
    officialPdf: "https://bylaws.vancouver.ca/zoning/zoning-by-law-district-schedule-fc-1.pdf",
    libraryUrl: LIBRARY,
    mapUrl: MAP
  },
  {
    code: "RR-1",
    group: "Rental/Residential",
    label: "Residential Rental District",
    officialPdf: "https://bylaws.vancouver.ca/zoning/zoning-by-law-district-schedule-rr-1.pdf",
    libraryUrl: LIBRARY,
    mapUrl: MAP
  },
  {
    code: "RR-2A",
    group: "Rental/Residential",
    label: "Residential Rental District",
    officialPdf: "https://bylaws.vancouver.ca/zoning/zoning-by-law-district-schedule-rr-2a.pdf",
    libraryUrl: LIBRARY,
    mapUrl: MAP
  },
  {
    code: "I-1",
    group: "Industrial",
    label: "Industrial District",
    officialPdf: "https://bylaws.vancouver.ca/zoning/zoning-by-law-district-schedule-i-1.pdf",
    libraryUrl: LIBRARY,
    mapUrl: MAP
  },
  {
    code: "I-2",
    group: "Industrial",
    label: "Industrial District",
    officialPdf: "https://bylaws.vancouver.ca/zoning/zoning-by-law-district-schedule-i-2.pdf",
    libraryUrl: LIBRARY,
    mapUrl: MAP
  }
];
