import { Injectable } from '@angular/core';
import { toInteger } from '@ng-bootstrap/ng-bootstrap/util/util';

@Injectable()
export class MapCreatorService {

  public createMap(testStations: any, testLines: any, testConnections: any): any {
    // Define the size of the raster, the larger the higher the resolution
    const rasterWidth = 150;
    const rasterHeight = 150;
    // Convert the relevant data to the right format
    // TODO this is running on test data, do this with the real data
    const generatedStations = this.calcStations(testStations, rasterWidth, rasterHeight);
    const generatedLines = this.calcLines(generatedStations, testLines, testConnections, rasterWidth, rasterHeight);
    const generatedRiver = this.calcRiver(rasterWidth, rasterHeight);
    const generatedData = this.calcGraph(generatedStations, generatedLines, generatedRiver);
    return generatedData;
  }

  // Converts the station data from a given json to map format
  // JSON must look like testStations
  private calcStations(stations, rasterWidth, rasterHeight): any {
    // Variable initiation
    let counter = 0;
    let cumPosX = 0;
    let cumPosY = 0;
    let minX = 100;
    let maxX = 0;
    let minY = 100;
    let maxY = 0;
    // Transform Geocoords into map coords, store max and min
    for (const i in stations) {
      const pos = stations[i]['position'];
      const posX = (rasterWidth) * (180 + pos['lat']) / 360;
      const posY = (rasterHeight) * (90 - pos['lon']) / 180;
      maxX = posX > maxX ? posX : maxX;
      minX = posX < minX ? posX : minX;
      maxY = posY > maxY ? posY : maxY;
      minY = posY < minY ? posY : minY;
    }
    // This will be the data for all the stations that will be drawn and referenced later
    const stationDataPoints = {};
    // Clip Map to relevant area by max and min, calculate middle area
    for (const i in stations) {
      const pos = stations[i]['position'];
      let posX = (rasterWidth) * (180 + pos['lat']) / 360;
      let posY = (rasterHeight) * (90 - pos['lon']) / 180;
      posX = toInteger((posX - minX) * rasterWidth / (maxX - minX));
      posY = toInteger((posY - minY) * rasterHeight / (maxY - minY));
      stationDataPoints[i] = {};
      stationDataPoints[i]['title'] = stations[i]['title'];
      stationDataPoints[i]['coords'] = [posX, posY];
      cumPosX += posX;
      cumPosY += posY;
      counter ++;
    }
    // Calculate middle area, not needed now but in the future
    // cumPosX /= counter;
    // cumPosY /= counter;
    return stationDataPoints;
  }

