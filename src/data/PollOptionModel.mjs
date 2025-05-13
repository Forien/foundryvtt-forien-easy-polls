const {StringField, NumberField} = foundry.data.fields;

export default class PollOptionModel extends foundry.abstract.DataModel {
  static defineSchema() {
    return {
      label: new StringField(),
      percent: new NumberField({required: true, integer: true, min: 0, max: 100, initial: 0}),
      count: new NumberField({required: true, integer: true, min: 0, initial: 0}),
    };
  }

  get votersTooltip() {
    return this.voters ? Object.values(this.voters).join(", ") : "";
  }
}
