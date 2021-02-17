This project is an online version of the popular European game "Stadt-Land-Fluss" (German for: City, Country, River). It was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) and uses the [PubNub framework](https://www.pubnub.com/) for realtime communication. You can play a [live version of the game](https://alexlehner86.github.io/stadt-land-fluss/#/) (in German) on GitHub Pages.

## Release Notes

### v1.7.0

- Change "mark answer as creative" system: Now every player's decision to mark an answer as creative counts as a separate "creative star". If game option is chosen, players receive extra points per each "creative star".
- Updated and improved game manual
- Various bugfixes, UI tweaks

### v1.6.0

- Major accessibility improvements of the whole app (keyboard interaction, screen reader optimization, etc.)
- Added "About" and "Accessibility Statement" pages

### v1.5.8

- Add game option: End round after all players submitted answers

### v1.5.7

- Update dependencies
- Improve service worker

### v1.5.5

- Add random categories selection feature.

### v1.5.4

- Fix mobile layout bugs.
- Add new categories.

### v1.5.3

- Turn application into a PWA (Progressive Web App).
- Use lazy loading of routes.
- Minor UI fixes.

### v1.5.2

- Add fullscreen button.

### v1.5.1

- Add countdown option: Each round ends after the set number of seconds.
- Refactoring.

### v1.5.0

- Add feature to mark answers as very creative
- Implement scoring option to score extra points for very creative answers
- Add game rounds overview and "Hall of Fame" to game results page
- Various UI improvements and bugfixes

### v1.4.0

- Add new game settings (select scoring options, select letters to exclude)
- Show scoring in evaluation phase
- Add game manual
- Minor UI changes and refactoring

### v1.3.0

- Implement "Rejoin Running Game" feature.
- Add admin panel with "Kick Player" feature.
- Persist player name and id.
- Minor bugfixes.

### v1.2.0

- Add new categories.
- Various fixes and constraints for the create new game form.
- Redesign evaluation phase UI.

### v1.1.0

- Add "Lookup text" feature. In the evaluation phase, every player input has a link that opens a new page with the results of the search for the category plus player input in the search engine "Ecosia".

### v1.0.3

- Improved layout/UI on mobile and tablets
- Rework themes and add credits for (background) images
- Add 5th theme: Black

### v1.0.2

- Add letter animation before new round to unveil next letter
- User can add custom categories via a form dialog

### v1.0.1

- Various UI improvements
- More and clearer feedback for the user (e.g. during loading screen)
- Add 4th theme: Blue
- Add link to author's github page

### v1.0.0

- Basic functionality: Start new game, share join link with other players, start game, enter text and evaluate inputs alternately, finish game and see results.
- Offer three themes with different color sets: Green, Orange and Pink  

## Installation

Run `npm install` to install the necessary dependencies. You need to create a [PubNub Account](https://www.pubnub.com/) to obtain the necessary [subscribe and publish key](https://www.pubnub.com/developers/tech/admin-dashboard/keys-object/). Then provide these keys in your app so that the game can establish real time communication between the players. Create a JSON file named `pubnub.config.json` in the src/config/ folder. The JSON should have the following structure:

{
    "publishKey": "YOUR-PUBLISH-KEY",
    "subscribeKey": "YOUR-SUBSCRIBE-KEY"
}

Now you can run the app with `npm start`.

### Webpack Config Override
After updating core dependencies, the `react-scripts build` is not building service-worker.js correctly. Therefore it is necessary to open `node_modules/react-scripts/config/webpack.config.js` and change the code for Service Worker creation:
- Replace the line `new WorkboxWebpackPlugin.InjectManifest({` with `new WorkboxWebpackPlugin.GenerateSW({`
- Delete the line above: `fs.existsSync(swSrc) &&`

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
