import {constants} from "./constants.mjs";
import registerSettings from "./settings.js";
import PollCommand from "./PollCommand.js";
import Socket from "./Socket.js";
import API from "./API.mjs";
import Utility from "./utility/Utility.mjs";

Hooks.once('init', () => {
  registerSettings();

  PollCommand.registerCommand();

  game.modules.get(constants.moduleId).api = new API();

  Hooks.callAll(`${constants.moduleId}:afterInit`);
  Utility.notify(`${constants.moduleLabel} initialized`, {consoleOnly: true});
});

Hooks.once('setup', () => {

  Hooks.callAll(`${constants.moduleId}:afterSetup`);
});

Hooks.once("ready", () => {
  Socket.listen();

  Hooks.callAll(`${constants.moduleId}:afterReady`);
  Utility.notify(`${constants.moduleLabel} ready`, {consoleOnly: true});
});


