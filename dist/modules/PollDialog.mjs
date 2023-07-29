import Utility from './utility/Utility.mjs';
import Poll from './Poll.js';

/**
 * Poll Dialog inspired by macro made by flamewave000 that they provided in Pull Request #3 <https://github.com/Forien/foundryvtt-forien-easy-polls/pull/3>
 *
 * @author Forien
 */
export default class PollDialog extends Dialog {

  /**
   * @inheritDoc
   */
  constructor(data = {}, options = {}) {
    super(data, options);
    this.#defaultSetup(data);
  }

  /**
   * Sets up some default settings such as buttons and content
   * @param data
   */
  #defaultSetup(data) {
    data.buttons = {
      cancel: {
        label: game.i18n.localize('Cancel'),
        icon: '<i class="fas fa-times"></i>',
        callback: this.close
      },
      create: {
        label: game.i18n.localize('Create'),
        icon: '<i class="fas fa-check"></i>',
        callback: this.#createPollFromDialog
      }
    }
    data.content = renderTemplate(Utility.getTemplate('poll-dialog.hbs'), data)
    this.data.pollOptions = 0;
  }

  /**
   * @inheritDoc
   */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ['dialog', 'forien-easy-polls', 'poll-dialog', game.system.id]
    });
  }

  /**
   * @inheritDoc
   */
  get title() {
    return game.i18n.localize('Forien.EasyPolls.PollDialog.Title');
  }


  /**
   * @inheritDoc
   */
  render(force = true, options = {}) {
    return this.data.content.then((content) => {
      this.data.content = content;
      return super.render(force, options);
    })
  }

  /**
   * Creates Poll with data from Dialog
   * @param html
   * @return {Promise<abstract.Document>}
   */
  #createPollFromDialog(html) {
    const question = html.find('.poll-title').val();
    const parts = [];

    html.find('.option-template').remove();
    html.find('.poll-option').each(function () {
      parts.push($(this).val())
    });

    return Poll.create({question, parts})
  }

  /**
   * @inheritDoc
   */
  activateListeners(html) {
    super.activateListeners(html);

    html.find('.add-option').click(this.#onAddOptionClick.bind(this));
    html.find('.delete-option').click(this.#onDeleteOptionClick.bind(this));
  }

  /**
   * Adds new row for a new poll option
   * @param event
   */
  #onAddOptionClick(event) {
    this.data.pollOptions++;

    const table = event.currentTarget.closest('#poll-dialog-table');
    const template = table.getElementsByClassName('option-template')[0];

    let entry = template.cloneNode(true);
    entry.classList.remove('option-template', 'hidden');

    let input = entry.getElementsByClassName('poll-option')[0];
    input.setAttribute('placeholder', input.getAttribute('placeholder').replace('{PON}', this.data.pollOptions));

    let number = entry.getElementsByClassName('ordering-number')[0];
    number.textContent = `${this.data.pollOptions}.`;

    table.getElementsByClassName('poll-options')[0].append(entry);
    const style = getComputedStyle(entry);
    const height = parseInt(style.height);
    this.setPosition({height: this.position.height + height});

    // activate listeners on new row
    this.activateListeners($(entry));
  }

  /**
   * Deletes a row with a poll option
   * @param event
   */
  #onDeleteOptionClick(event) {
    this.data.pollOptions--;
    const row = event.currentTarget.closest('tr');
    const style = getComputedStyle(row);
    const height = parseInt(style.height);
    this.setPosition({height: this.position.height - height});
    row.remove();
  }
}
