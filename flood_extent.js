// Flood extent, NDWI & NDMI for May 2020

var im1_2020 = ee.Image(sent2_1C
.filterDate("2020-05-03", "2020-05-10")
.filterBounds(PAD_point1)
.sort("CLOUD_COVERAGE_ASSESSMENT")
.first());
print("2020 Image 1:", im1_2020);

var im2_2020 = ee.Image(sent2_1C
.filterDate("2020-05-03", "2020-05-10")
.filterBounds(PAD_point2)
.sort("CLOUD_COVERAGE_ASSESSMENT")
.first());
print("2020 Image 2:", im2_2020);

var combined_2020 = ee.ImageCollection([im1_2020, im2_2020]).mosaic();
print("2020 Flood Extent:", combined_2020);

Map.addLayer(combined_2020, {bands:['B4','B3','B2'], min:0, max:3000}, "2020 true colour");
Map.addLayer(combined_2020, {bands:['B8','B12','B4'], min:0, max:3000}, "2020 land/water");
Map.addLayer(combined_2020, {bands:['B11'], min:0, max:3000}, "2020 SWIR");
Map.addLayer(combined_2020, {bands:['B8'], min:0, max:3000}, "2020 NIR");

var NDWI_2020 = combined_2020.expression(
  "(Green - NIR) / (Green + NIR)",
  {
    Green: combined_2020.select("B3"),
    NIR: combined_2020.select("B8")
  });
Map.addLayer(NDWI_2020, {min:0, max:1}, "2020 NDWI");

var NDMI_2020 = combined_2020.expression(
  "(NIR - SWIR) / (NIR + SWIR)",
  {
    NIR: combined_2020.select("B8"),
    SWIR: combined_2020.select("B11"),
  });
Map.addLayer(NDMI_2020, {min:0, max:1}, "2020 NDMI");

// Flood extent, NDWI & NDMI for Sept 2017

var im1_2017 = ee.Image(sent2_1C
.filterDate("2017-05-01", "2017-05-15")
.filterBounds(PAD_point1)
.sort("CLOUD_COVERAGE_ASSESSMENT")
.first());
print("2017 Image 1:", im1_2017);

var im2_2017 = ee.Image(sent2_1C
.filterDate("2017-05-01", "2017-05-15")
.filterBounds(PAD_point2)
.sort("CLOUD_COVERAGE_ASSESSMENT")
.first());
print("2017 Image 2:", im2_2017);

var combined_2017 = ee.ImageCollection([im1_2017, im2_2017]).mosaic();
print("2017 Flood Extent:", combined_2017);

Map.addLayer(combined_2017, {bands:['B4','B3','B2'], min:0, max:3000}, "2017 true colour");
Map.addLayer(combined_2017, {bands:['B8','B12','B4'], min:0, max:3000}, "2017 land/water");
Map.addLayer(combined_2017, {bands:['B11'], min:0, max:3000}, "2017 SWIR");
Map.addLayer(combined_2017, {bands:['B8'], min:0, max:3000}, "2017 NIR");

var NDWI_2017 = combined_2017.expression(
  "(Green - NIR) / (Green + NIR)",
  {
    Green: combined_2017.select("B3"),
    NIR: combined_2017.select("B8"),
  });
Map.addLayer(NDWI_2017, {min:0, max:1}, "2017 NDWI");

var NDMI_2017 = combined_2017.expression(
  "(NIR - SWIR) / (NIR + SWIR)",
  {
    NIR: combined_2017.select("B8"),
    SWIR: combined_2017.select("B11"),
  });
Map.addLayer(NDMI_2017, {min:0, max:1}, "2017 NDMI");

// Terrain & hillshade

var dem = ee.Image(srtm);
var demVis = {bands: 'elevation', min:200, max:250};
var geometry = ee.Geometry.BBox(-112.7, 59.1, -110.7, 58.1);
var clipdem = dem.clip(PAD_polygon);
Map.addLayer(clipdem, demVis, "DEM");

var hillshade = ee.Terrain.hillshade(clipdem);
Map.addLayer(hillshade, {min:0, max:255}, "Hillshade");

// Export DEM

var projection = clipdem.select('elevation').projection().getInfo();

Export.image.toDrive({
  image: clipdem,
  description: "Clipped PAD DEM",
  crs: projection.crs,
  crsTransform: projection.transform,
  region: PAD_polygon
});