  // Converts the connection data from a given json to map format
  // JSONs for connections, lines and Stations must look like testLines and testConnections
  private calcLines(stationDataPoints, lines, connections, rasterWidth, rasterHeight): any {
    // This will be the line points which will be drawn
    const lineDataPoints = [];
    // Counts up which line we are, for correct offsets
    let linecounter = 0;
    // This iterates through the connections
    for (const i in connections) {
      debugger;
      // Gather relevant info for the current line, this will be drawn
      const currentLine = {
        'name': lines[i].id,
        'label': i,
        'color': lines[i].color,
        'shiftCoords': [linecounter, linecounter]
      };
      // This will be used to store all the subsections
      const nodes = [];

      let lastCoords = null;
      let lastDir = null;

      // Iterate over all stops
      for (const j in connections[i]) {
        // Get all relevant data
        const coords = stationDataPoints[connections[i][j].station].coords;
        const name = connections[i][j].station;
        let curDir;
        let labelPos;
        // Only update the directions starting from the second station
        if (lastCoords != null) {
          switch (lastDir) {
            case 'N':
              if (lastCoords[0] > coords[0]) {
                curDir = 'W';
              } else {
                curDir = 'E';
              }
              break;
            case 'S':
              if (lastCoords[0] > coords[0]) {
                curDir = 'W';
              } else {
                curDir = 'E';
              }
              break;
            case 'E':
              if (lastCoords[1] > coords[1]) {
                curDir = 'S';
              } else {
                curDir = 'N';
              }
              break;
            case 'W':
              if (lastCoords[1] > coords[1]) {
                curDir = 'S';
              } else {
                curDir = 'N';
              }
              break;
            default:
              if (Math.abs(lastCoords[0] - coords[0]) > Math.abs(lastCoords[1] - coords[1])) {
                // More horizontal movement
                if (lastCoords[0] > coords[0]) {
                  curDir = 'W';
                } else {
                  curDir = 'E';
                }
              } else {
                // More vertical movement
                if (lastCoords[1] > coords[1]) {
                  curDir = 'S';
                } else {
                  curDir = 'N';
                }
              }
              break;
          }
        }
        // Update Label Position
        switch (curDir) {
          case 'N':
          case 'S':
            labelPos = 'E';
            break;
          case 'E':
          case 'W':
            labelPos = 'S';
            break;
          default:
            labelPos = 'N';
        }
        const shiftCoords = [linecounter, linecounter];

        // Insert optional betweenpoint
        if (lastCoords != null) {
          // if lastDir was not set, set it here --> orthogonal to the current dir
          if (lastDir == null) {
            if (Math.abs(lastCoords[0] - coords[0]) < Math.abs(lastCoords[1] - coords[1])) {
              // More horizontal movement
              if (lastCoords[0] > coords[0]) {
                lastDir = 'W';
              } else {
                lastDir = 'E';
              }
            } else {
              // More vertical movement
              if (lastCoords[1] > coords[1]) {
                lastDir = 'S';
              } else {
                lastDir = 'N';
              }
            }
          }
          // Calculate the betweenpoint coordinates, so there is a nice curve
          let betweencoords1;
          let betweencoords2;
          if (lastDir === 'N') {
            betweencoords1 = [lastCoords[0], coords[1] - 1];
          } else if (lastDir === 'S') {
            betweencoords1 = [lastCoords[0], coords[1] + 1];
          } else if (lastDir === 'E') {
            betweencoords1 = [coords[0] - 1, lastCoords[1]];
          } else if (lastDir === 'W') {
            betweencoords1 = [coords[0] + 1, lastCoords[1]];
          }
          // Set coordinates of the second point
          if (curDir === 'N') {
            betweencoords2 = [coords[0], lastCoords[1] + 1];
          } else if (curDir === 'S') {
            betweencoords2 = [coords[0], lastCoords[1] - 1];
          } else if (curDir === 'E') {
            betweencoords2 = [lastCoords[0] + 1, coords[1]];
          } else if (curDir === 'W') {
            betweencoords2 = [lastCoords[0] - 1, coords[1]];
          }
          // Create current between node
          const betweenNode1 = {
            'coords': betweencoords1,
            'shiftCoords': shiftCoords
          };
          const betweenNode2 = {
            'coords': betweencoords2,
            'shiftCoords': shiftCoords,
            'dir': lastDir
          };
          // Insert node into the final array
          nodes.push(betweenNode1);
          nodes.push(betweenNode2);
        }
        // Store current coords and dir for next iteration
        lastCoords = coords;
        lastDir = curDir;

        let currShiftCoords;
        if (curDir === 'N' || curDir === 'S') {
          currShiftCoords = [shiftCoords[0], 0];
        } else {
          currShiftCoords = [0, shiftCoords[1]];
        }
        // Create current station node
        const currentStationNode = {
          'coords': coords,
          'name': name,
          'labelPos': labelPos,
          'shiftCoords': currShiftCoords,
          // "marker": "interchange",
          'canonical': true
        };
        // Insert node into the final array
        nodes.push(currentStationNode);
        // Just important for the end parts, insert points to elongate
        const currentStationPositionNode = {
          'coords': [coords[0] - currShiftCoords[1], coords[1] -  currShiftCoords[0]]
        };
        nodes.push(currentStationPositionNode);
      }
      // Insert the stops into the line
      currentLine['nodes'] = nodes;
      // Insert the line into the list of all lines
      lineDataPoints.push(currentLine);

      linecounter ++;
    }
    return lineDataPoints;
  }

  // d3-tube-map crashes if there is no river object
  // so we just create one and place it outside of the shown part of the map
  private calcRiver(rasterWidth, rasterHeight): any {
    return {
      'name': 'River',
      'label': 'River',
      'shiftCoords': [-1000000, -1000000],
      'nodes': [{
        'coords': [0, 0]
      }, {
        'coords': [0, rasterHeight / 2]
      }, {
        'coords': [1, rasterHeight / 2 + 2]
      }, {
        'coords': [rasterWidth / 2 - 2, rasterHeight - 1]
      }, {
        'coords': [rasterWidth / 2, rasterHeight]
      }, {
        'coords': [rasterWidth, rasterHeight]
      }]
    };
  }

  // Creates a JSON parsable by the plugin from the stations line and river data given
  private calcGraph(stationDataPoints, lineDataPoints, riverDataPoints): any {
    // Create return object of right format
    const result = {
      'stations' : stationDataPoints,
      'lines' : lineDataPoints,
      'river' : riverDataPoints
    };
    return result;
  }
}
