import { Feature } from "@store/contexts/featuresContext";

export function getSortedFeatures(features: Feature[]) {
  return features.sort((a: any, b: any) =>
    a?.properties.NM_MUN.localeCompare(b?.properties.NM_MUN)
  );
}

export function getFilteredFeatures(features: Feature[], query: string) {
  return features.filter(
    (item: any) =>
      item?.properties.NM_MUN.toLowerCase().indexOf(query.toLowerCase()) !== -1
  );
}
