import { CityInfo } from "./types";

export const CITIES: Record<string, CityInfo> = {
  vancouver: { id: "vancouver", name: "Vancouver", province: "BC", zoningIndexPath: "/vancouver/zoning" },
  burnaby: { id: "burnaby", name: "Burnaby", province: "BC", zoningIndexPath: "/burnaby/zoning" },
  surrey: { id: "surrey", name: "Surrey", province: "BC", zoningIndexPath: "/surrey/zoning" }
};
