import ChatCommands       from "compatibility/ChatCommands.mjs";
import {constants}        from "constants.mjs";
import ForienEasyPollsAPI from "ForienEasyPollsAPI.mjs";
import Poll               from "Poll.mjs";
import PollCommand        from "PollCommand.mjs";
import PollDialog         from "PollDialog.mjs";
import registerSettings   from "settings.mjs";
import Socket             from "Socket.mjs";
import Utility            from "utility/Utility.mjs";

Hooks.once("init", () => {
  registerSettings();

  PollCommand.registerCommand();

  game.modules.get(constants.moduleId).api = new ForienEasyPollsAPI();

  Utility.preloadTemplates([...Poll.templates, ...PollDialog.templates]);

  Hooks.callAll(`${constants.moduleId}:afterInit`);
  Utility.notify(`${constants.moduleLabel} initialized`, {consoleOnly: true});
});

Hooks.once("setup", () => {
  Hooks.callAll(`${constants.moduleId}:afterSetup`);
});

Hooks.once("ready", () => {
  Socket.listen();
  ChatCommands.register();

  Hooks.callAll(`${constants.moduleId}:afterReady`);
  Utility.notify(`${constants.moduleLabel} ready`, {consoleOnly: true});
});

