import {constants, settings} from "constants.mjs";
import PollHandler           from "helpers/PollHandler.mjs";
import Utility               from "utility/Utility.mjs";

/**
 * Poll Dialog inspired by macro made by flamewave000 that they provided in Pull Request #3
 * <https://github.com/Forien/foundryvtt-forien-easy-polls/pull/3>
 *
 * @author Forien
 */
export default class PollDialog extends foundry.applications.api.DialogV2 {
  pollOptions = 0;

  // #region Setup
  /** @inheritDoc */
  static DEFAULT_OPTIONS = {
    id: "poll-dialog-{id}",
    classes: ["dialog", "forien-easy-polls", "poll-dialog", "themed"],
    tag: "dialog",
    form: {
      closeOnSubmit: true,
    },
    buttons: [
      {
        action: "cancel",
        label: "Cancel",
        icon: "<i class=\"fas fa-times\"></i>",
        callback: this.close,
      },
      {
        action: "create",
        label: "Create",
        icon: "<i class=\"fas fa-check\"></i>",
        default: true,
        callback: (event, button, dialog) => PollDialog.#createPollFromDialog(event, button, dialog, false),
      },
      {
        action: "createAndSave",
        label: "Forien.EasyPolls.CreateAndSave",
        icon: "<i class=\"fas fa-check\"></i>",
        callback: (event, button, dialog) => PollDialog.#createPollFromDialog(event, button, dialog, true),
      },
    ],
    window: {
      frame: true,
      positioned: true,
      minimizable: false,
    },
    position: {
      width: 500,
    },
  };

  async _prepareContext(options) {
    const context = await super._prepareContext(options);

    this.pollOptions = 0;

    if (options.poll) {
      context.poll = options.poll;
      context.settings = {
        mode: this.#getBooleanForMode(context.poll.options.mode),
        results: context.poll.options.results,
        secret: context.poll.options.secret,
      };
    }

    if (!context.poll) {
      context.poll = {
        parts: ["", ""],
      };

      context.settings = {
        mode: this.#getBooleanForMode(game.settings.get(constants.moduleId, settings.defaultMode)),
        results: game.settings.get(constants.moduleId, settings.defaultDisplay),
        secret: game.settings.get(constants.moduleId, settings.defaultSecret),
      };
    }

    context.poll.indexedParts = context.poll.parts.map(part => {
      return {index: ++this.pollOptions, part: part};
    });

    return context;
  }

  /**
   * @inheritDoc
   */
  get title() {
    return game.i18n.localize("Forien.EasyPolls.PollDialog.Title");
  }

  // #endregion

  /** @override */
  async _renderHTML(context, options) {
    const form = document.createElement("form");
    form.className = "dialog-form standard-form";
    form.autocomplete = "off";
    form.innerHTML = await foundry.applications.handlebars.renderTemplate(
      Utility.getTemplate("poll-dialog.hbs"),
      await this._prepareContext(options),
    );
    form.innerHTML += `<footer class="form-footer">${this._renderButtons()}</footer>`;
    form.addEventListener("submit", event => this._onSubmit(event.submitter, event));

    return form;
  }

  /**
   * Creates a poll based on input collected from a dialog form.
   *
   * @param {Event} event
   * @param {HTMLButtonElement} button
   * @param {PollDialog} dialog
   * @param {boolean} [save=false]
   *
   * @return {Poll}
   */
  static #createPollFromDialog(event, button, dialog, save = false) {
    const form = button.form;
    const elements = form.elements;

    const question = form.querySelector("input.poll-title").value;
    const parts = [];

    form.querySelectorAll("input.poll-option").forEach(input => {
      if (input.value)
        parts.push(input.value);
    });

    const options = {
      mode: PollDialog.#getModeFromCheckbox(elements["toggle-mode"].checked),
      results: elements["toggle-results"].checked,
      secret: elements["toggle-secret"].checked,
    };

    if (save) {
      const id = elements["pollId"]?.value || null;
      PollDialog.#savePollData(question, parts, options, id);
    }

