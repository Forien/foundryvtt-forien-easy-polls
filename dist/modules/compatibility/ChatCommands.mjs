import Utility from "../utility/Utility.mjs";

export default class ChatCommands {
  static register() {
    if (ChatCommands.installed) {
      if (game.user.isGM || Utility.getPlayersCreateSetting())
        ChatCommands.registerCommand();
    }
  }

  static get installed() {
    return game.modules.get('_chatcommands')?.active === true;
  }

  static registerCommand() {
    game.chatCommands.register({
      name: "/poll",
      module: "forien-easy-polls",
      icon: "<i class='fas fa-square-poll-horizontal'></i>",
      description: game.i18n.format('Forien.EasyPolls.ChatCommander.CommandDescription', {keybind: '<span class="parameter">Shift + Enter</span>'}),
      closeOnComplete: false,
      autocompleteCallback: (menu, alias, parameters) => {
        const entries = [];
        parameters = parameters.trim();

        if (parameters === '') {
          const characterNames = ChatCommands.getPCNamesAsOptions();
          entries.push(...[
            game.chatCommands.createCommandElement(`/poll --mode single Question\nYes\nNo`, game.i18n.localize('Forien.EasyPolls.ChatCommander.SimpleYesNo')),
            game.chatCommands.createCommandElement(`/poll --mode single --secret true Question\n${characterNames}`, game.i18n.localize('Forien.EasyPolls.ChatCommander.QuickPCPoll')),
            game.chatCommands.createSeparatorElement(),
          ]);
        } else {
          parameters += ' ';
        }

        const partial = ChatCommands.checkPartialParameters(parameters, entries, alias);

        if (!partial) {
          if (!ChatCommands.containsMode(parameters)) {
            entries.push(...[
              game.chatCommands.createCommandElement(`${alias} ${parameters}--mode `, game.i18n.localize('Forien.EasyPolls.ChatCommander.ParameterMode'))
            ])
          }

          if (!ChatCommands.containsResults(parameters)) {
            entries.push(...[
              game.chatCommands.createCommandElement(`${alias} ${parameters}--results `, game.i18n.localize('Forien.EasyPolls.ChatCommander.ParameterResults'))
            ])
          }

          if (!ChatCommands.containsSecret(parameters)) {
            entries.push(...[
              game.chatCommands.createCommandElement(`${alias} ${parameters}--secret `, game.i18n.localize('Forien.EasyPolls.ChatCommander.ParameterSecret'))
            ])
          }
        }

        const pollBinding = ChatCommands.humanizeBinding(game.keybindings.get('forien-easy-polls', 'pollDialog')[0]);
        const savedPollsBinding = ChatCommands.humanizeBinding(game.keybindings.get('forien-easy-polls', 'savedPollsDialog')[0]);

        entries.push(...[
          game.chatCommands.createSeparatorElement(),
          game.chatCommands.createInfoElement(game.i18n.format('Forien.EasyPolls.ChatCommander.DialogHint', {quickPollKey: `<span class="parameter">${pollBinding}</span>`, savedPollsKey: `<span class="parameter">${savedPollsBinding}</span>`})),
        ]);

        entries.length = Math.min(entries.length, menu.maxEntries);

        return entries;
      }
    });
  }


  static humanizeBinding(binding) {
    const stringParts = binding.modifiers.reduce((parts, part) => {
      if ( KeyboardManager.MODIFIER_CODES[part]?.includes(binding.key) ) return parts;
      parts.unshift(KeyboardManager.getKeycodeDisplayString(part));
      return parts;
    }, [KeyboardManager.getKeycodeDisplayString(binding.key)]);

    return stringParts.join(" + ");
  }

  static checkPartialParameters(parameters, entries, alias) {
    if (ChatCommands.containsPartialMode(parameters)) {
      entries.push(...[
        game.chatCommands.createCommandElement(`${alias} ${parameters}single `, game.i18n.localize('Forien.EasyPolls.ChatCommander.ModeSingle')),
        game.chatCommands.createCommandElement(`${alias} ${parameters}multi `, game.i18n.localize('Forien.EasyPolls.ChatCommander.ModeMultiple'))
      ])

      return true;
    }

    if (ChatCommands.containsPartialResults(parameters)) {
      entries.push(...[
        game.chatCommands.createCommandElement(`${alias} ${parameters}true `, game.i18n.localize('Forien.EasyPolls.ChatCommander.ResultsTrue')),
        game.chatCommands.createCommandElement(`${alias} ${parameters}false `, game.i18n.localize('Forien.EasyPolls.ChatCommander.ResultsFalse'))
      ])

      return true;
    }

    if (ChatCommands.containsPartialSecret(parameters)) {
      entries.push(...[
        game.chatCommands.createCommandElement(`${alias} ${parameters}true `, game.i18n.localize('Forien.EasyPolls.ChatCommander.SecretTrue')),
        game.chatCommands.createCommandElement(`${alias} ${parameters}false `, game.i18n.localize('Forien.EasyPolls.ChatCommander.SecretFalse'))
      ])

      return true;
    }

    return false;
  }

  static containsMode(parameters) {
    return (parameters.includes('--m') || parameters.includes('--mode'));
  }

  static containsFullMode(parameters) {
    return (
      parameters.includes('--m single') || parameters.includes('--mode single') ||
      parameters.includes('--m multi') || parameters.includes('--mode multi')
    );
  }

  static containsPartialMode(parameters) {
    return (ChatCommands.containsMode(parameters) && !ChatCommands.containsFullMode(parameters));
  }

  static containsResults(parameters) {
    return (parameters.includes('--r') || parameters.includes('--results'));
  }

  static containsFullResults(parameters) {
    return (
      parameters.includes('--r true') || parameters.includes('--results true') ||
      parameters.includes('--r false') || parameters.includes('--results false')
    );
  }

  static containsPartialResults(parameters) {
    return (ChatCommands.containsResults(parameters) && !ChatCommands.containsFullResults(parameters));
  }

  static containsSecret(parameters) {
    return (parameters.includes('--s') || parameters.includes('--secret'));
  }

  static containsFullSecret(parameters) {
    return (
      parameters.includes('--s true') || parameters.includes('--secret true') ||
      parameters.includes('--s false') || parameters.includes('--secret false')
    );
  }

  static containsPartialSecret(parameters) {
    return (ChatCommands.containsSecret(parameters) && !ChatCommands.containsFullSecret(parameters));
  }

  static getPCNamesAsOptions() {
    const users = game.users.filter(u => u.active && !u.isGM && u.character);
    const characters = users.map(u => u.character.name);

    return characters.join('\n');
  }
}