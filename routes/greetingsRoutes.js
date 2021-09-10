
// eslint-disable-next-line space-before-function-paren
module.exports = function GreetingsRoutes(greetings) {
  // eslint-disable-next-line space-before-function-paren
  async function display(req, res) {
    try {
      res.render('index', {
        name: greetings.toGreet(),
        counter: await greetings.greetCounter()

      });
    } catch (error) {
      console.log(error);
      // eslint-disable-next-line padded-blocks
    }

  }
  // eslint-disable-next-line space-before-function-paren
  async function displayAdd(req, res) {
    try {
      const enterName = req.body.theUser;
      const theLang = req.body.theLanguage;
      console.log(theLang);
      if (!enterName && !theLang) {
        req.flash('info', 'Please enter a valid name and select the language!!');
      } else if (!enterName && theLang) {
        req.flash('info', 'Please enter a valid name!!');
      } else if (enterName && !theLang) {
        req.flash('info', 'Please select the language!!');
      } else {
        await greetings.setName(req.body.theUser);
        greetings.setLanguage(req.body.theLanguage);
        // greetings.letGreet(req.body.theUser);
        console.log(greetings.getName(req.body.theUser));
      }
      res.redirect('/');
    } catch (error) {
      console.log(error);
    }
  }

  // eslint-disable-next-line space-before-function-paren
  async function stored(req, res) {
    try {
      const list = await greetings.storedNames();

      res.render('greetednames', {
        list
      });
    } catch (error) {
      console.log(error);
    }
  }

  // eslint-disable-next-line space-before-function-paren
  async function nameCounter(req, res) {
    try {
      const names = req.params.name;
      const greetedNames = await greetings.userCounter(names);
      console.log(greetedNames.counter);

      res.render('counter', {
        names,
        greetedNames

      });
    } catch (error) {
      console.log(error);
    }
  }

  async function letReset (req, res) {
    try {
      if (await greetings.theReset()) {
        req.flash('info', 'counter succefully reset!!');
      }
      res.redirect('/');
    } catch (error) {
      console.log(error);
    }
  }

  return {
    display,
    displayAdd,
    stored,
    nameCounter,
    letReset
  };
};
