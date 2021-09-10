const assert = require('assert');
const greeting = require('../greetings');
const pg = require('pg');
const Pool = pg.Pool;

const connectionString = process.env.DATABASE_URL || 'postgresql://codex:codex123@localhost:5432/my_greetings';

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

// eslint-disable-next-line no-undef
describe('The my_greeting database', function () {
  // eslint-disable-next-line no-undef
  beforeEach(async function () {
    await pool.query('delete from users');
  });

  // eslint-disable-next-line no-undef
  it('should be able to set the name and get them from the database', async function () {
    const greetings = greeting(pool);

    await greetings.setName('Sibusisiwe');
    assert.deepEqual([{ name: 'Sibusisiwe' }], await greetings.storedNames());
  });

  // eslint-disable-next-line no-undef
  it('should test the duplicate in the database', async function () {
    const greetings = greeting(pool);

    await greetings.setName('Siyamthanda');
    await greetings.setName('Siyamthanda');
    assert.equal(1, await greetings.greetCounter());
  });

  // eslint-disable-next-line no-undef
  it('should be able to greet the name entered in the language selected', async function () {
    const greetings = greeting(pool);

    await greetings.setName('Sibusisiwe');
    await greetings.setLanguage('English');
    assert.equal('Hello, Sibusisiwe', await greetings.toGreet());

    await greetings.setName('Sinalo');
    await greetings.setLanguage('Isixhosa');
    assert.equal('Molo, Sinalo', await greetings.toGreet());

    await greetings.setName('Sibonga');
    await greetings.setLanguage('Afrikaans');
    assert.equal('Groet, Sibonga', await greetings.toGreet());
  });

  // eslint-disable-next-line no-undef
  it('should be able to count the names that have been greeted in the database', async function () {
    const greetings = greeting(pool);

    await greetings.setName('Sibusisiwe');
    await greetings.setName('codex');
    assert.equal(2, await greetings.greetCounter());
  });

  // eslint-disable-next-line no-undef
  it('should ble to Reset the database', async function () {
    const greetings = greeting(pool);

    await greetings.setName('Sibusisiwe');
    await greetings.storedNames('Sibusisiwe');
    assert.equal(0, await greetings.theReset());
  });
});
