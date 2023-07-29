import {constants, settings} from './constants.mjs';

export default function registerSettings() {
  game.keybindings.register(constants.moduleId, settings.keybinds.pollDialog, {
    name: 'EasyPolls.Keybindings.CreatePoll.name',
    hint: 'EasyPolls.Keybindings.CreatePoll.hint',
    onDown: () => {
      game.modules.get(constants.moduleId).api.renderPollDialog();
    },
    editable: [{key: 'KeyP'}],
    restricted: false,
    precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL,
  });
  game.keybindings.register(constants.moduleId, settings.keybinds.pollDialog, {
    name: 'EasyPolls.Keybindings.CreatePoll.name',
    hint: 'EasyPolls.Keybindings.CreatePoll.hint',
    onDown: () => {
      game.modules.get(constants.moduleId).api.renderPollDialog();
    },
    editable: [{key: 'KeyP', modifiers: ['Control']}],
    restricted: false,
    precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL,
  });

  game.settings.register(constants.moduleId, settings.playersCreate, {
    name: 'Forien.EasyPolls.Settings.PlayersCreate.Enable',
    hint: 'Forien.EasyPolls.Settings.PlayersCreate.EnableHint',
    scope: 'world',
    config: true,
    default: true,
    type: Boolean
  });

  game.settings.register(constants.moduleId, settings.defaultMode, {
    name: 'Forien.EasyPolls.Settings.DefaultMode.Enable',
    hint: 'Forien.EasyPolls.Settings.DefaultMode.EnableHint',
    scope: 'world',
    config: true,
    default: 'multiple',
    type: String,
    choices: {
      'multiple': 'Forien.EasyPolls.Settings.DefaultMode.Multiple',
      'single': 'Forien.EasyPolls.Settings.DefaultMode.Single'
    }
  });

  game.settings.register(constants.moduleId, settings.defaultDisplay, {
    name: 'Forien.EasyPolls.Settings.DefaultDisplay.Enable',
    hint: 'Forien.EasyPolls.Settings.DefaultDisplay.EnableHint',
    scope: 'world',
    config: true,
    default: true,
    type: Boolean
  });

  game.settings.register(constants.moduleId, settings.defaultSecret, {
    name: 'Forien.EasyPolls.Settings.DefaultSecret.Enable',
    hint: 'Forien.EasyPolls.Settings.DefaultSecret.EnableHint',
    scope: 'world',
    config: true,
    default: false,
    type: Boolean
  });

}