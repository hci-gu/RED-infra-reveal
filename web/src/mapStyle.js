const MAX_ZOOM_LEVEL = 5

export const heatmapLayer = {
  maxzoom: 0,
  type: 'heatmap',
  paint: {
    // Increase the heatmap weight based on frequency and property magnitude
    // 'heatmap-weight': ['interpolate', ['linear'], ['get', 'mag'], 0, 0, 6, 1],
    // Increase the heatmap color weight weight by zoom level
    // heatmap-intensity is a multiplier on top of heatmap-weight
    'heatmap-intensity': 0.25,
    // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
    // Begin color ramp at 0-stop with a 0-transparancy color
    // to create a blur-like effect.
    'heatmap-color': [
      'interpolate',
      ['linear'],
      ['heatmap-density'],
      0,
      'rgba(33,102,172,0)',
      0.2,
      'rgb(103,169,207)',
      0.4,
      'rgb(209,229,240)',
      0.6,
      'rgb(253,219,199)',
      0.8,
      'rgb(239,138,98)',
      1.0,
      'rgb(255,201,101)',
    ],
    // Adjust the heatmap radius by zoom level
    'heatmap-radius': 40,
    // Transition from heatmap to circle layer by zoom level
    'heatmap-opacity': 0.7,
  },
}