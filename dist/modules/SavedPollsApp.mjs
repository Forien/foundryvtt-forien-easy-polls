import Utility from './utility/Utility.mjs';
import Poll from './Poll.mjs';
import {constants, settings} from "./constants.mjs";
import WorkshopError from "./utility/Error.mjs";

/**
 * @author Forien
 */
export default class SavedPollsApp extends Application {
  static #templates = [
    'saved-polls-app.hbs'
  ];

  static get templates() {
    return this.#templates;
  }

  #api;

  //#region Setup

  constructor(options = {}) {
    super(options);
    this.#api = game.modules.get(constants.moduleId).api;
  }

  /**
   * @inheritDoc
   */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ['forien-easy-polls', 'saved-polls-app', game.system.id],
      template: Utility.getTemplate('saved-polls-app.hbs'),
      title: game.i18n.localize('Forien.EasyPolls.SavedPollsApp.Title')
    });
  }

  getData(options = {}) {
    let i = 1;
    let polls = game.modules.get(constants.moduleId).api.savedPolls.polls.map(p => {
      p.index = i++;
      if (p.question.length > 50) {
        p.question = p.question.substring(0, 50) + '…';
      }
      p.isMultiple = p.options.mode === 'multiple';
      p.showResults = p.options.results === true;
      p.isSecret = p.options.secret === true;

      return p;
    });

    return {
      polls: polls
    }
  }

  //#endregion

  //#region Listeners

  activateListeners(html) {
    super.activateListeners(html);

    html.find('.post-poll').click((ev) => this.#onClickPollControl(ev, 'post'));
    html.find('.edit-poll').click((ev) => this.#onClickPollControl(ev, 'edit'));
    html.find('.delete-poll').click((ev) => this.#onClickPollControl(ev, 'delete'));
    html.find('.create-poll').click(this.#onClickCreateNewPoll.bind(this));
  }

  #onClickPollControl(event, action) {
    const pollId = event.currentTarget.closest('.poll-entry').dataset.poll;
    let poll = this.#api.savedPolls.get(pollId);

    switch (action) {
      case 'delete':
        this.#api.savedPolls.delete(pollId).then(() => this.render());
        break;
      case 'post':
        this.#api.createPoll(poll.question, poll.parts, poll.options);
        break;
      case 'edit':
        this.#api.renderPollDialog(true, {poll: poll});
        break;
      default:
        throw new WorkshopError('Unknown Action provided for SavedPollsApp.#onClickPollControl method');
    }
  }

  #onClickCreateNewPoll() {
    this.close();
    return this.#api.renderPollDialog();
  }

//#endregion
}
