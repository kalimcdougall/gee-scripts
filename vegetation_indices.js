// Get a single Sentinel-2 image over the area of interest.
var S2_2021 = ee.Image(S2
.filterBounds(roi)
.filterDate('2021-06-15','2021-06-30')
.sort('CLOUD_COVERAGE_ASSESSMENT')
.first());
// Print the image to the console.
print('Sentinel 2 2021:', S2_2021);
// Define visualization parameters in a JavaScript dictionary.
var trueColor = {
bands: ['B4', 'B3', 'B2'],
min: 0,
max: 2000
};
//select Sentinel-2 bands to work with
var bands = ['B1', 'B2', 'B3', 'B4', 'B8', 'B11', 'B12'];
//SUBSET image via geometry 'sub' and name PR_2021
var sub=ee.Geometry.Polygon([[-124.47,48.46],[-124.20,48.46],[-124.20,48.67],[-124.47,48.67]]);
var PR_2021=(S2_2021.clip(sub))
.select(bands);
// Print the image to the console.
print('Sentinel Subset of Port Renfrew area 2021', PR_2021);
Map.addLayer(PR_2021, trueColor, 'Sentinel Subset');
Map.setCenter(-124.35, 48.62, 10); // centers map on the study area
//the first step is to define the endmember samples as variables
var series = {
    0: {color: '#d1341c'}, // bare
    1: {color: '#1dd61a'}, // veg
    2: {color: '#1734ff'}, // water
};
var plotOptions1 = {
  series: series,
};
// Define customization options.
var plotOptions1 = {
  title: 'Image band values for 3 regions',
  hAxis: {title: 'Wavelength (nanometers)'},
  vAxis: {title: 'Reflectance'},
  lineWidth: 2,
  pointSize: 4,
  series: series,
};
//Create spectral plots - Choose bands to include and define feature collection to use
var subset = PR_2021.select('B1','B2','B3','B4','B8','B11','B12');
var samples = ee.FeatureCollection([bare,veg,water]);
// Define a list of Sentinel wavelengths for X-axis labels.
var wavelengths = [444, 497,560,665,835,1614,2202];
// Create the chart and set options. 
var Chart1 = ui.Chart.image.regions( subset, samples, ee.Reducer.mean(), 10, 'label', wavelengths) .setChartType('ScatterChart') .setOptions(plotOptions1); 
// Display the chart. 
print(Chart1);
var bare = [682, 774, 893, 1140, 1865, 3123, 2066];
var veg = [155, 192, 459, 209, 2700, 1064, 442];
var water = [333, 300, 260, 175, 134, 122, 118];
// Determine the fractional contribution of the endmembers.
var fractions = PR_2021.unmix({endmembers:[bare, veg, water], sumToOne:true});
Map.addLayer(fractions, {min: 0, max: 1},
  'fractions (red=bare, green=veg, blue=water)');
/////////NDVI
var ndvi = PR_2021.expression(
  '((NIR-RED)/(NIR+RED))',{
    'NIR':PR_2021.select('B8'),
    'RED':PR_2021.select('B4')
  });
  print(ndvi);
  var vegPalette = ['white', 'green'];
  Map.addLayer(ndvi,{min: 0, max: 1, palette: vegPalette}, 'NDVI');
/////////NDWI
var ndwi = PR_2021.expression(
  '((NIR-SWIR1)/(NIR+SWIR1))',{
    'NIR':PR_2021.select('B8'),
    'SWIR1':PR_2021.select('B11')
  });
  print(ndwi);
  var wetPalette = ['blue', 'white'];
  Map.addLayer(ndwi,{min: 0, max: 1, palette: wetPalette}, 'NDWI');
/////////NRGI
var ngri = PR_2021.expression(
  '((GREEN-RED)/(GREEN+RED))',{
    'GREEN':PR_2021.select('B3'),
    'RED':PR_2021.select('B4')
  });
  print(ngri);
  var rgPalette = ['white', 'red'];
  Map.addLayer(ngri,{min: 0, max: 1, palette: rgPalette}, 'NGRI');
