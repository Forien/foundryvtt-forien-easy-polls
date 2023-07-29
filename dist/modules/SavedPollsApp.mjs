import Utility from './utility/Utility.mjs';
import Poll from './Poll.mjs';
import {constants, settings} from "./constants.mjs";

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

  //#region Setup


  constructor(options = {}) {
    super(options);
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
}
