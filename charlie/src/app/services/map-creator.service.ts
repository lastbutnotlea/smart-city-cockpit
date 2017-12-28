import { Injectable } from '@angular/core';
import { toInteger } from '@ng-bootstrap/ng-bootstrap/util/util';
import { LineData } from '../shared/data/line-data';
import { StopData } from '../shared/data/stop-data';

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

  /**
   * Computes map data for tube map with only one line that is displayed horizontally (for line-details view)
   * @param {LineData} lineData data of line to be drawn
   * @returns data for tube map
   */
  public createSingleLineMap(lineData: LineData, stopData: StopData[]): any {
    this.mapWidth = 1200;
    this.mapHeight = 250;
    let stations = this.calcStationsOfSingleLine(stopData);
    let line = this.calcSingleLine(lineData, stations);
    line = this.addDummyLine(line);
    return {
      'stations' : stations,
      'lines' : line,
      'river' : this.calcDummyRiver()
    };
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

  /**
   * To create map showing only one line (for line-details view)
   * creates station for every stop of line
   *
   * @param {StopData[]} stopDataList stops of line
   * @returns stations to be drawn in tube map
   */
  private calcStationsOfSingleLine(stopDataList: StopData[]) {
    const stepSize = 25;
    let counter = 0;
    const stationDataPoints = {};
    for (const stopIndex in stopDataList) {
      const id = stopDataList[stopIndex].id;
      stationDataPoints[id] = {};
      stationDataPoints[id]['title'] = stopDataList[stopIndex].commonName;
      stationDataPoints[id]['coords'] = [counter, 0];
      counter += stepSize;
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

  /**
   * To create map showing only one line (for line-details view)
   * creates one line with lineData containing all stations from stationDataPoints
   *
   * @param {LineData} lineData
   * @param stationDataPoints
   * @returns line to be drawn in tube map
   */
  private calcSingleLine(lineData: LineData, stationDataPoints: any) : any {
    const lineDataPoints = [];
    lineDataPoints.push({
        'name': lineData.id,
        'label': lineData.name,
        'color': lineData.color,
        'shiftCoords': [0, 0],
        'nodes':  this.calcNodesForSingleLine(stationDataPoints)
      });
    return lineDataPoints;
  }

  /**
   * To center map showing only one line (for line-details view)
   * tube map always places the leftmost nodes on the very left of the map, halfway out of view
   * in our case, this result in the entire line being cut off at the top
   * to avoid this, we add an invisible dummy-line that makes the visible line appear somewhat centered
   *
   * @param lineDataPoints
   * @returns {any}
   */
  private addDummyLine(lineDataPoints) {
    const size = lineDataPoints.length * 25;
    const nodes = [
      //lower left boarder point
      {
        'coords': [-size*2.5, 0],
        'shiftCoords': [0,0],
        'hide': true
      },
      //upper left boarder point
      {
        'coords': [-size * 2.5, 20],
        'shiftCoords': [0, 0],
        'hide': true
      }
    ];

    lineDataPoints.push({
      'name': 'dummy-line-name',
      'label': 'dummy-line-label',
      'color': "#FFFFFF",
      'shiftCoords': [0, 0],
      'nodes': nodes
    });
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
      // Just important for the end parts, insert points to elongate
      const currentStationPositionNode = {
        'coords': [
          nextCoords[0] - currentStationNode['shiftCoords'][1],
          nextCoords[1] -  currentStationNode['shiftCoords'][0]
        ]};
      //nodes.push(currentStationPositionNode);
    }
    return nodes;
  }

  /**
   * To create map showing only one line (for line-details view)
   * creates corresponding node-object for every station
   * nodes can then be added to line and drawn in tube map
   *
   * @param stationDataPoints
   * @returns nodes for line
   */
  private calcNodesForSingleLine(stationDataPoints: any) {
    let nodes = [];
    for (const stationIndex in stationDataPoints) {
      nodes.push({
        'coords': stationDataPoints[stationIndex].coords,
        'name': stationIndex,
        'labelPos': 'S',
        'shiftCoords': [0,0],
        'marker': 'interchange',
        'canonical': true
      });
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
