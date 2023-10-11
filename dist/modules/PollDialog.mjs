import Utility from './utility/Utility.mjs';
import Poll from './Poll.mjs';
import {constants, settings} from "./constants.mjs";

/**
 * Poll Dialog inspired by macro made by flamewave000 that they provided in Pull Request #3 <https://github.com/Forien/foundryvtt-forien-easy-polls/pull/3>
 *
 * @author Forien
 */
export default class PollDialog extends Dialog {
  static #templates = [
    'poll-dialog.hbs',
    'partials/forien-switch.hbs'
  ];

  static get templates() {
    return this.#templates;
  }

  //#region Setup

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
    data.pollOptions = 0;
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
      },
      createAndSave: {
        label: game.i18n.localize('Forien.EasyPolls.CreateAndSave'),
        icon: '<i class="fas fa-check"></i>',
        callback: (html) => this.#createPollFromDialog(html, true),
      }
    }
    data.default = 'create';

    return data;
  }

  getData(options = {}) {
    this.data.pollOptions = 0;
    if (options.poll) {
      this.data.poll = options.poll;
      this.data.settings = {
        mode: this.#getBooleanForMode(this.data.poll.options.mode),
        results: this.data.poll.options.results,
        secret: this.data.poll.options.secret
      }
    }

    if (!this.data.poll) {
      this.data.poll = {
        parts: ['', ''],
      };

      this.data.settings = {
        mode: this.#getBooleanForMode(game.settings.get(constants.moduleId, settings.defaultMode)),
        results: game.settings.get(constants.moduleId, settings.defaultDisplay),
        secret: game.settings.get(constants.moduleId, settings.defaultSecret),
      }
    }

    this.data.poll.indexedParts = this.data.poll.parts.map(part => {
      return {index: ++this.data.pollOptions, part: part}
    })


    console.log(this.data);
    return this.data;
  }

  /**
   * @inheritDoc
   */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ['dialog', 'forien-easy-polls', 'poll-dialog', game.system.id],
      width: 500
    });
  }

  /**
   * @inheritDoc
   */
  get title() {
    return game.i18n.localize('Forien.EasyPolls.PollDialog.Title');
  }

  //#endregion

  /**
   * @inheritDoc
   */
  render(force = true, options = {}) {
    return renderTemplate(Utility.getTemplate('poll-dialog.hbs'), this.getData(options)).then((content) => {
      this.data.content = content;
      console.log(this.data);
      return super.render(force, options);
    })
  }

  /**
   * Creates Poll with data from Dialog
   * @param {*} html
   * @param {boolean} save
   * @return {Promise<abstract.Document>}
   */
  #createPollFromDialog(html, save = false) {
    const question = html.find('.poll-title').val();
    const parts = [];

    html.find('.option-template').remove();
    html.find('.poll-option').each(function () {
      parts.push($(this).val())
    });

    const options = {
      mode: this.#getModeFromCheckbox(html.find('.poll-controls input[type=checkbox][name=toggle-mode]').is(':checked')),
      results: html.find('.poll-controls input[type=checkbox][name=toggle-results]').is(':checked'),
      secret: html.find('.poll-controls input[type=checkbox][name=toggle-secret]').is(':checked')
    }

    if (save) {
      let id = this.data.poll.id || null;
      this.#savePollData(question, parts, options, id);
    }

    return Poll.create({question, parts}, options)
  }

  #savePollData(question, parts, options, id = null) {
    console.log({question, parts, options, id});
    game.modules.get(constants.moduleId).api.savedPolls.savePoll(question, parts, options, id);
  }

  /**
   *
   * @param {boolean} value
   * @return {string}
   */
  #getModeFromCheckbox(value) {
    return value ? 'multiple' : 'single';
  }

  /**
   *
   * @param {string} mode
   * @return {boolean}
   */
  #getBooleanForMode(mode) {
    return mode === 'multiple';
  }

  #getModeLabel(value) {
    return game.i18n.localize('Forien.EasyPolls.Settings.DefaultMode.' + (value === true ? 'Multiple' : 'Single'));
  }
  #getResultsLabel(value) {
    return game.i18n.localize('Forien.EasyPolls.ToggleSettingResults.' + (value === true ? 'Enable' : 'Disable'));
  }
  #getSecretLabel(value) {
    return game.i18n.localize('Forien.EasyPolls.ToggleSettingSecret.' + (value === true ? 'Enable' : 'Disable'));
  }

  //#region Listeners

  /**
   * @inheritDoc
   */
  activateListeners(html) {
    super.activateListeners(html);

    html.find('.add-option').click(this.#onAddOptionClick.bind(this));
    html.find('.delete-option').click(this.#onDeleteOptionClick.bind(this));
    html.find('.poll-controls .forien-switch-checkbox[name="toggle-mode"]').change(this.#onChangeModeCheckbox.bind(this)).trigger('change');
    html.find('.poll-controls .forien-switch-checkbox[name="toggle-results"]').change(this.#onChangeResultsCheckbox.bind(this)).trigger('change');
    html.find('.poll-controls .forien-switch-checkbox[name="toggle-secret"]').change(this.#onChangeSecretCheckbox.bind(this)).trigger('change');
  }

  #changeCheckbox(event, label) {
    const checked = event.currentTarget.checked;
    event.currentTarget.closest('.forien-switch').getElementsByClassName('forien-switch-actual-label')[0].textContent = label;
  }

  #onChangeModeCheckbox(event) {
    const checked = event.currentTarget.checked;
    let label = this.#getModeLabel(checked);
    this.#changeCheckbox(event, label);
  }
  #onChangeResultsCheckbox(event) {
    const checked = event.currentTarget.checked;
    let label = this.#getResultsLabel(checked);
    this.#changeCheckbox(event, label);
  }
  #onChangeSecretCheckbox(event) {
    const checked = event.currentTarget.checked;
    let label = this.#getSecretLabel(checked);
    this.#changeCheckbox(event, label);
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
