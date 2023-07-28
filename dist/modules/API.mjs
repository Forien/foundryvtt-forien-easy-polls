import Poll from "./Poll.js";
import PollCommand from "./PollCommand.js";
import PollDialog from "./PollDialog.mjs";

export default class API {
  constructor() {
  }

  get #pollClass() {
    return Poll;
  }

  get #pollCommandClass() {
    return PollCommand;
  }

  /**
   * Returns a PollDialog class
   * @return {PollDialog}
   */
  get pollDialog() {
    return PollDialog;
  }

  /**
   * Renders a Poll Dialog that allows to set up a Poll in a visuall manner with inputs.
   *
   * @param force
   * @param options
   * @return {Promise<void>}
   */
  async renderPollDialog(force = true, options = {}) {
    (new this.pollDialog()).render(force, options);
  }

  /**
   * Creates a Poll from a Multiline Text data.
   * First line becomes the Question/Title, other lines become the options
   *
   * @param {String[]} content
   * @return {Promise<void>}
   */
  async createPollFromMultiline(content) {
    return await this.#pollCommandClass.createPoll(content)
  }

  /**
   * Creates a Poll with the given Question and Options (Parts)
   *
   * @param {String} question
   * @param {String[]} parts
   * @return {Promise<void>}
   */
  async createPoll(question, parts){
    return await this.#pollClass.create({question, parts})
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