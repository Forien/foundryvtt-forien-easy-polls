import {constants} from './constants.mjs';
import WorkshopError from './utility/Error.mjs';
import Poll from './Poll.mjs';
import Utility from './utility/Utility.mjs';

const capitalize = (s) => {
  if (typeof s !== 'string') return undefined;
  return s.charAt(0).toUpperCase() + s.slice(1)
};

export default class Socket {
  static socket = `module.${constants.moduleId}`;

  static needsGM() {
    let GMs = game.users.filter(u => u.isGM && u.active);
    if (GMs.length === 0) {
      throw new WorkshopError(game.i18n.localize('Forien.EasyPolls.Notifications.NoGM'));
    }
  }

  static sendAnswer(poll, answer, status = true, multiple = false) {
    if (game.user.isGM)
      return Poll.answer(poll, answer, status, game.user._id, multiple);

    this.needsGM();
    game.socket.emit(this.socket, {
      event: 'sendAnswer',
      poll: poll,
      answer: answer,
      status: status,
      multiple: multiple,
      user: game.user._id
    })
    Utility.notify(game.i18n.localize('Forien.EasyPolls.AnswerSent'));
  }

  static listen() {
    game.socket.on(this.socket, (data) => {
      try {
        this['on' + capitalize(data.event)](data);
      } catch (e) {
        this.onundefined(data);
      }
    });
  }

  static onSendAnswer(data) {
    if (!game.user.isGM) return;
    Poll.answer(data.poll, data.answer, data.status, data.user, data.multiple);
  }

  static onundefined(data) {
    let msg = game.i18n.format('Forien.EasyPolls.console.errors.undefined-event', {event: data.event});
    throw new WorkshopError(msg);
  }
}