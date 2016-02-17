'use strict';

const normalizeUrl = require('normalize-url');
const humanizeUrl = require('humanize-url');
const yeoman = require('yeoman-generator');
const _s = require('underscore.string');

module.exports = yeoman.Base.extend({
  init() {
    const cb = this.async();
    const self = this;

    this.prompt([{
      name: 'moduleName',
      message: 'What do you want to name the module?',
      default: this.appname.replace(/\s/g, '-'),
      filter: x => _s.slugify(x)
    }, {
      name: 'authorName',
      message: 'What is the author\'s name?',
      store: true,
      default: ''
    }, {
      name: 'email',
      message: 'What email address should be associated with the module?',
      store: true
    }, {
      name: 'description',
      message: 'Enter a description:',
      default: 'My module'
    }, {
      name: 'repository',
      message: 'What is the repository url?',
      default: ''
    }, {
      name: 'website',
      message: 'What is the URL of your website?',
      default: ''
    }], props => {
      const tpl = {
        moduleName: props.moduleName,
        camelModuleName: _s.camelize(props.moduleName),
        authorName: props.authorName,
        email: props.email,
        description: props.description,
        website: props.website.length > 0 ? normalizeUrl(props.website) : '',
        humanizedWebsite: props.website.length > 0 ? humanizeUrl(props.website) : '',
        repository: props.repository
      };

      const mv = (from, to) => {
        self.fs.move(self.destinationPath(from), self.destinationPath(to));
      };

      self.fs.copyTpl(
        self.templatePath(),
        self.destinationPath(),
        tpl
      );

      mv('editorconfig', '.editorconfig');
      mv('gitattributes', '.gitattributes');
      mv('gitignore', '.gitignore');
      mv('_package.json', 'package.json');
      mv('eslintrc', '.eslintrc');

      cb();
    });
  },
  git() {
    this.spawnCommandSync('git', ['init']);
  },
  install() {
    this.installDependencies({bower: false});
  }
});
