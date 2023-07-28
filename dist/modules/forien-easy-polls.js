import {constants} from "./constants.mjs";
import registerSettings from "./settings.js";
import PollCommand from "./PollCommand.js";
import Socket from "./Socket.js";
import API from "./API.mjs";

Hooks.once('init', () => {
  registerSettings();

  PollCommand.registerCommand();

  game.modules.get(constants.moduleId).api = new API();

  Hooks.callAll(`${constants.moduleId}:afterInit`);
});

Hooks.once('setup', () => {

  Hooks.callAll(`${constants.moduleId}:afterSetup`);
});

Hooks.once("ready", () => {
  Socket.listen();

  Hooks.callAll(`${constants.moduleId}:afterReady`);
});


