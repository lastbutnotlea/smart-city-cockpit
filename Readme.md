# Readme

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
    - `npm run build` if you only want to build the app. You can find the result in `dist`.
    - `npm start` if you want to start a server with the app. This server will recompile on changes of the source.
4. Be happy =D

### The project as a whole

The frontend can be served via the backend.
Under the hood, gradle calls `npm` to build the frontend first,
then copies the build output to the backend and builds the backend.

To initiate this process, call `./gradlew stage` (`start gradlew.bat stage`) in the root-folder.
This compiles into a `jar`-file located in `crocodile/build/libs` that contains everything.
To run this `jar`, call `java -jar crocodile/build/libs/*.jar`.

