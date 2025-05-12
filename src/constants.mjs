const constants = {
  modulePath: 'modules/forien-easy-polls',
  moduleId: 'forien-easy-polls',
  moduleLabel: `Forien's Easy Polls`
};

const defaults = {}

const flags = {
  isPoll: 'isPoll',
  pollData: 'pollData',
  pollSettings: 'pollSettings',
  pollResults: 'pollResults',
  savedPolls: 'savedPolls'
}

const settings = {
  playersCreate: 'playersCreate',
  defaultMode: 'defaultMode',
  defaultDisplay: 'defaultDisplay',
  defaultSecret: 'defaultSecret',
  keybindings: {
    pollDialog: 'pollDialog',
    savedPollsDialog: 'savedPollsDialog'
  }
}

export {constants, defaults, flags, settings};
