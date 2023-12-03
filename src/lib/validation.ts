import luhn from "luhn";

const isGenericEntityName = (name: string) =>
  name.match(/^[\p{L}\p{N}]+( [\p{L}\p{N}]+)*$/u);

const isName = isGenericEntityName;

const isEmail = (email: string) => email.match(/.+@.+\..+/);

const isUsername = (username: string) =>
  username.match(/^[a-zA-Z]+[a-zA-Z0-9_]*$/u) &&
  username.length >= 3 &&
  username.length <= 64;

const isSubscriptionTitle = (title: string) =>
  title.match(/^.*$/u) && title.length >= 0;

const isACSUID = (uid: string) => {
  // Per ISO 14443, UID can be 4, 7, or 10 bytes long
  if (uid.length !== 8 && uid.length !== 14 && uid.length !== 20) {
    return false;
  }

  // In Swynca, UID must be a lowercase hex string
  if (!uid.match(/^[0-9a-f]+$/)) {
    return false;
  }

  return true;
};

const isPAN = (pan: string) => {
  // As there is no common standard for PAN, we consider it valid
  // if it's 12-19 digits long and passes the Luhn check
  if (pan.length < 12 || pan.length > 19 || !pan.match(/^[0-9]+$/)) {
    return false;
  }

  // Luhn check
  return luhn.validate(pan);
};

const isACSKeyName = isGenericEntityName;

export {
  isName,
  isUsername,
  isEmail,
  isSubscriptionTitle,
  isACSUID,
  isPAN,
  isACSKeyName,
};
