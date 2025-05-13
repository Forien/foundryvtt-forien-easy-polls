const {StringField, ForeignDocumentField} = foundry.data.fields;

export default class PollAnswerModel extends foundry.abstract.DataModel {
  static defineSchema() {
    return {
      label: new StringField({required: true}),
      user: new ForeignDocumentField(foundry.documents.User, {required: true}),
    };
  }
}
