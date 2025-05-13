import {constants}   from "constants.mjs";
import WorkshopError from "utility/Error.mjs";
import Utility       from "utility/Utility.mjs";

export default class Socket {
  static #socket = `module.${constants.moduleId}`;

  static #listeners = {};

  static needsGM() {
    let GMs = game.users.filter(u => u.isGM && u.active);
    if (GMs.length === 0) {
      throw new WorkshopError(game.i18n.localize("Forien.EasyPolls.Notifications.NoGM"));
    }
  }

  static sendAnswer(poll, answer, status = true, multiple = false) {
    this.needsGM();
    game.socket.emit(this.#socket, {
      event: "sendAnswer",
      poll: poll,
      answer: answer,
      status: status,
      multiple: multiple,
      user: game.user._id,
    });
    Utility.notify(game.i18n.localize("Forien.EasyPolls.AnswerSent"));
  }

  static register(event, handler) {
    this.#listeners[event] = handler;
  }

  static listen() {
    game.socket.on(this.#socket, data => {
      try {
        const handler = Socket.#listeners[data.event] ?? this["on" + data.event.capitalize()];

        handler(data);
      } catch {
        this.onundefined(data);
      }
    });
  }

  static onundefined(data) {
    let msg = game.i18n.format("Forien.EasyPolls.console.errors.undefined-event", {event: data.event});
    throw new WorkshopError(msg);
  }
}
