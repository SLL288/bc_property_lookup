type OcpSource = {
  city: "burnaby" | "surrey" | "vancouver";
  serviceUrl?: string;
  layerId?: number;
  officialUrl: string;
  label: string;
  fieldMap?: {
    designation: string[];
    communityPlan?: string[];
  };
};

const SOURCES: Record<OcpSource["city"], OcpSource> = {
  burnaby: {
    city: "burnaby",
    serviceUrl: "https://gis.burnaby.ca/arcgis/rest/services/BurnabyMap/BBY_PUBLIC_TOC/MapServer",
    layerId: 45,
    officialUrl: "https://www.burnaby.ca/our-city/official-community-plan",
    label: "OCP designation",
    fieldMap: {
      designation: ["DESIGNATION"],
      communityPlan: ["COMMUNITY_PLAN"]
    }
  },
  surrey: {
    city: "surrey",
    serviceUrl: "https://gisservices.surrey.ca/arcgis/rest/services/OpenData/MapServer",
    layerId: 237,
    officialUrl: "https://www.surrey.ca/city-government/bylaws/official-community-plan",
    label: "OCP designation",
    fieldMap: {
      designation: ["LAND_USE"],
      communityPlan: ["OCP_ID"]
    }
  },
  vancouver: {
    city: "vancouver",
    officialUrl: "https://vancouver.ca/home-property-development/official-development-plans.aspx",
    label: "Official plans (links only)"
  }
};

export function getOcpSource(city: OcpSource["city"]): OcpSource {
  return SOURCES[city];
}
