import {constants}     from "constants";
import PollAnswerModel from "data/PollAnswerModel";
import PollOptionModel from "data/PollOptionModel";
import Utility         from "utility/Utility";

const {StringField, NumberField, SchemaField, ArrayField, BooleanField, EmbeddedDataField} = foundry.data.fields;

export default class PollModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      total: new NumberField(),
      question: new StringField(),
      options: new ArrayField(new EmbeddedDataField(PollOptionModel)),
      answers: new ArrayField(new EmbeddedDataField(PollAnswerModel)),
      settings: new SchemaField({
        mode: new StringField({required: true, choices: ["single", "multiple"], initial: "single"}),
        results: new BooleanField({required: true, initial: true}),
        secret: new BooleanField({required: true, initial: false}),
      }),
    };
  }

  get multiple() {
    return this.settings.mode === "multiple";
  }

  get flavor() {
    return this.multiple
      ? game.i18n.localize("Forien.EasyPolls.Settings.DefaultMode.Multiple")
      : game.i18n.localize("Forien.EasyPolls.Settings.DefaultMode.Single");
  }

  prepareBaseData() {
    this.total = this.answers.length;

    for (const option of this.options) {
      const answers = this.answers.filter(a => option.label === a.label);
      option.count = answers.length;
      option.percent = Math.round(option.count / this.total * 100);
      option.voters = this.answers.filter(a => option.label === a.label).reduce((acc, a) => {
        acc[a.user._id] = a.user.name;

        return acc;
      }, {});
      option.checked = game.user._id in option.voters;
      option.percent = Math.round(option.count / this.total * 100) || 0;
    }
  }

  #cleanAnswers(label, user) {
    let answers = this.answers;

    if (!this.multiple)
      answers = answers.filter(a => a.user !== user);
    else
      answers = answers.filter(a => !(a.user === user && a.label === label));

    return answers;
  }

  /**
   *
   * @param {string} label
   * @param {string|User} user
   * @param {boolean} status
   *
   * @return {Promise<void>}
   */
  async answer(label, user, status = true) {
    const answers = this.#cleanAnswers(label, user);

    if (status === true) {
      answers.push(new PollAnswerModel({label, user}));
    } else {
      const index = answers.findIndex(a => a.label === label && a.user === user);
      answers.splice(index, 1);
    }

    await this.save({answers});
  }

  async save(updateData = {}) {
    return await this.parent.update({system: updateData});
  }

  async renderHTML({canDelete, canClose = false, ...rest} = {}) {
    const messageData = {
      ...rest,
      canDelete,
      canClose,
      message: this.parent,
      id: this.parent._id,
      isGM: game.user.isGM,
      poll: this,
    };

    let html = await foundry.applications.handlebars.renderTemplate(
      Utility.getTemplate("poll.hbs"),
      messageData,
    );
    html = foundry.utils.parseHTML(html);

    Hooks.callAll(`${constants.moduleId}:renderPollMessage`, this.parent, html, messageData);

    return html;
  }
}
