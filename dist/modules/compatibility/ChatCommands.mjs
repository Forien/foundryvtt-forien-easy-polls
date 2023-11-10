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
      description: "Creates a poll. First line becomes question, other lines become answers. Use Shift+Enter to make a new line.",
      closeOnComplete: false,
      autocompleteCallback: (menu, alias, parameters) => {
        const entries = [];
        parameters = parameters.trim();

        if (parameters === '') {
          const characterNames = ChatCommands.getPCNamesAsOptions();
          entries.push(...[
            game.chatCommands.createCommandElement(`/poll --mode single Question\nYes\nNo`, "Suggestion: <strong>Quick Yes/No poll</strong>"),
            game.chatCommands.createCommandElement(`/poll --mode single --secret true Question\n${characterNames}`, "Suggestion: <strong>Quick Online PC poll</strong>"),
          ]);
        } else {
          parameters += ' ';
        }

        const partial = ChatCommands.checkPartialParameters(parameters, entries, alias);

        if (!partial) {
          if (!ChatCommands.containsMode(parameters)) {
            entries.push(...[
              game.chatCommands.createCommandElement(`${alias} ${parameters}--mode `, "Parameter: <strong>Mode</strong> - Poll's voting mode")
            ])
          }

          if (!ChatCommands.containsResults(parameters)) {
            entries.push(...[
              game.chatCommands.createCommandElement(`${alias} ${parameters}--results `, "Parameter: <strong>Results</strong> - can players see them?")
            ])
          }

          if (!ChatCommands.containsSecret(parameters)) {
            entries.push(...[
              game.chatCommands.createCommandElement(`${alias} ${parameters}--secret `, "Parameter: <strong>Secret</strong> - can players see who voted on what option?")
            ])
          }
        }

        entries.length = Math.min(entries.length, menu.maxEntries);

        return entries;
      }
    });
  }


  static checkPartialParameters(parameters, entries, alias) {
    if (ChatCommands.containsPartialMode(parameters)) {
      entries.push(...[
        game.chatCommands.createCommandElement(`${alias} ${parameters}single `, "Mode: <strong>single choice</strong>"),
        game.chatCommands.createCommandElement(`${alias} ${parameters}multi `, "Mode: <strong>multiple choice</strong>")
      ])

      return true;
    }

    if (ChatCommands.containsPartialResults(parameters)) {
      entries.push(...[
        game.chatCommands.createCommandElement(`${alias} ${parameters}true `, "Results: <strong>yes</strong> - players can check Poll's results"),
        game.chatCommands.createCommandElement(`${alias} ${parameters}false `, "Results: <strong>no</strong> - only GM can see Poll's results")
      ])

      return true;
    }

    if (ChatCommands.containsPartialSecret(parameters)) {
      entries.push(...[
        game.chatCommands.createCommandElement(`${alias} ${parameters}true `, "Secret: <strong>yes</strong> - players can't see who voted"),
        game.chatCommands.createCommandElement(`${alias} ${parameters}false `, "Secret: <strong>no</strong> - players can see who voted")
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