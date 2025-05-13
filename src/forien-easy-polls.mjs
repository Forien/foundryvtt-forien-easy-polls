import "../styles/forien-easy-polls.scss";

import ChatCommands       from "compatibility/ChatCommands.mjs";
import {constants}        from "constants.mjs";
import PollModel          from "data/PollModel";
import ForienEasyPollsAPI from "api.mjs";
import PollHandler        from "helpers/PollHandler.mjs";
import PollCommand        from "helpers/PollCommand.mjs";
import PollDialog         from "apps/PollDialog.mjs";
import registerSettings from "settings.mjs";
import Socket             from "Socket.mjs";
import Utility            from "utility/Utility.mjs";

Hooks.once("init", () => {
  registerSettings();

  PollCommand.registerCommand();

  game.modules.get(constants.moduleId).api = new ForienEasyPollsAPI();


  Object.assign(CONFIG.ChatMessage.dataModels, {
    [`${constants.moduleId}.poll`]: PollModel
  });

  Utility.preloadTemplates([...PollDialog.templates, ...PollModel.templates]);

  Hooks.callAll(`${constants.moduleId}:afterInit`);
  Utility.notify(`${constants.moduleLabel} initialized`, {consoleOnly: true});
});

Hooks.once("setup", () => {
  Hooks.callAll(`${constants.moduleId}:afterSetup`);
});

Hooks.once("ready", () => {
  PollHandler.socketListeners();
  PollHandler.chatLogListeners();
  Socket.listen();
  ChatCommands.register();

  Hooks.callAll(`${constants.moduleId}:afterReady`);
  Utility.notify(`${constants.moduleLabel} ready`, {consoleOnly: true});
});


Hooks.once("ready", () => {
  game.wfrp4e.config.hitLocationTables.yourCustomKey = "Your Custom Label";
});