    return PollHandler.create({question, parts}, options);
  }

  static #savePollData(question, parts, options, id = null) {
    game.modules.get(constants.moduleId).api.savedPolls.savePoll(question, parts, options, id);
  }

  /**
   *
   * @param {boolean} value
   * @return {string}
   */
  static #getModeFromCheckbox(value) {
    return value ? "multiple" : "single";
  }

  /**
   *
   * @param {string} mode
   * @return {boolean}
   */
  #getBooleanForMode(mode) {
    return mode === "multiple";
  }

  #getModeLabel(value) {
    return game.i18n.localize("Forien.EasyPolls.Settings.DefaultMode." + (value === true ? "Multiple" : "Single"));
  }

  #getResultsLabel(value) {
    return game.i18n.localize("Forien.EasyPolls.ToggleSettingResults." + (value === true ? "Enable" : "Disable"));
  }

  #getSecretLabel(value) {
    return game.i18n.localize("Forien.EasyPolls.ToggleSettingSecret." + (value === true ? "Enable" : "Disable"));
  }

  // #region Listeners

  /**
   * @inheritDoc
   */
  async _onRender(context, options) {
    await super._onRender(context, options);
    this.activateListeners(this.element, true);
  }

  activateListeners(element, checkboxes = false) {
    element.querySelector(".add-option")?.addEventListener("click", this.#onAddOptionClick.bind(this));
    element.querySelectorAll(".delete-option").forEach(el => el.addEventListener("click", this.#onDeleteOptionClick.bind(this)));

    if (!checkboxes) return;

    const changeEvent = new Event("change", {bubbles: true});

    const mode = element.querySelector(".poll-controls .forien-switch-checkbox[name=\"toggle-mode\"]");
    if (mode) {
      mode.addEventListener("change", this.#onChangeModeCheckbox.bind(this));
      mode.dispatchEvent(changeEvent);
    }
    const results = element.querySelector(".poll-controls .forien-switch-checkbox[name=\"toggle-results\"]");
    if (results) {
      results.addEventListener("change", this.#onChangeResultsCheckbox.bind(this));
      results.dispatchEvent(changeEvent);
    }
    const secret = element.querySelector(".poll-controls .forien-switch-checkbox[name=\"toggle-secret\"]");
    if (secret) {
      secret.addEventListener("change", this.#onChangeSecretCheckbox.bind(this));
      secret.dispatchEvent(changeEvent);
    }
  }

  #changeCheckbox(event, label) {
    event.currentTarget.closest(".forien-switch")
         .getElementsByClassName("forien-switch-actual-label")[0].textContent = label;
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
    event.preventDefault();
    event.stopPropagation();
    const checked = event.currentTarget.checked;
    let label = this.#getSecretLabel(checked);
    this.#changeCheckbox(event, label);
  }

  /**
   * Adds new row for a new poll option
   * @param event
   */
  #onAddOptionClick(event) {
    event.preventDefault();
    event.stopPropagation();
    this.pollOptions++;

    const table = event.currentTarget.closest("#poll-dialog-table");
    const template = table.getElementsByClassName("option-template")[0];

    let entry = template.cloneNode(true);
    entry.classList.remove("option-template", "hidden");

    let input = entry.getElementsByClassName("poll-option")[0];
    input.setAttribute("placeholder", input.getAttribute("placeholder").replace("{PON}", this.pollOptions));

    let number = entry.getElementsByClassName("ordering-number")[0];
    number.textContent = `${this.pollOptions}.`;

    table.getElementsByClassName("poll-options")[0].append(entry);
    const style = getComputedStyle(entry);
    const height = parseInt(style.height);
    this.setPosition({height: this.position.height + height});

    // activate listeners on new row
    this.activateListeners(entry);
  }

  /**
   * Deletes a row with a poll option
   * @param event
   */
  #onDeleteOptionClick(event) {
    event.preventDefault();
    event.stopPropagation();
    this.pollOptions--;
    const row = event.currentTarget.closest("tr");
    const style = getComputedStyle(row);
    const height = parseInt(style.height);
    this.setPosition({height: this.position.height - height});
    row.remove();
  }
}
