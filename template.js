/*
 * grunt-init-gruntfile
 * https://gruntjs.com/
 *
 * Copyright (c) 2012 "Cowboy" Ben Alman, contributors
 * Licensed under the MIT license.
 */

'use strict';

// Basic template description.
exports.description = 'Create a basic Gruntfile.';

// Template-specific notes to be displayed before question prompts.
exports.notes = 'This template tries to guess file and directory paths, but ' +
  'you will most likely need to edit the generated Gruntfile.js file before ' +
  'running grunt. _If you run grunt after generating the Gruntfile, and ' +
  'it exits with errors, edit the file!_';

// Any existing file or directory matching this wildcard will cause a warning.
exports.warnOn = 'Gruntfile.js';

// The actual init template.
exports.template = function(grunt, init, done) {

  init.process({}, [
    // Prompt for these values.
    {
      name: 'min_concat',
      message: 'Will files be concatenated or minified?',
      default: 'Y/n',
      warning: 'Yes: min + concat tasks. No: nothing to see here.'
    },
    {
      name: 'compass',
      message: 'Using Compass to generate scss?',
      default: 'Y/n',
      warning: 'Yes: Compass SASS. No: nothing to see here.'
    },
    {
      name: 'injector',
      message: 'Using injector to insert script in files?',
      default: 'Y/n',
      warning: 'Yes: grunt-injector. No: nothing to see here.'
    },
    init.prompt('title'),
    init.prompt('name'),
    init.prompt('description'),
    init.prompt('version'),
    init.prompt('author_name'),
    init.prompt('author_email')
  ], function(err, props) {
    props.min_concat = /y/i.test(props.min_concat);
    props.compass = /y/i.test(props.compass);
    props.injector = /y/i.test(props.injector);

    // Find the first `preferred` item existing in `arr`.
    function prefer(arr, preferred) {
      for (var i = 0; i < preferred.length; i++) {
        if (arr.indexOf(preferred[i]) !== -1) {
          return preferred[i];
        }
      }
      return preferred[0];
    }

    // Guess at some directories, if they exist.
    var dirs = grunt.file.expand({
      filter: 'isDirectory'
    }, '*').map(function(d) {
      return d;
    });

    props.lib_dir = prefer(dirs, ['src', 'assets', 'lib']);

    // Files to copy (and process).
    var files = init.filesToCopy(props);

    // Actually copy (and process) files.
    init.copyAndProcess(files, props);

    var devDependencies = {
      'grunt': '~0.4.5',
      'grunt-contrib-jshint': '~0.10.0',
      'grunt-contrib-watch': '~0.6.1'
    };

    if (props.compass) {
      devDependencies['grunt-contrib-compass'] = '~1.0.3';
    }

    if (props.injector) {
      devDependencies['grunt-injector'] = '~0.6.0';
    }

    if (props.min_concat) {
      devDependencies['grunt-contrib-uglify'] = '~0.5.0';
    }
    // Generate package.json file, used by npm and grunt.
    init.writePackageJSON('package.json', {
      title: props.title,
      name: props.name,
      description: props.description,
      version: props.version,
      devDependencies: devDependencies,
      author_name: props.author_name,
      author_email: props.author_email
    });

    // All done!
    done();
  });

};