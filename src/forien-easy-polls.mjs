import {constants}        from "src/constants.mjs";
import registerSettings   from "src/settings.mjs";
import PollCommand        from "src/PollCommand.mjs";
import Socket             from "src/Socket.mjs";
import ForienEasyPollsAPI from "src/ForienEasyPollsAPI.mjs";
import Utility            from "src/utility/Utility.mjs";
import Poll               from "src/Poll.mjs";
import PollDialog         from "src/PollDialog.mjs";
import ChatCommands       from "src/compatibility/ChatCommands.mjs";

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

