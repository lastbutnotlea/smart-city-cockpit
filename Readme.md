# Readme

Charlie 5 showcases how a smart city cockpit for London's public transport might look. It visualizes data originating from different sources in a unified interface. Users can overlook the status of all means of transportation in real-time. The system provides tools to analyze and control vehicle fleets in a single, centralized application.

## Build and run

### Backend only

Open a command line in the `crocodile`-folder.
Depending on your Operating System and your intentions, do one of the following:

|         | build                             | run                         | test                      |
|:-------:|:----------------------------------|:----------------------------|:--------------------------|
| Windows | `start gradlew.bat bootRepackage` | `start gradlew.bat bootRun` | `start gradlew.bat check` |
| Unix    | `./gradlew bootRepackage`         | `./gradlew bootRun`         | `./gradlew check`         |

### Frontend only

1. Open a command line in the `charlie`-folder.
2. Run `npm install` (sometimes you might want to skip this step because it takes a while)
3. Build with:
    - `npm run build-dev` if you only want to build the app. You can find the result in `dist`.
    - `npm start` if you want to start a server with the app. This server will recompile on changes of the source.
4. Be happy =D

Note: change `dev` to `prod` to build for the production environment. This uses a different config file (found in `charlie/src/environments`)

### The project as a whole

The frontend can be served via the backend.
Under the hood, gradle calls `npm` to build the frontend first,
then copies the build output to the backend and builds the backend.

To initiate this process, call `./gradlew stage` (`start gradlew.bat stage`) in the root-folder.
This compiles into a `jar`-file located in `crocodile/build/libs` that contains everything.
To run this `jar`, call `java -jar crocodile/build/libs/*.jar`.

Note that this compiles the frontend configured for production, though (see section Frontend only).
