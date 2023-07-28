export default class ForienError extends Error {
  constructor(error) {
    error = `Forien's Easy Polls | ${error}`;
    super(error);
  }
}