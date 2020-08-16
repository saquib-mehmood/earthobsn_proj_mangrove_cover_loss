// Mangrove Cover Loss in Karachi, Pakistan 1986-2020
// True Color
// Hansen etal. Water Masking (2015)
// NDVI Calculations
// NDWI Calculations

// Create geometry
var point = /* color: #d63000 */ee.Geometry.Point([67.05522087149494, 24.92092288197352]);


// Load Image Collections
var l5 = ee.ImageCollection('LANDSAT/LT05/C01/T1_TOA');
var l8 = ee.ImageCollection('LANDSAT/LC08/C01/T1_TOA');

// Spatial filtering
var l5Karachi = l5.filterBounds(point);
var l8Karachi = l8.filterBounds(point);

// temporal filtering
var l5Karachi1986 = l5Karachi.filterDate('1986-01-01', '1986-12-31');
var l5Karachi1999 = l5Karachi.filterDate('1999-01-01', '1999-12-31');
var l8Karachi2020 = l8Karachi.filterDate('2020-01-01', '2020-07-31');

// Determine size of collections

print(l5Karachi1986.size());
print(l5Karachi1999.size());
print(l8Karachi2020.size());

// sort to create a scene object from least to most cloudy
/* var sortedKarachi1999 = l5Karachi1999.sort('CLOUD_COVER');
var scene1999 = sortedKarachi1999.first();
var sortedKarachi2020 = l8Karachi2020.sort('CLOUD_COVER');
var scene2020 = sortedKarachi2020.first(); */

// Display RGB
/* Map.centerObject(scene2020, 9);
Map.addLayer(scene1999, {bands: ['B3', 'B2', 'B1'], max: 0.35}, 'true-color composite 1999'); */

// for landsat5, we have to specify 'B3', 'B2', and 'B1' for R, G, and B, respectively
// for landsat8, we have to specify 'B4', 'B3', and 'B2' for R, G, and B, respectively
// also need to provide min and max values suitable for displaying reflectance
var visParams5 = {bands: ['B3', 'B2', 'B1'], max: 0.35};
var visParams8 = {bands: ['B4', 'B3', 'B2'], max: 0.35};
/* Map.addLayer(scene2020, visParams, 'true-color composite 2020'); */

// Now, add layers with mean reflactance from collections using reducer

var median1986 = l5Karachi1986.median();
var median1999 = l5Karachi1999.median();
var median2020 = l8Karachi2020.median();
// Display median layers

Map.addLayer(median1986, visParams5, 'median 1986');
Map.addLayer(median1999, visParams5, 'median 1999');
Map.addLayer(median2020, visParams8, 'median 2020'); 

// False Colors
/*
Map.addLayer(median1986, visParams5, 'median false 1986');
Map.addLayer(median1999, visParams5, 'median false 1999');
Map.addLayer(median2020, visParams8, 'median false 2020'); */

// Masking
// Water mask based on Hansen etal. global forest chnge dataset
// water has a value of 2, land has the value 1, and 'no data' has the value 0.
// all the pixels in the median composite that are over land are visible, 
// but those over water (or nodata) are transparent

// Load Hansen et al. forest change dataset.
var hansenImage = ee.Image('UMD/hansen/global_forest_change_2015');
// Select the land/water mask. Will select the band datamask from hansenImage
var datamask = hansenImage.select('datamask');
// Create a binary mask.
var mask = datamask.eq(1);

// Update the composites mask with the water mask.
var maskedComposite1986 = median1986.updateMask(mask);
var maskedComposite1999 = median1999.updateMask(mask);
var maskedComposite2020 = median2020.updateMask(mask);

// display composites with water masks
/*
Map.addLayer(maskedComposite1986, visParams5, 'water mask 1986');
Map.addLayer(maskedComposite1999, visParams5, 'water mask 1999');
Map.addLayer(maskedComposite2020, visParams8, 'water mask 2020'); */

// Water mosaics to show water in uniform color

// Make a water image out of the mask.
// not() turns all the zeros into ones and all the non-zeros into zeros.
var water = mask.not();
// Mask water with itself to mask all the zeros (non-water).
// This results in an image in which all the water pixels are 1's and everything else is masked.
water = water.mask(water);

// Make image collection of visualization images.
// Order of images is important
var mosaic1986 = ee.ImageCollection([
  median1986.visualize(visParams5),
  water.visualize({palette: '000044'}),
]).mosaic();

var mosaic1999 = ee.ImageCollection([
  median1999.visualize(visParams5),
  water.visualize({palette: '000044'}),
]).mosaic();

var mosaic2020 = ee.ImageCollection([
  median2020.visualize(visParams8),
  water.visualize({palette: '000044'}),
]).mosaic();

// Display the mosaics.
/*Map.addLayer(mosaic1986, {}, '1986 mosaic');
Map.addLayer(mosaic1999, {}, '1999 mosaic');
Map.addLayer(mosaic2020, {}, '2020 mosaic');*/

// Now calculate the normalized differential vegetation index (ndvi) and name the band NDVI

var ndvi1986 = median1986.normalizedDifference(['B4', 'B3']).rename('NDVI');
var ndvi1999 = median1999.normalizedDifference(['B4', 'B3']).rename('NDVI');
var ndvi2020 = median2020.normalizedDifference(['B5', 'B4']).rename('NDVI');

