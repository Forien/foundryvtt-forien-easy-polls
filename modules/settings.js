import constants from "./constants.mjs";

export default function registerSettings() {

  game.settings.register(constants.moduleName, "playersWelcomeScreen", {
    name: "ForienEasyPolls.Settings.playersWelcomeScreen.Enable",
    hint: "ForienEasyPolls.Settings.playersWelcomeScreen.EnableHint",
    scope: "world",
    config: true,
    default: true,
    type: Boolean
  });


}