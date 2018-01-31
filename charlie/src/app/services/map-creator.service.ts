import {Injectable} from '@angular/core';
import {toInteger} from '@ng-bootstrap/ng-bootstrap/util/util';

@Injectable()
export class MapCreatorService {

  private minX: number;
  private maxX: number;
  private minY: number;
  private maxY: number;

  private mapWidth: number; // in x direction
  private mapHeight: number; // in y direction
  private rasterizationFactor: number; // I think how many coordinate points should fall into one

  public createMap(stationData: any, lineData: any, connectionData: any): any {
    // Define the size of the raster, the larger the higher the resolution
    this.mapWidth = 500;
    this.mapHeight = 500;
    this.rasterizationFactor = 0.25;
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
    this.maxX = -100;
    this.minY = 100;
    this.maxY = -100;
    // find Max and Min of geocoordinates
    for (const i in stations) {
      const pos = stations[i]['position'];
      const posX = pos['lon'];
      const posY = pos['lat'];
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
      let posX = pos['lon'];
      let posY = pos['lat'];
      // calculate map positions by normalizing geo location relative to min/max and multiplying with desired map dimensions
      posX = toInteger(toInteger((posX - this.minX) / (this.maxX - this.minX) * (this.mapWidth * this.rasterizationFactor)) / (this.mapWidth * this.rasterizationFactor) * this.mapWidth);
      posY = toInteger(toInteger((posY - this.minY) / (this.maxY - this.minY) * (this.mapHeight * this.rasterizationFactor)) / (this.mapHeight * this.rasterizationFactor) * this.mapHeight);
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
      // Gather relevant info for the current line, this will be drawn
      const currentLine = {
        'name': lines[i].id,
        'label': i,
        'color': lines[i].color,
        'shiftCoords': [0, 0],
        'nodes':  this.calcNodes(connections[i], stationDataPoints)
      };
      // Insert the line into the list of all lines
      lineDataPoints.push(currentLine);
      linecounter ++;
    }
    return lineDataPoints;
  }

  private calcNodes(connections, stationDataPoints) {
    let nodes = [];
    let lastDir = null;
    let lastCoords = null;
    // Iterate over all stops
    for (const j in connections) {
      // Get all relevant data
      const nextCoords = stationDataPoints[connections[j].station].coords;
      const shiftCoords = [0, 0];
      let curDir;
      // Only update the directions starting from the second station
      if (lastCoords != null) {
        if (lastDir == null) {
          lastDir = this.calcLastDir(nextCoords, lastCoords);
        }
        curDir = this.calcNextDirection(nextCoords, lastDir, lastCoords);
        // Create current between node
        const betweenNode1 = {
          'coords': this.calcBetweenCoords1(nextCoords, lastCoords, lastDir),
          'shiftCoords': shiftCoords
        };
        const betweenNode2 = {
          'coords': this.calcBetweenCoords2(curDir, nextCoords, lastCoords),
          'shiftCoords': shiftCoords,
          'dir': lastDir
        };
        // Insert node into the final array
        nodes.push(betweenNode1);
        nodes.push(betweenNode2);
      }
      // Store current coords and dir for next iteration
      lastCoords = nextCoords;
      lastDir = curDir;

      // Create current station node
      const currentStationNode = {
        'coords': nextCoords,
        'name': connections[j].station,
        'labelPos': this.calcLabelPos(curDir),
        'shiftCoords': this.calcShiftCoords(curDir, shiftCoords),
        'marker': 'interchange',
        'canonical': true
      };
      // Insert node into the final array
      nodes.push(currentStationNode);
    }
    return nodes;
  }

  // In which direction do we have to go next?
  // TODO build in staying in the same direction?
  private calcNextDirection(coords, lastDir, lastCoords) {
    // First we go horizontal/vertical in the direction of the biggest difference
    let curDir;
    switch (lastDir) {
      case 'N':
      // case N equals case S
      case 'S':
        if (lastCoords[0] == coords[0]) {
          curDir = lastDir;
        } else {
          (lastCoords[0] > coords [0]) ? curDir = 'W' : curDir = 'E';
        }
        break;
      case 'E':
      // case E equals case W
      case 'W':
        if (lastCoords[1] == coords[1]) {
          curDir = lastDir;
        } else {
          (lastCoords[1] > coords[1]) ? curDir = 'S' : curDir = 'N';
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

  // "in which direction did we go last", used to initialize for start of line
  private calcLastDir(coords, lastCoords) {
    if (Math.abs(lastCoords[0] - coords[0]) > Math.abs(lastCoords[1] - coords[1])) {
      // More horizontal movement
      if (lastCoords[0] > coords[0]) {
        return 'W';
      } else {
        return 'E';
      }
    } else {
      // More vertical movement
      if (lastCoords[1] > coords[1]) {
        return 'S';
      } else {
        return 'N';
      }
    }
  }

  // Calculate the betweenpoint coordinates, so there is a nice curve
  private calcBetweenCoords1(coords, lastCoords, lastDir) {
    if (lastDir === 'N') {
      return [lastCoords[0], coords[1] - 1];
    } else if (lastDir === 'S') {
      return [lastCoords[0], coords[1] + 1];
    } else if (lastDir === 'E') {
      return [coords[0] - 1, lastCoords[1]];
    } else if (lastDir === 'W') {
      return [coords[0] + 1, lastCoords[1]];
    }
  }

  // Calculate the betweenpoint coordinates, so there is a nice curve
  private calcBetweenCoords2(curDir, coords, lastCoords) {
    // Set coordinates of the second point
    if (curDir === 'N') {
      return [coords[0], lastCoords[1] + 1];
    } else if (curDir === 'S') {
      return [coords[0], lastCoords[1] - 1];
    } else if (curDir === 'E') {
      return [lastCoords[0] + 1, coords[1]];
    } else if (curDir === 'W') {
      return [lastCoords[0] - 1, coords[1]];
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
        'coords': [0, 50]
      }, {
        'coords': [1, 52]
      }, {
        'coords': [48, 99]
      }, {
        'coords': [50, 100]
      }, {
        'coords': [100, 100]
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
