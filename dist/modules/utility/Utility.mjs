import {constants} from "../constants.mjs";

export default class Utility {
  static notify(notification, {type = "info", permanent = false, consoleOnly = false} = {}) {
    let colour;

    switch (type) {
      case "error":
        colour = "#aa2222";
        break;
      case "warning":
        colour = "#aaaa22";
        break;
      case "info":
      default:
        colour = "#22aa22";
    }

    console.log(`🦊 %c${constants.moduleLabel}: %c${notification}`, 'color: purple', `color: ${colour}`);

    if (!consoleOnly)
      ui?.notifications?.notify(notification, type, {permanent: permanent, console: false});
  }

  static getTemplate(template) {
    return `modules/${constants.moduleId}/templates/${template}`;
  }
}