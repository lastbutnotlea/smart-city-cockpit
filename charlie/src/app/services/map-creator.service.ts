import { Injectable } from '@angular/core';
import { toInteger } from '@ng-bootstrap/ng-bootstrap/util/util';

@Injectable()
export class MapCreatorService {

  private minX: number;
  private maxX: number;
  private minY: number;
  private maxY: number;

  private rasterWidth: number;
  private rasterHeight: number;

  private lastCoords = null;
  private lastDir = null;

  public createMap(stationData: any, lineData: any, connectionData: any): any {
    // Define the size of the raster, the larger the higher the resolution
    this.rasterWidth = 150;
    this.rasterHeight = 150;
    // Convert the relevant data to the right format
    const generatedStations = this.calcStations(stationData);
    const generatedLines = this.calcLines(generatedStations, lineData, connectionData);
    const generatedRiver = this.calcDummyRiver();
    const generatedData = this.calcGraph(generatedStations, generatedLines, generatedRiver);
    return generatedData;
  }

  // Converts the station data from a given json to map format
  // JSON must look like testStations
  private calcStations(stations): any {
    this.calcMinMaxPos(stations);
    return this.calcStationPositions(stations);
  }

  private calcMinMaxPos(stations){
    this.minX = 100;
    this.maxX = 0;
    this.minY = 100;
    this.maxY = 0;
    // Transform Geocoords into map coords, store max and min
    for (const i in stations) {
      const pos = stations[i]['position'];
      const posX = (this.rasterWidth) * (180 + pos['lat']) / 360;
      const posY = (this.rasterHeight) * (90 - pos['lon']) / 180;
      this.maxX = posX > this.maxX ? posX : this.maxX;
      this.minX = posX < this.minX ? posX : this.minX;
      this.maxY = posY > this.maxY ? posY : this.maxY;
      this.minY = posY < this.minY ? posY : this.minY;
    }
  }

  private calcStationPositions(stations): any{
    let counter = 0;
    // This will be the data for all the stations that will be drawn and referenced later
    const stationDataPoints = {};
    // Clip Map to relevant area by max and min, calculate middle area
    for (const i in stations) {
      const pos = stations[i]['position'];
      let posX = (this.rasterWidth) * (180 + pos['lat']) / 360;
      let posY = (this.rasterHeight) * (90 - pos['lon']) / 180;
      posX = toInteger((posX - this.minX) * this.rasterWidth / (this.maxX - this.minX));
      posY = toInteger((posY - this.minY) * this.rasterHeight / (this.maxY - this.minY));
      stationDataPoints[i] = {};
      stationDataPoints[i]['title'] = stations[i]['title'];
      stationDataPoints[i]['coords'] = [posX, posY];
      counter ++;
    }
    return stationDataPoints;
  }

  // Converts the connection data from a given json to map format
  // JSONs for connections, lines and Stations must look like testLines and testConnections
  private calcLines(stationDataPoints, lines, connections): any {
    // This will be the line points which will be drawn
    const lineDataPoints = [];
    // Counts up which line we are, for correct offsets
    let linecounter = 0;
    // This iterates through the connections
    for (const i in connections) {
      // reset lastCoors and lastDir when looking at a new line
      this.lastCoords = null;
      this.lastDir = null;
      // Gather relevant info for the current line, this will be drawn
      const currentLine = {
        'name': lines[i].id,
        'label': i,
        'color': lines[i].color,
        'shiftCoords': [linecounter, linecounter],
        'nodes':  this.calcNodes(connections[i], stationDataPoints, linecounter)
      };
      // Insert the line into the list of all lines
      lineDataPoints.push(currentLine);
      linecounter ++;
    }
    return lineDataPoints;
  }

