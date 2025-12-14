import dynamic from "next/dynamic";
import type { MapViewProps } from "./MapViewClient";

const LeafletMap = dynamic(() => import("./MapViewClient"), { ssr: false });

export function MapView(props: MapViewProps) {
  return <LeafletMap {...props} />;
}
