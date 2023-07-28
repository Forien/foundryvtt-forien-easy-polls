import constants from "./constants.mjs";
import registerSettings from "./settings.js";
import PollCommand from "./PollCommand.js";
import Socket from "./Socket.js";

Hooks.once('init', () => {
  registerSettings();

  PollCommand.registerCommand();

  Hooks.callAll(`${constants.moduleName}:afterInit`);
});

Hooks.once('setup', () => {

  Hooks.callAll(`${constants.moduleName}:afterSetup`);
});

Hooks.once("ready", () => {
  Socket.listen();

  Hooks.callAll(`${constants.moduleName}:afterReady`);
});


