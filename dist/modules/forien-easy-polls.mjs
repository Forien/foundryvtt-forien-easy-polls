import {constants} from './constants.mjs';
import registerSettings from './settings.mjs';
import PollCommand from './PollCommand.mjs';
import Socket from './Socket.mjs';
import ForienEasyPollsAPI from './ForienEasyPollsAPI.mjs';
import Utility from './utility/Utility.mjs';
import Poll from "./Poll.mjs";
import PollDialog from "./PollDialog.mjs";
import ChatCommands from "./compatibility/ChatCommands.mjs";

Hooks.once('init', () => {
  registerSettings();

  PollCommand.registerCommand();

  game.modules.get(constants.moduleId).api = new ForienEasyPollsAPI();

  Utility.preloadTemplates([...Poll.templates, ...PollDialog.templates]);

  Hooks.callAll(`${constants.moduleId}:afterInit`);
  Utility.notify(`${constants.moduleLabel} initialized`, {consoleOnly: true});
});

Hooks.once('setup', () => {

  Hooks.callAll(`${constants.moduleId}:afterSetup`);
});

Hooks.once('ready', () => {
  Socket.listen();
  ChatCommands.register();

  Hooks.callAll(`${constants.moduleId}:afterReady`);
  Utility.notify(`${constants.moduleLabel} ready`, {consoleOnly: true});
});


