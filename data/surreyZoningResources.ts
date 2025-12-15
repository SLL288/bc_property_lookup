export type CityResource = {
  title: string;
  category: string;
  description: string;
  url: string;
};

export const SURREY_RESOURCES: CityResource[] = [
  {
    title: "COSMOS (official GIS viewer)",
    category: "Map / GIS",
    description: "City of Surrey COSMOS map with zoning and land use layers.",
    url: "https://cosmos.surrey.ca/external/"
  },
  {
    title: "Surrey zoning bylaw",
    category: "Bylaw",
    description: "Zoning Bylaw information for Surrey – verify permitted uses and regulations.",
    url: "https://www.surrey.ca/renovating-building-development/bylaws/zoning-bylaw"
  },
  {
    title: "Development applications (Surrey)",
    category: "Permits / Development",
    description: "Find and track Surrey development applications and permits.",
    url: "https://www.surrey.ca/renovating-building-development/development-applications"
  },
  {
    title: "Planning, building & development",
    category: "Permits / Development",
    description: "Surrey planning, building, and development resources and contacts.",
    url: "https://www.surrey.ca/renovating-building-development"
  }
];
