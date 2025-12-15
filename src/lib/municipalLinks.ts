export const municipalLinks: Record<string, string> = {
  Vancouver: "https://maps.vancouver.ca/vanmap-viewer/",
  Burnaby: "https://gis.burnaby.ca/burnabymap/",
  Surrey: "https://cosmos.surrey.ca/external/",
  Richmond: "https://www.richmond.ca/services/maps.htm",
  Coquitlam: "https://www.coquitlam.ca/online-services/maps-gis",
  "District of North Vancouver": "https://geoweb.dnv.org/",
  "City of North Vancouver": "https://www.cnv.org/your-government/mapping-and-gis",
  "New Westminster": "https://www.newwestcity.ca/services/online-services/mapping",
  "Port Coquitlam": "https://www.portcoquitlam.ca/city-services/maps/",
  "Port Moody": "https://www.portmoody.ca/en/business-and-development/maps-and-gis.aspx",
  Delta: "https://delta.ca/services/maps-gis",
  "Langley City": "https://city.langley.bc.ca/city-services/maps-and-gis",
  "Township of Langley": "https://www.tol.ca/explore/township-maps/",
  "Maple Ridge": "https://www.mapleridge.ca/1377/Online-GIS-Map",
  "Pitt Meadows": "https://www.pittmeadows.ca/city-hall/maps-and-gis",
  "White Rock": "https://www.whiterockcity.ca/882/Maps"
};

const DEFAULT_MAP_LINK =
  "https://www2.gov.bc.ca/gov/content/data/geographic-data-services/web-based-mapping/imapbc";

export const getMunicipalLink = (name?: string) => {
  if (!name) return DEFAULT_MAP_LINK;
  const key = Object.keys(municipalLinks).find(
    (city) => city.toLowerCase() === name.toLowerCase()
  );
  return key ? municipalLinks[key] : DEFAULT_MAP_LINK;
};
