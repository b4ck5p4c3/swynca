const isName = (name: string) =>
  name.match(/^[\p{L}\p{N}]+( [\p{L}\p{N}]+)*$/u);

const isEmail = (email: string) => email.match(/.+@.+\..+/);

const isUsername = (username: string) =>
  username.match(/^[a-zA-Z]+[a-zA-Z0-9_]*$/u) &&
  username.length >= 3 &&
  username.length <= 64;

const isSubscriptionTitle = (title: string) =>
  title.match(/^.*$/u) && title.length >= 0;

export { isName, isUsername, isEmail, isSubscriptionTitle };
