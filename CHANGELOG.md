# Changelog

## v2.0.0
- Restructured the entire project, introduced rollup and eslint
  - Moved source files from `dist` to `src`
  - Moved sass stylesheets from `src/styles` to `styles`
  - Moved static files from `dist` and `src` to `static`
  - The entire codebase is now compiled into a single `forien-easy-polls.mjs` file, which should lower amount of files
    browsers need to load, and also help narrowing down if an error comes from this module

## v1.1.1
* Added number of Answers to table on the Saved Polls App
* Saved Polls App now updates when a Saved Poll is updated (created or deleted)
* Clicking on `Create` in Poll Dialog no longer saves the Poll
* Added French translation (thanks Mystery-Man-From-Ouperspace!)

## v1.1.0
* Verified v12
* Fixed wrongly showing who voted on an answer even when they unselected that answer
* Changed default hotkey to open saved polls to `Shift+P` to avoid opening print menu in browsers
* Updated Brazilian Portuguese translation (thanks mclemente!)

## v1.0.7
* Added missing localization for Chat Commander

## v1.0.6
* Added icons and more context hints to Chat Commander's listings
* Added localization for Chat Commander
* Fixed localization for Keybinding Settings
* Updated Polish translation

## v1.0.5
* Added support and compatibility for Chat Commander module. (thanks to user elespike for suggesting) #10

## v1.0.4
* Added Brazilian Portuguese localization (thanks to user clemente for providing translation)

## v1.0.3 
* Added Japanese localization (thanks to user doumoku for providing translation)

## v1.0.2
* Fixed Poll Dialog not respecting the set default poll mode and always reverting to Multiple (thanks weepingminotaur for reporting)

## v1.0.0
* Modernized codebase
* Added the API
* Added the Poll Dialog (inspired by macro made by flamewave000)
* Added the options to make voting secret, disallow players from seeing results and to make poll single vote
* Allowed GM to vote
* Added control buttons to Poll Chat Messages that allow GM to control Poll's settings
* Added Configuration Settings to set default Poll options (mode, results, secret)
* Added feature called "Saved Polls" which allows to save Polls and later quickly post the same Poll, or edit it before posting
* Added Keybindings: `P` to open Create Poll dialog and `Ctrl+P` to open Saved Polls app

## v0.1.2
* Fixed CSS accidentally changing font in all chat cards into Open Sans

## v0.1.1
* Changed "total answers" variable name from `count` to `total` for compatibility with The Furnace

## v0.1.0
* Initial release
