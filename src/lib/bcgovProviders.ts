import { arcgisQueryByPoint } from "./arcgis";

const CADASTRE_BASE = "https://delivery.maps.gov.bc.ca/arcgis/rest/services/whse/bcgw_pub_whse_cadastre/MapServer";
const LEGAL_BASE =
  "https://delivery.maps.gov.bc.ca/arcgis/rest/services/whse/bcgw_pub_whse_legal_admin_boundaries/MapServer";
const WATER_BASE =
  "https://delivery.maps.gov.bc.ca/arcgis/rest/services/whse/bcgw_pub_whse_water_management/MapServer";

export async function getPidByPoint(lat: number, lng: number) {
  return arcgisQueryByPoint({
    baseUrl: CADASTRE_BASE,
    layerId: 1,
    lat,
    lng,
    outFields: ["PID", "PID_FORMATTED", "PID_NUMBER", "PARCEL_NAME", "PARCEL_STATUS", "PARCEL_CLASS"],
    resultRecordCount: 1,
    returnGeometry: false
  });
}

export async function getAlrStatusByPoint(lat: number, lng: number) {
  const { attributes, raw } = await arcgisQueryByPoint({
    baseUrl: LEGAL_BASE,
    layerId: 23,
    lat,
    lng,
    outFields: ["*"],
    resultRecordCount: 1
  });
  return {
    insideAlr: Boolean(attributes),
    status: attributes ? (attributes as any).ALR_STATUS ?? undefined : undefined,
    source: "Province of BC",
    raw
  };
}

export async function getMunicipalityByPoint(lat: number, lng: number) {
  return arcgisQueryByPoint({
    baseUrl: LEGAL_BASE,
    layerId: 18,
    lat,
    lng,
    outFields: ["*"],
    resultRecordCount: 1
  });
}

export async function getRegionalDistrictByPoint(lat: number, lng: number) {
  return arcgisQueryByPoint({
    baseUrl: LEGAL_BASE,
    layerId: 16,
    lat,
    lng,
    outFields: ["*"],
    resultRecordCount: 1
  });
}

export async function getFloodplainIndexByPoint(lat: number, lng: number) {
  const { attributes, raw, geometry } = await arcgisQueryByPoint({
    baseUrl: WATER_BASE,
    layerId: 37,
    lat,
    lng,
    outFields: ["*"],
    resultRecordCount: 1,
    returnGeometry: true
  });
  return {
    hasMappedFloodplainStudy: Boolean(attributes),
    projectName: attributes ? (attributes as any).PROJECT_NAME ?? undefined : undefined,
    reportUrl: attributes ? (attributes as any).LINK ?? undefined : undefined,
    geometry,
    raw
  };
}
