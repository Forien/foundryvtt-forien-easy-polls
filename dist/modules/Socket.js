import {constants} from "./constants.mjs";
import WorkshopError from "./utility/Error.js";
import Poll from "./Poll.js";

const capitalize = (s) => {
  if (typeof s !== 'string') return undefined;
  return s.charAt(0).toUpperCase() + s.slice(1)
};

export default class Socket {
  static socket = `module.${constants.moduleId}`;

  static needsGM() {
    let GMs = game.users.filter(u => u.isGM && u.active);
    if (GMs.length === 0) {
      ui.notifications.error(game.i18n.localize("Forien.EasyPolls.Notifications.NoGM"), {});
      throw new WorkshopError(game.i18n.localize("Forien.EasyPolls.console.errors.noGM"));
    }
  }

  static sendAnswer(poll, answer, status = true) {
    this.needsGM();
    game.socket.emit(this.socket, {
      event: "sendAnswer",
      poll: poll,
      answer: answer,
      status: status,
      user: game.user._id
    })
  }

  static listen() {
    game.socket.on(this.socket, (data) => {
      try {
        this["on" + capitalize(data.event)](data);
      } catch (e) {
        this.onundefined(data);
      }
    });
  }

  static onSendAnswer(data) {
    if (!game.user.isGM) return;
    Poll.answer(data.poll, data.answer, data.status, data.user);
  }

  static onundefined(data) {
    let msg = game.i18n.format("Forien.EasyPolls.console.errors.undefined-event", {event: data.event});
    throw new WorkshopError(msg);
  }
}