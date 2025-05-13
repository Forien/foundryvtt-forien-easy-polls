const {StringField, NumberField} = foundry.data.fields;

export default class PollOptionModel extends foundry.abstract.DataModel {
  static maxLength = 30;

  static defineSchema() {
    return {
      label: new StringField(),
      percent: new NumberField({required: true, integer: true, min: 0, max: 100, initial: 0}),
      count: new NumberField({required: true, integer: true, min: 0, initial: 0}),
    };
  }

  get tooltip() {
    return `<h4>${this.label}</h4><p>${this.votersTooltip}</p>`;
  }

  get votersTooltip() {
    return (game.user.isGM || this.parent.settings.secret === false) && this.voters
      ? Object.values(this.voters).join(", ")
      : "";
  }

  get labelLimited() {
    return this.label.length > PollOptionModel.maxLength
      ? `${this.label.slice(0, PollOptionModel.maxLength)}...`
      : this.label;
  }
}
