import Poll from "./Poll.js";
import PollCommand from "./PollCommand.js";

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
   *
   * @param {String[]} content
   * @return {Promise<void>}
   */
  async createPollFromArray(content) {
    return await this.#pollCommandClass.createPoll(content)
  }

  /**
   *
   * @param {String} question
   * @param {String[]} parts
   * @return {Promise<void>}
   */
  async createPoll(question, parts){
    return await this.#pollClass.create({question, parts})
  }

  /**
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