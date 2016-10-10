# terbit
> A better `npm publish`, inspired by [np](https://github.com/sindresorhus/np)

[![NPM Version][npm-img]][npm-link]
[![Licence][licence-img]][licence-link]
[![Build Status][travis-img]][travis-link]
[![Coverage Status][codecov-img]][codecov-link]
[![Dependency Status][gemnasium-img]][gemnasium-link]


## Install

```
$ npm install --global terbit
```


## Usage

```
$ terbit --help

  Usage
    $ terbit <version>

    Version can be:
      patch | minor | major | prepatch | preminor | premajor | prerelease | 1.2.3

  Options
    --any-branch       Allow publishing from any branch
    --skip-cleanup     Skip cleanup of node_modules
    --skip-test        Skip cleanup and testing
    --changelog-preset Use `conventional-changelog`
    --tag              Publish under a given dist-tag

  Examples
    $ np patch
    $ np 1.0.2
    $ np 1.0.2-beta.3 --tag=beta
```


[npm-img]: https://img.shields.io/npm/v/terbit.svg?style=flat-square
[npm-link]: https://www.npmjs.com/package/terbit

[licence-img]: https://img.shields.io/npm/l/terbit.svg?style=flat-square
[licence-link]: LICENCE.md

[travis-img]: https://img.shields.io/travis/SimonDegraeve/terbit.svg?style=flat-square
[travis-link]: https://travis-ci.org/SimonDegraeve/terbit

[codecov-img]: https://img.shields.io/codecov/c/github/SimonDegraeve/terbit/master.svg?style=flat-square
[codecov-link]: https://codecov.io/github/SimonDegraeve/terbit?branch=master

[gemnasium-img]: https://img.shields.io/gemnasium/SimonDegraeve/terbit.svg?style=flat-square
[gemnasium-link]: https://gemnasium.com/github.com/SimonDegraeve/terbit
