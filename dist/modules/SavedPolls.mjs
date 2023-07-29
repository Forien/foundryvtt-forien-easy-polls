import {constants, flags} from "./constants.mjs";

export default class SavedPolls {
  static #instance;
  /**
   * @type {Map<string, Module>}
   */
  polls;

  constructor() {
    this.polls = new foundry.utils.Collection(SavedPolls.loadPolls());
  }

  static get instance() {
    if (!(SavedPolls.#instance instanceof SavedPolls))
      SavedPolls.#instance = new SavedPolls();

    return SavedPolls.#instance
  }

  savePoll(question, parts, options, id = null) {
    if (id === null) id = foundry.utils.randomID();
    this.polls.set(id, {question, parts, options, id});
    return this.#save();
  }

  static loadPolls() {
    const polls = game.user.getFlag(constants.moduleId, flags.savedPolls);
    const loaded = [];

    if (polls)
      polls.forEach(p => {
        loaded.push([p.id, p]);
      })

    return loaded;
  }

  /**
   *
   * @param {string} key
   */
  get(key) {
    return this.polls.get(key)
  }

  delete(key) {
    this.polls.delete(key)
    return this.#save();
  }

  async #save() {
    console.log('JSON.stringify(this.polls)');
    console.log(JSON.stringify(this.polls));
    return game.user.setFlag(constants.moduleId, flags.savedPolls, this.polls);
  }
}