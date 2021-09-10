
// eslint-disable-next-line space-before-function-paren
module.exports = function Greetings(pool) {
  let theGreet;
  let thelanguage;

  async function setName (name) {
    const firstLetter = name.charAt(0).toUpperCase() + name.slice(1);
    theGreet = firstLetter;
    const checkName = await pool.query('select names from users where names = $1', [theGreet]);
    if (checkName.rowCount === 0) {
      await pool.query('insert into users (names, counter) values($1, $2)', [theGreet, 1]);
    } else {
      await pool.query('update users set counter = counter + 1 where names = $1', [theGreet]);
    }
  }

  // eslint-disable-next-line space-before-function-paren
  async function theReset() {
    const letReset = await pool.query('delete from users');
    return letReset.rows;
  }

  // eslint-disable-next-line space-before-function-paren
  function getName() {
    return theGreet;
  }

  // eslint-disable-next-line space-before-function-paren
  function setLanguage(language) {
    thelanguage = language;
  }

  // eslint-disable-next-line space-before-function-paren
  function getLanguage() {
    return thelanguage;
  }

  // eslint-disable-next-line space-before-function-paren
  async function userCounter(name) {
    const counter = await pool.query('select counter from users where names = $1', [name]);
    return counter.rows[0];
  }

  // eslint-disable-next-line space-before-function-paren
  function toGreet() {
    try {
      if (getLanguage() === 'English') {
        return 'Hello, ' + getName();
      }

      if (getLanguage() === 'Afrikaans') {
        return 'Groet, ' + getName();
      }

      if (getLanguage() === 'Isixhosa') {
        return 'Molo, ' + getName();
      }
    } catch (error) {
      console.log(error);
    }
  }

  // eslint-disable-next-line space-before-function-paren
  async function storedNames() {
    const result = await pool.query('select names as name from users');
    console.log(result.rows);

    if (result) {
      return result.rows;
    }
    return [];
  }

  // eslint-disable-next-line space-before-function-paren
  async function greetCounter() {
    const grandCounter = await pool.query('select * from users');
    return grandCounter.rowCount;
  }

  return {
    storedNames,
    theReset,
    setName,
    getName,
    setLanguage,
    getLanguage,
    greetCounter,
    toGreet,
    userCounter
  };
};
