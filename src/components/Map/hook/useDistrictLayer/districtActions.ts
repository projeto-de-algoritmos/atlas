import * as turf from '@turf/turf';
import mapboxgl from 'mapbox-gl';

import { District } from '@customTypes/feature';

import { hoveredPopup, clickedPopup } from '../../const';

let clickedId: number | undefined;
let hoveredId: number | undefined;

type Feature = District | null;

function setFeatureClick(featureID: number, map: mapboxgl.Map, state: boolean) {
  map.setFeatureState({ source: 'district', id: featureID }, { click: state });
}

function setFeatureHover(featureID: number, map: mapboxgl.Map, state: boolean) {
  map.setFeatureState({ source: 'district', id: featureID }, { hover: state });
}

function addPopup(feature: Feature, map: mapboxgl.Map, type: string) {
  const coordinates = turf.centerOfMass(feature).geometry.coordinates;
  const regionName = feature?.properties?.NM_MUN;

  switch (type) {
    case 'hover':
      hoveredPopup.setLngLat([coordinates[0], coordinates[1]]).setHTML(`<h5>${regionName}</h5>`).addTo(map);
      break;
    case 'click':
      clickedPopup.setLngLat([coordinates[0], coordinates[1]]).setHTML(`<h5>${regionName}</h5>`).addTo(map);
      break;
  }
}

export function clickDistrict(feature: Feature, map: mapboxgl.Map) {
  const districtID = feature?.properties.CD_MUN;

  if (feature && feature.geometry && districtID) {
    if (districtID === clickedId) {
      return;
    }

    addPopup(feature, map, 'click');

    setFeatureClick(districtID, map, true);

    if (clickedId) {
      setFeatureClick(clickedId, map, false);
    }

    clickedId = districtID;
  } else {
    clickedPopup.remove();

    if (clickedId !== undefined) {
      if (map.getSource('district')) {
        setFeatureClick(clickedId, map, false);
      }
      clickedId = 0;
    }
  }
}

export function highlightDistrict(feature: Feature, map: mapboxgl.Map) {
  const districtID = feature?.properties.CD_MUN;

  if (feature && feature.geometry && districtID) {
    if (districtID === hoveredId) {
      return;
    }

    addPopup(feature, map, 'hover');

    if (hoveredId) {
      setFeatureHover(hoveredId, map, false);
    }

    setFeatureHover(districtID, map, true);
    hoveredId = districtID;
  } else if (hoveredId) {
    hoveredPopup.remove();

    if (map.getSource('district')) {
      setFeatureHover(hoveredId, map, false);
    }
    hoveredId = undefined;
  }
}

export function isDistrictLayerVisible(map: mapboxgl.Map, visible: boolean) {
  const visibility = visible ? 'visible' : 'none';

  if (map.getLayer('fill-district')) {
    map.setLayoutProperty('fill-district', 'visibility', visibility);
  }

  if (map.getLayer('district-borders')) {
    map.setLayoutProperty('district-borders', 'visibility', visibility);
  }
}

export function cleanDistrictActions() {
  hoveredPopup.remove();
  clickedPopup.remove();
  clickedId = 0;
  hoveredId = undefined;
}

export function fitDistrictBounds(feature: Feature, map: mapboxgl.Map) {
  if (feature && (feature.geometry || feature._geometry)) {
    const [minX, minY, maxX, maxY] = turf.bbox(feature);

    map.fitBounds(
      [
        [minX, minY],
        [maxX, maxY],
      ],
      {
        padding: { top: 200, bottom: 200, left: 550, right: 200 },
      },
    );
  }
}