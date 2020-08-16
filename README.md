# mangrove_cover_loss
Calculation of mangrove cover loss in Karachi, Pakistan from 1986 to 2020 using landsat8 and landsat 5 imagery and Google Earth Engine JavaScript API

### Source Code
JavaScript source code contained in mangroveCoverLossKarachi.js

## Images
A total of 56 images have been analyzed as under:
- 1986{ 1
- 1999: 29
- 2020: 26

1. median1986, median1999, median2020 - Composites of median values of every pixel of every image for the years 1986, 1999 and 2020
2. ndvi19866, ndvi1999, ndvi2020 - Normalized Difference Vegetation Index (NDVI) calculated from median images for each year.
3. ndwi1986, ndwi1999, ndwi2020 - Normalized Difference Water Index (NDWI) calculated from median images for each year.

## Explanation of Terms

1. Median: The median value of every pixel of every image of every year.
2. **NDVI**: A measure of vegetation calculated by NDVI = (Near Infrared - Red) / (Near Infrared + Red)
 - Low values (0-0.1) or negative values indicate no vegetation
 - 0.2 to 0.4 moderate vegetation.
 - >0.4 indicate thick vegetation.
 - Color Palette: Light blue to Cyan to green (Low to moderate to high vegetation)
3. **NDWI**: A measure of water or moisture content of the terrain.
- Low values (<0.25-0.3) indicate no water
- High Values (>0.25-0.3) indicate water
- Color Palette: Light blue to Cyan  no water, dark blue water

## Installation and Viewing Images
1.**Google Earth Pro and Google Earth Web**: File - import - [file]
for example: File - import - median1986.tif will open median1986.tif file
- Layers can be switched on and off from the layer manager window
- Layer tranparency can be controlled from the transparency control knob 

2. **Analysis in Google Earth Engine**
- Log in with google or gmail id
- Request access to google Earth Engine (EE)
- Copy and paste the code from 'mangroveCoverLossKarachi.js' in EE JavaScript API
- Layers can be switched on and off from layer manager
- Instantaneous values of reflectance, ndvi and ndwi can be inspected in the 'inspector' window and clicking on any portion of the image. 


## Created With:
Google Earth Engine JavaScript API

## Versioning 
git for versioning. For the versions available, see the github repository.

##Author
ClimateX Space Technologies

License This project is licensed under the MIT License - see the LICENSE.text file for details
