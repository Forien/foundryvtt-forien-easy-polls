import VersionCheck from "./versioning/version-check.mjs";
import renderWelcomeScreen from "./versioning/welcome-screen.mjs";
import constants from "./constants.mjs";
import registerSettings from "./settings.js";
import PollCommand from "./PollCommand.js";
import Socket from "./Socket.js";
import Poll from "./Poll.js";

Hooks.once('init', () => {
  registerSettings();

  PollCommand.registerCommand();

  Hooks.callAll(`${constants.moduleName}:afterInit`);
});

Hooks.once('setup', () => {

  Hooks.callAll(`${constants.moduleName}:afterSetup`);
});

Hooks.once("ready", () => {
  if (VersionCheck.check(constants.moduleName)) {
    if (game.user.isGM || game.settings.get(constants.moduleName, 'playersWelcomeScreen')) {
      renderWelcomeScreen();
    }
  }
  Socket.listen();

  Hooks.callAll(`${constants.moduleName}:afterReady`);
});


