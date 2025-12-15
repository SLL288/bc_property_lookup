export type CityId = "vancouver" | "burnaby" | "surrey";

export type CityInfo = {
  id: CityId;
  name: string;
  province: "BC";
  zoningIndexPath: string;
};

export type ZoningItem = {
  city: CityId;
  code: string; // lowercase slug
  displayCode: string;
  name: string;
  category: string;
  family?: string;
  shortName?: string;
  pdfUrl?: string | null;
  pdfPage?: number | null;
  bylawUrl?: string | null;
  hubUrl?: string;
  mapUrl: string;
  lastVerified?: string;
};
