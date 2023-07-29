import Poll from './Poll.mjs';
import PollCommand from './PollCommand.mjs';
import PollDialog from './PollDialog.mjs';
import SavedPolls from "./SavedPolls.mjs";
import SavedPollsApp from "./SavedPollsApp.mjs";

export default class ForienEasyPollsAPI {
  //#region private

  constructor() {
  }

  /**
   * Returns a Poll Class
   * @return {Poll}
   */
  get #pollClass() {
    return Poll;
  }

  /**
   * Returns a PollCommand Class
   * @return {PollCommand}
   */
  get #pollCommandClass() {
    return PollCommand;
  }

  //#endregion

  /**
   * Returns a SavedPollsApp Class
   * @return {SavedPollsApp}
   */
  get savedPollsApp() {
    return SavedPollsApp;
  }

  /**
   * Returns a PollDialog class
   * @return {PollDialog}
   */
  get pollDialog() {
    return PollDialog;
  }

  get savedPolls() {
    return SavedPolls.instance;
  }

  /**
   * Renders a Poll Dialog that allows to set up a Poll in a visuall manner with inputs.
   *
   * @param force
   * @param options
   * @return {Promise<*>}
   */
  async renderPollDialog(force = true, options = {}) {
    return await (new this.pollDialog()).render(force, options);
  }

  /**
   * Renders a Poll Dialog that allows to set up a Poll in a visuall manner with inputs.
   *
   * @param force
   * @param options
   * @return {Promise<*>}
   */
  async renderSavedPollsApp(force = true, options = {}) {
    return (new this.savedPollsApp()).render(force, options);
  }

  /**
   * Creates a Poll from a Multiline Text data.
   * First line becomes the Question/Title, other lines become the options
   *
   * @param {String[]} content
   * @return {Promise<abstract.Document>}
   */
  async createPollFromMultiline(content) {
    return await this.#pollCommandClass.createPoll(content)
  }

  /**
   * Creates a Poll with the given Question and Options (Parts)
   *
   * @param {String} question
   * @param {String[]} parts
   * @param {{}} options
   * @return {Promise<abstract.Document>}
   */
  async createPoll(question, parts, options){
    return await this.#pollClass.create({question, parts}, options)
  }

  /**
   * Answers a specified Poll, by setting a Boolean value on an Answer with provided UserId
   *
   * @param {String} pollId
   * @param {String} answer
   * @param {boolean} status
   * @param {String} userId
   * @return {Promise<void>}
   */
  async answerPoll(pollId, answer, status, userId) {
    return await this.#pollClass.answer(pollId, answer, status, userId);
  }
}