/* We can also calculate NDVI directly:
// Compute the Normalized Difference Vegetation Index (NDVI).
var nir = image.select('B5');
var red = image.select('B4');
var ndvi = nir.subtract(red).divide(nir.add(red)).rename('NDVI'); */

// Display

var ndviParams = {min: -1, max: 1, palette: ['blue', 'white', 'green']};
/*Map.addLayer(ndvi1986, ndviParams, '1986 NDVI');
Map.addLayer(ndvi1999, ndviParams, '1999 NDVI');
Map.addLayer(ndvi2020, ndviParams, '2020 NDVI');*/

// Now calculate the normalized differential water index (ndwi) and name the band NDWI

var ndwi1986 = median1986.normalizedDifference(['B2', 'B4']).rename('NDWI');
var ndwi1999 = median1999.normalizedDifference(['B2', 'B4']).rename('NDWI');
var ndwi2020 = median2020.normalizedDifference(['B3', 'B5']).rename('NDWI');

// Display
// min and max parameters indicate the range of pixel values to which the palette should be applied. 
// Intermediate values are linearly stretched.
// Use palette colors from cyan (‘00FFFF’) to blue (‘0000FF’)

var ndwiParams = {min:-1, max: 1, palette: ['00FFFF', '0000FF']};

// Display 
/*
Map.addLayer(ndwi1986, ndwiParams, '1986 NDWI');
Map.addLayer(ndwi1999, ndwiParams, '1999 NDWI');
Map.addLayer(ndwi2020, ndwiParams, '2020 NDWI'); */


// Calculate the greenest pixel composite
// greenest pixel is the maximum value of ndvi of a pixel in a collection

// First create a function to add ndvi band to each image in collection

var addNDVIL5 = function(image) {
  var ndvi = image.normalizedDifference(['B4', 'B3']).rename('NDVI');
  return image.addBands(ndvi);
};

var addNDVIL8 = function(image) {
  var ndvi = image.normalizedDifference(['B5', 'B4']).rename('NDVI');
  return image.addBands(ndvi);
};
 // map function to image collections
 var withNDVI1986 = l5Karachi1986.map(addNDVIL5);
 var withNDVI1999 = l5Karachi1999.map(addNDVIL5);
 var withNDVI2020 = l8Karachi2020.map(addNDVIL8);
 
 // make a qualityMosaic of maximum NDVI pixels
 var greenest1986 = withNDVI1986.qualityMosaic('NDVI');
 var greenest1999 = withNDVI1999.qualityMosaic('NDVI');
 var greenest2020 = withNDVI2020.qualityMosaic('NDVI');

// Display
Map.centerObject(point, 9);
Map.addLayer(greenest1986, visParams5, 'Greenest Pixel Composite 1986');
Map.addLayer(greenest1999, visParams5, 'Greenest Pixel Composite 1999');
Map.addLayer(greenest2020, visParams8, 'Greenest Pixel Composite 2020');

// Create NDWI mask
var ndwiMask1986 = ndwi1986.updateMask(ndwi1986.gte(0.275));
var ndwiMask1999 = ndwi1999.updateMask(ndwi1999.gte(0.275));
var ndwiMask2020 = ndwi2020.updateMask(ndwi2020.gte(0.25));
// Display
Map.addLayer(ndwiMask1986, ndwiParams, '1986 NDWI Mask');
Map.addLayer(ndwiMask1999, ndwiParams, '1999 NDWI Mask');
Map.addLayer(ndwiMask2020, ndwiParams, '2020 NDWI Mask');

// Export images

// First make image visualization
var visMedian1986 =median1986.visualize(visParams5);
var visMedian1999 =median1999.visualize(visParams5);
var visMedian2020 =median2020.visualize(visParams8);

var visndvi1986 =ndvi1986.visualize(ndviParams);
var visndvi1999 =ndvi1989.visualize(ndviParams);
var visndvi2020 =ndvi1989.visualize(ndviParams);

var visndwi1986 =ndwi1986.visualize(ndwiParams);
var visndwi1999 =ndwi1999.visualize(ndwiParams);
var visndwi2020 =ndwi2020.visualize(ndwiParams);





// Create geometry

var roi = /* color: #98ff00 */ee.Geometry.Polygon(
        [[[66.83010054150253, 24.875093897961463],
          [66.9660563520494, 24.758548655605214],
          [67.06218672314316, 24.840827267825038],
          [66.93721724072128, 24.941730843699403]]]);
  
// Export
Export.image.toDrive({
  image: visMedian1986,
  description: 'median1986',
  scale: 30,
  region: roi
});

Export.image.toDrive({
  image: visMedian1999,
  description: 'median1999',
  scale: 30,
  region: roi
});

Export.image.toDrive({
  image: visMedian2020,
  description: 'median2020',
  scale: 30,
  region: roi
});

Export.image.toDrive({
  image: visndvi1986,
  description: 'ndvi1986',
  scale: 30,
  region: roi
});

Export.image.toDrive({
  image: visndvi1999,
  description: 'ndvi1999',
  scale: 30,
  region: roi
});


Export.image.toDrive({
  image: visndvi2020,
  description: 'ndwi2020',
  scale: 30,
  region: roi
});

Export.image.toDrive({
  image: visndwi1986,
  description: 'ndwi1986',
  scale: 30,
  region: roi
});

Export.image.toDrive({
  image: visndwi1999,
  description: 'ndwi1999',
  scale: 30,
  region: roi
});

Export.image.toDrive({
  image: visndwi2020,
  description: 'ndwi2020',
  scale: 30,
  region: roi
});
