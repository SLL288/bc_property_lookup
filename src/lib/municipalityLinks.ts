export const municipalityLinks: Record<
  string,
  {
    name: string;
    zoningMapUrl: string;
    zoningBylawUrl?: string;
    propertyInfoUrl?: string;
    developmentAppsUrl?: string;
  }
> = {
  burnaby: {
    name: "Burnaby",
    zoningMapUrl: "https://gis.burnaby.ca/burnabymap/",
    zoningBylawUrl: "https://www.burnaby.ca/your-community/about-burnaby/bylaws/zoning-bylaw",
    propertyInfoUrl: "https://www.burnaby.ca/development-and-building/land-use-and-development",
    developmentAppsUrl: "https://burnaby.maps.arcgis.com/apps/webappviewer/index.html?id=9f35f63f5f7042728e495f1b60d97bb5"
  },
  vancouver: {
    name: "Vancouver",
    zoningMapUrl: "https://maps.vancouver.ca/zoning/",
    zoningBylawUrl: "https://vancouver.ca/home-property-development/zoning-and-development-bylaw.aspx",
    propertyInfoUrl: "https://vancouver.ca/home-property-development/get-information-on-a-property.aspx",
    developmentAppsUrl: "https://vancouver.ca/home-property-development/find-a-development-application-or-permit.aspx"
  },
  surrey: {
    name: "Surrey",
    zoningMapUrl: "https://cosmos.surrey.ca/external/",
    zoningBylawUrl: "https://www.surrey.ca/sites/default/files/bylaws/BYL_Zoning_12000.pdf",
    propertyInfoUrl: "https://www.surrey.ca/services-payments/property-and-development",
    developmentAppsUrl: "https://www.surrey.ca/services-payments/development-consideration"
  },
  richmond: {
    name: "Richmond",
    zoningMapUrl: "https://citymap2.richmond.ca/",
    zoningBylawUrl: "https://www.richmond.ca/__shared/assets/414_zoning412.pdf",
    propertyInfoUrl: "https://www.richmond.ca/plandev/zoning/about.htm",
    developmentAppsUrl: "https://www.richmond.ca/plandev/development/active-applications.htm"
  }
};

export const getMunicipalityLinks = (key: string) => {
  const normalized = key.toLowerCase();
  return municipalityLinks[normalized];
};
