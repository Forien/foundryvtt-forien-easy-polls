import Poll from "./Poll.js";
import constants from "./constants.mjs";

export default class PollCommand {

  static registerCommand() {
    Hooks.on("chatMessage", (chatLog, messageText, chatData) => {
      let match = this.checkCommand(messageText);

      if (match) {
        let content = messageText.replace(match[1], '');
        this.createPoll(content);

        return false;
      }
    });

    Hooks.on("renderChatMessage", (chatMessage, html, messageData) => {
      let isPoll = chatMessage.getFlag(constants.moduleName, "isPoll");

      if (isPoll) {
        Poll.renderPoll(chatMessage, html);

        return false;
      }
    });
  }

  static checkCommand(messageText) {
    const poll = new RegExp('^(\\/p(?:oll)? )', 'i');

    return messageText.match(poll);
  }

  static async createPoll(content) {
    let parts = content.split(/\n/);
    parts = parts.map(s => s.trim()).filter(s => s.length);
    let question = parts.shift();

    return Poll.create({question, parts});
  }
}

/**








 forien-copy-environment--v1.0.1;
 forien-easy-polls--v0.0.9;
 forien-quest-log--v0.4.4;
 forien-scene-navigator--v0.1.6;
 forien-token-rotation--v0.1.1;
 forien-unidentified-items--v0.2.0;
 tomcartos-inn-bathhouse--v1.0.0;
 tomcartos-ostenwold--v1.0.0;
 popout--v0.8;
 tidy-ui_game-settings--v0.1.13;
 tidy5e-sheet--v0.2.5;













 */