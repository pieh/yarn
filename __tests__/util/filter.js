/* @flow */

import {ignoreLinesToRegex, filterOverridenGitignores} from '../../src/util/filter.js';

const path = require('path');

test('ignoreLinesToRegex', () => {
  expect(
    ignoreLinesToRegex([
      'a',
      'b ',
      ' c ',
      'd #',
      'e#',
      'f # ',
      'g# ',
      'h # foo',
      'i# foo',
      'j # foo #',
      'k # foo # #',
      '# l',
      '# m #',
      '# ',
      '#',
      '',
      '!',
      '!A',
      '! B',
      '! C ',
      '! D #',
      '! E # ',
      '! F # # ',
      '#! G',
    ]),
  ).toEqual([
    {base: '.', isNegation: false, pattern: 'a', regex: /^(?:a)$/i},
    {base: '.', isNegation: false, pattern: 'b ', regex: /^(?:b)$/i},
    {base: '.', isNegation: false, pattern: ' c ', regex: /^(?:c)$/i},
    {base: '.', isNegation: false, pattern: 'd #', regex: /^(?:d #)$/i},
    {base: '.', isNegation: false, pattern: 'e#', regex: /^(?:e#)$/i},
    {base: '.', isNegation: false, pattern: 'f # ', regex: /^(?:f #)$/i},
    {base: '.', isNegation: false, pattern: 'g# ', regex: /^(?:g#)$/i},
    {base: '.', isNegation: false, pattern: 'h # foo', regex: /^(?:h # foo)$/i},
    {base: '.', isNegation: false, pattern: 'i# foo', regex: /^(?:i# foo)$/i},
    {
      base: '.',
      isNegation: false,
      pattern: 'j # foo #',
      regex: /^(?:j # foo #)$/i,
    },
    {
      base: '.',
      isNegation: false,
      pattern: 'k # foo # #',
      regex: /^(?:k # foo # #)$/i,
    },
    {base: '.', isNegation: true, pattern: 'A', regex: /^(?:A)$/i},
    {base: '.', isNegation: true, pattern: ' B', regex: /^(?:B)$/i},
    {base: '.', isNegation: true, pattern: ' C ', regex: /^(?:C)$/i},
    {base: '.', isNegation: true, pattern: ' D #', regex: /^(?:D #)$/i},
    {base: '.', isNegation: true, pattern: ' E # ', regex: /^(?:E #)$/i},
    {base: '.', isNegation: true, pattern: ' F # # ', regex: /^(?:F # #)$/i},
  ]);
});

const generateFilterOverridenGitignoresInput = (joinFn, baseDir) => [
  {relative: '.gitignore', basename: '.gitignore', absolute: joinFn(baseDir, '.gitignore'), mtime: 0},
  {relative: '.npmignore', basename: '.npmignore', absolute: joinFn(baseDir, '.npmignore'), mtime: 0},
  {relative: 'docs', basename: 'lib', absolute: joinFn(baseDir, 'docs'), mtime: 0},
  {relative: joinFn('docs', 'file.txt'), basename: 'file.txt', absolute: joinFn(baseDir, 'docs', 'file.txt'), mtime: 0},
  {relative: 'index.js', basename: 'index.js', absolute: joinFn(baseDir, 'index.js'), mtime: 0},
  {relative: 'lib', basename: 'lib', absolute: joinFn(baseDir, 'lib'), mtime: 0},
  {
    relative: joinFn('lib', '.gitignore'),
    basename: '.gitignore',
    absolute: joinFn(baseDir, 'lib', '.gitignore'),
    mtime: 0,
  },
  {relative: joinFn('lib', 'index.js'), basename: 'index.js', absolute: joinFn(baseDir, 'lib', 'index.js'), mtime: 0},
  {relative: 'README.md', basename: 'README.md', absolute: joinFn(baseDir, 'README.md'), mtime: 0},
  {relative: 'src', basename: 'src', absolute: joinFn(baseDir, 'src'), mtime: 0},
  {
    relative: joinFn('src', '.yarnignore'),
    basename: '.yarnignore',
    absolute: joinFn(baseDir, 'src', '.yarnignore'),
    mtime: 0,
  },
  {relative: joinFn('src', 'app.js'), basename: 'app.js', absolute: joinFn(baseDir, 'src', 'app.js'), mtime: 0},
];

const generateFilterOverridenGitignoresOutput = (joinFn, baseDir) => [
  {relative: '.npmignore', basename: '.npmignore', absolute: joinFn(baseDir, '.npmignore'), mtime: 0},
  {
    relative: joinFn('lib', '.gitignore'),
    basename: '.gitignore',
    absolute: joinFn(baseDir, 'lib', '.gitignore'),
    mtime: 0,
  },
  {
    relative: joinFn('src', '.yarnignore'),
    basename: '.yarnignore',
    absolute: joinFn(baseDir, 'src', '.yarnignore'),
    mtime: 0,
  },
];

test('filterOverridenGitignores', () => {
  const posixBaseDir = '/home/user/p';
  const win32BaseDir = 'C:\\Users\\user\\p';

  expect(
    filterOverridenGitignores(generateFilterOverridenGitignoresInput(path.posix.join, posixBaseDir), path.posix.join),
  ).toEqual(generateFilterOverridenGitignoresOutput(path.posix.join, posixBaseDir));

  expect(
    filterOverridenGitignores(generateFilterOverridenGitignoresInput(path.win32.join, win32BaseDir), path.win32.join),
  ).toEqual(generateFilterOverridenGitignoresOutput(path.win32.join, win32BaseDir));
});