  private calcNodes(connections, stationDataPoints, linecounter ) {
    let nodes = [];
    // Iterate over all stops
    for (const j in connections) {
      // Get all relevant data
      const coords = stationDataPoints[connections[j].station].coords;
      const shiftCoords = [linecounter, linecounter];
      let curDir;
      // Only update the directions starting from the second station
      if (this.lastCoords != null) {
        curDir = this.calcCurDirLine(coords);
        // if lastDir was not set, set it here --> orthogonal to the current dir
        if (this.lastDir == null) {
          this.calcLastDir(coords);
        }
        // Create current between node
        const betweenNode1 = {
          'coords': this.calcBetweenCoords1(coords),
          'shiftCoords': shiftCoords
        };
        const betweenNode2 = {
          'coords': this.calcBetweenCoords2(curDir, coords),
          'shiftCoords': shiftCoords,
          'dir': this.lastDir
        };
        // Insert node into the final array
        nodes.push(betweenNode1);
        nodes.push(betweenNode2);
      }
      // Store current coords and dir for next iteration
      this.lastCoords = coords;
      this.lastDir = curDir;

      // Create current station node
      const currentStationNode = {
        'coords': coords,
        'name': connections[j].station,
        'labelPos': this.calcLabelPos(curDir),
        'shiftCoords': this.calcShiftCoords(curDir, shiftCoords),
        // 'marker': 'interchange',
        'canonical': true
      };
      // Insert node into the final array
      nodes.push(currentStationNode);
      // Just important for the end parts, insert points to elongate
      const currentStationPositionNode = {
        'coords': [
          coords[0] - currentStationNode['shiftCoords'][1],
          coords[1] -  currentStationNode['shiftCoords'][0]
        ]};
      nodes.push(currentStationPositionNode);
    }
    return nodes;
  }

  private calcCurDirLine(coords) {
    let curDir;
    switch (this.lastDir) {
      case 'N':
      // case N equals case Sthis.
      case 'S':
        (this.lastCoords[0] > coords [0]) ? curDir = 'W' : curDir = 'E';
        break;
      case 'E':
      // case E equals case W
      case 'W':
        (this.lastCoords[1] > coords[1]) ? curDir = 'S' : curDir = 'N';
        break;
      default:
        if (Math.abs(this.lastCoords[0] - coords[0]) > Math.abs(this.lastCoords[1] - coords[1])) {
          // More horizontal movement
          (this.lastCoords[0] > coords[0]) ? curDir = 'W' : curDir = 'E';
        } else {
          // More vertical movement
          (this.lastCoords[1] > coords[1]) ? curDir = 'S' : curDir = 'N';
        }
        break;
    }
    return curDir;
  }

  private calcLabelPos(curDir) {
    switch (curDir) {
      case 'N':
      case 'S':
        return 'E';
      case 'E':
      case 'W':
        return 'S';
      default:
        return 'N';
    }
  }

  private calcLastDir(coords) {
    if (Math.abs(this.lastCoords[0] - coords[0]) < Math.abs(this.lastCoords[1] - coords[1])) {
      // More horizontal movement
      (this.lastCoords[0] > coords[0]) ? this.lastDir = 'W' : this.lastDir = 'E';
    } else {
      // More vertical movement
      (this.lastCoords[1] > coords[1]) ? this.lastDir = 'S' : this.lastDir = 'N';
    }
  }

  // Calculate the betweenpoint coordinates, so there is a nice curve
  private calcBetweenCoords1(coords) {
    if (this.lastDir === 'N') {
      return [this.lastCoords[0], coords[1] - 1];
    } else if (this.lastDir === 'S') {
      return [this.lastCoords[0], coords[1] + 1];
    } else if (this.lastDir === 'E') {
      return [coords[0] - 1, this.lastCoords[1]];
    } else if (this.lastDir === 'W') {
      return [coords[0] + 1, this.lastCoords[1]];
    }
  }

  // Calculate the betweenpoint coordinates, so there is a nice curve
  private calcBetweenCoords2(curDir, coords) {
    // Set coordinates of the second point
    if (curDir === 'N') {
      return [coords[0], this.lastCoords[1] + 1];
    } else if (curDir === 'S') {
      return [coords[0], this.lastCoords[1] - 1];
    } else if (curDir === 'E') {
      return [this.lastCoords[0] + 1, coords[1]];
    } else if (curDir === 'W') {
      return [this.lastCoords[0] - 1, coords[1]];
    }
  }

  private calcShiftCoords(curDir, shiftCoords) {
    if (curDir === 'N' || curDir === 'S') {
      return [shiftCoords[0], 0];
    } else {
      return [0, shiftCoords[1]];
    }
  }

  // d3-tube-map crashes if there is no river object
  // so we just create one and place it outside of the shown part of the map
  private calcDummyRiver(): any {
    return {
      'name': 'River',
      'label': 'River',
      'shiftCoords': [-1000000, -1000000],
      'nodes': [{
        'coords': [0, 0]
      }, {
        'coords': [0, this.rasterHeight / 2]
      }, {
        'coords': [1, this.rasterHeight / 2 + 2]
      }, {
        'coords': [this.rasterWidth / 2 - 2, this.rasterHeight - 1]
      }, {
        'coords': [this.rasterWidth / 2, this.rasterHeight]
      }, {
        'coords': [this.rasterWidth, this.rasterHeight]
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
