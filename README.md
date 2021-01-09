# 🎻 prelude
The opening to your new relationship. A music dating app made for nwHacks 2021.

## Available Scripts
### `yarn start`
Builds app, then opens Firebase emulator, emulating both hosting and Firestore. Emulator control panel can be accessed at `localhost:4000`, hosted webpage can be accessed at `localhost:5000`, and Firestore control panel can be accessed at `localhost:8080`. This will not automatically rebuild the package if changes are made.

### `yarn start-basic`
Launches development server provided by create-react-app. Webpage is accessible on `localhost:3000`. This will automatically rebuild every time changes are made. Typically used in conjunction with `yarn start-firestore` if emulator needed for Firestore.

### `yarn start-firebase`
Launches Firestore and Functions emulators only. Firestore control panel accessible at `localhost:8080`, functions control panel accessible at `localhost:5001`, and emulator control panel accessible at `localhost:4000`. Typically used in conjunction with `yarn start-basic`.

### `yarn deploy`
Deploys entire app to Firebase.

### `yarn deploy-functions`
Deploys functions only to Firebase.
