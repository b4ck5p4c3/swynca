const isName = (name: string) => name.match(/^[\p{L}\p{N}]+( [\p{L}\p{N}]+)*$/u);

const isEmail = (email: string) => email.match(/.+@.+\..+/);



export {
  isName,
  isEmail,
};