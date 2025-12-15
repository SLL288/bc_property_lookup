export type CityResource = {
  title: string;
  category: string;
  description: string;
  url: string;
};

export const BURNABY_RESOURCES: CityResource[] = [
  {
    title: "BurnabyMap (official GIS viewer)",
    category: "Map / GIS",
    description: "Official City of Burnaby web map with zoning and property layers.",
    url: "https://gis.burnaby.ca/burnabymap/"
  },
  {
    title: "Zoning bylaw (Burnaby)",
    category: "Bylaw",
    description: "Burnaby Zoning Bylaw – verify permitted uses, density, and regulations.",
    url: "https://www.burnaby.ca/our-city/bylaws/zoning-bylaw"
  },
  {
    title: "Planning & development services",
    category: "Permits / Development",
    description: "Planning and building services, permits, and development information.",
    url: "https://www.burnaby.ca/planning-and-building/services"
  },
  {
    title: "Development and building homepage",
    category: "Permits / Development",
    description: "Burnaby development and building information, applications, and guides.",
    url: "https://www.burnaby.ca/development-and-building"
  }
];
