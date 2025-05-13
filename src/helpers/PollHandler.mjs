import {constants, flags} from "constants.mjs";
import Socket             from "Socket.mjs";
import WorkshopError      from "utility/Error.mjs";
import Utility            from "utility/Utility.mjs";

export default class PollHandler {
  static #template = "poll.hbs";

  static get templates() {
    return [PollHandler.#template];
  }

  static async create(data, options = {}) {
    data.options = [...data.options ?? [], ...data.parts ?? []];

    const messageData = {
      type: `${constants.moduleId}.poll`,
      content: "",
      system: {
        total: 0,
        question: data.question,
        options: data.options.map(p => {
          return {label: p, percent: 0, count: 0};
        }),
        answers: [],
        settings: {
          mode: options.mode,
          results: options.results,
          secret: options.secret,
        },
      },
    };

    return ChatMessage.create(messageData);
  }

  static async #renderPoll({poll, messageId}) {
    poll ??= game.messages.get(messageId);

    if (!poll || poll.type !== `${constants.moduleId}.poll`) return;

    const html = poll.renderHTML();
    poll.element.replaceWith(html);
  }

  static chatLogListeners() {
    ui.chat.element?.addEventListener("click", PollHandler.#handleClick);
  }

  static async #handleClick(event) {
    const messageId = event.target.closest(".forien-poll[data-message-id]")?.dataset.messageId;
    const poll = game.messages.get(messageId);

    if (!poll || poll.type !== `${constants.moduleId}.poll`) return;

    if (event.target.closest(".forien-poll input.poll-answer")) {
      const answer = event.target.dataset.answer;
      const checked = event.target.checked;

      if (Utility.activeGM)
        return PollHandler.answer(poll.id, answer, checked, game.user._id);

      return Socket.sendAnswer(poll.id, answer, checked);
    }

    if (!Utility.activeGM)
      return;

    if (event.target.closest(".forien-poll button.toggle-results"))
      return PollHandler.#onToggleResults(event, poll);

    const settingsToggle = event.target.closest(".forien-poll button.toggle-setting");
    if (settingsToggle)
      return PollHandler.#onToggleSetting(poll, settingsToggle.dataset.setting);
  }

  static async #onToggleSetting(poll, setting) {
    poll.update({
      system: {
        settings: {
          [setting]: !poll.system.settings[setting],
        }
      }
    });
  }

  static async #onToggleResults(event, poll) {
    let isDisplayingResults = game.user.getFlag(constants.moduleId, flags.pollResults) || [];
    isDisplayingResults = foundry.utils.duplicate(isDisplayingResults);

    if (isDisplayingResults.includes(poll.id)) {
      isDisplayingResults = isDisplayingResults.filter(p => p !== poll.id);
    } else {
      isDisplayingResults.push(poll.id);
    }

    await game.user.setFlag(constants.moduleId, flags.pollResults, isDisplayingResults);
    await PollHandler.#renderPoll(poll);
  }

  static async answer(id, answer, status, user) {
    let poll = game.messages.get(id);
    if (poll)
      return poll.system.answer(answer, user, status);

    throw new WorkshopError(game.i18n.format("Forien.EasyPolls.console.errors.noPoll"));
  }

  static socketListeners() {
    Socket.register("sendAnswer", (data) => {
      PollHandler.answer(data.poll, data.answer, data.status, data.user, data.multiple);
    });
  }
}
