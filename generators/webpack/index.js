var generators  = require('yeoman-generator');
var _string     = require('underscore.string');

module.exports = generators.Base.extend({
  constructor: function() {
    generators.Base.apply(this, arguments);
  },

  prompting: function() {
    var done = this.async();

    this.prompt([{
      type     : 'input',
      name     : 'appname',
      message  : 'Plugin name',
      default  : this.appname
    }, {
      type     : 'list',
      name     : 'apptype',
      message  : 'Plugin type',
      choices  : ['Source', 'Extension'],
      filter   : function(value) {
        return value.toLowerCase().replace(/ /ig, '-');
      }
    }, {
      type     : 'input',
      name     : 'appversion',
      message  : 'Plugin version',
      default  : '0.0.0'
    }, {
      type     : 'input',
      name     : 'packagename',
      message  : 'Package Name (Optional)',
      default  : ''
    }], function(answers) {
      Object.keys(answers).forEach(function(key) {
        this[key] = answers[key];
      }.bind(this));
      this.name = this.appname.toLowerCase().replace(/ /ig, '-');
      done();
    }.bind(this));
  },

  writing: function() {
    // Copy whole directory
    this.fs.copy(
      this.sourceRoot(),
      this.destinationRoot()
    );

    // Update title of app
    this.fs.copyTpl(
      this.templatePath('index.html'),
      this.destinationPath('index.html'),
      { title: this.appname, apptype: this.apptype }
    );

    this.fs.copyTpl(
      this.templatePath('package.json'),
      this.destinationPath('package.json'),
      { name: this.name, version: this.appversion }
    );

    this.fs.copyTpl(
      this.templatePath('webpack.config.js'),
      this.destinationPath('webpack.config.js'),
      { apptype: this.apptype }
    );

    this.fs.copyTpl(
      this.templatePath('config.xml'),
      this.destinationPath('config.xml'),
      {
          name: this.name,
          apptype: this.apptype,
          propname: this.appname,
          version: this.appversion,
          packagename: this.packagename
      }
    );

    if (this.apptype === 'extension') {
      this.fs.delete(this.destinationPath('index_config.html'));
      this.fs.delete(this.destinationPath('src/js/config.js'));
      this.fs.delete(this.destinationPath('src/stylus/config.styl'));
    }
    else {
      this.fs.copyTpl(
        this.templatePath('index_config.html'),
        this.destinationPath('index_config.html'),
        { title: this.appname }
      );
    }
  },

  install: function() {
    this.npmInstall([
      'xjs-framework'
    ]);

    this.npmInstall([
      'babel',
      'babel-core',
      'babel-loader',
      'babel-preset-es2015',
      'css-loader',
      'file-loader',
      'style-loader',
      'stylus-loader',
      'ts-loader',
      'typescript',
      'webpack'
    ], { 'saveDev': true });

    this.npmInstall([
      'bower',
      'gulp'
    ], { 'global': true });
  },

  end: function() {
    this.log('XSplit JS Framework Scaffolding complete!');
  }
});
