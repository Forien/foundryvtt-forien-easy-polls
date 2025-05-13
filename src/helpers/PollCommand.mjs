import {constants, settings} from "constants.mjs";
import Poll                  from "helpers/PollHandler.mjs";

export default class PollCommand {
  static #flags = {
    mode: ["--mode", "--m"],
    results: ["--results", "--r"],
    secret: ["--secret", "--s"],
  };

  static #flagOptions = {
    mode: {
      multiple: ["m", "multi", "multiple"],
      single: ["s", "single"],
    },
    results: {
      true: ["t", "true"],
      false: ["f", "false"],
    },
    secret: {
      true: ["t", "true"],
      false: ["f", "false"],
    },
  };

  static registerCommand() {
    Hooks.on("chatMessage", (chatLog, messageText, _chatData) => {
      if (!game.settings.get(constants.moduleId, settings.playersCreate) && !game.user.isGM)
        return true;

      let match = this.checkCommand(messageText);

      if (match) {
        let options = {
          mode: game.settings.get(constants.moduleId, settings.defaultMode),
          results: game.settings.get(constants.moduleId, settings.defaultDisplay),
          secret: game.settings.get(constants.moduleId, settings.defaultSecret),
        };
        let flags = this.checkFlags(messageText);
        let content = messageText.replace(match[1], "");

        for (let flag of flags) {
          let [isFlag, flagName, flagOption] = this.#isFlagCorrect(flag[1], flag[2]);
          if (isFlag)
            options[flagName] = flagOption;

          content = content.replace(flag[0], "");
        }

        this.createPoll(content, options);

        return false;
      }
    });
  }

  /**
   *
   * @param {string} flag
   * @param {string} value
   * @return {boolean[]|(boolean|string)[]}
   */
  static #isFlagCorrect(flag, value) {
    for (let flagKey in this.#flags)
      for (let variant of this.#flags[flagKey])
        if (variant === flag)
          for (let optionKey in this.#flagOptions[flagKey])
            for (let optionVariant of this.#flagOptions[flagKey][optionKey])
              if (optionVariant === value) {
                if (optionKey === "true") optionKey = true;
                else if (optionKey === "false") optionKey = false;

                return [true, flagKey, optionKey];
              }

    return [false, null, null];
  }

  /**
   *
   * @param {String} messageText
   * @return {*}
   */
  static checkCommand(messageText) {
    const poll = new RegExp("^(/p(?:oll)? )", "i");

    return messageText.match(poll);
  }

  /**
   *
   * @param {String} messageText
   * @return {*}
   */
  static checkFlags(messageText) {
    const options = /(-{2}[^ ]+) ([^ \s\n]+)/gi;

    return messageText.matchAll(options);
  }

  /**
   *
   * @param {String} content
   * @param {String} mode
   * @param {boolean} results
   * @param {boolean} secret
   * @return {Promise<abstract.Document>}
   */
  static async createPoll(content, {mode = "multiple", results = true, secret = false} = {}) {
    let parts = content.split(/\n/);
    parts = parts.map(s => s.trim()).filter(s => s.length);
    let question = parts.shift();

    return await Poll.create({question, parts}, {mode, results, secret});
  }
}
