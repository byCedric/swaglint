# Swaglint

[![Latest Version on Packagist][ico-version]][link-npm]
[![Repository][ico-repo]][link-repo]
[![Build status][ico-build]][link-build]
[![Software License][ico-license]](LICENSE.md)
[![Total Downloads][ico-downloads]][link-downloads]
[![Code quality][ico-quality]][link-quality]

Yet another Swagger linter

## Install

Via NPM

``` bash
$ npm install swaglint
```

## Usage

``` bash
$ swaglint swagger.yml
$ swaglint partial.yml other.yml
$ cat cool-api.yml | swaglint --stdin
```

## Change log

Please see [CHANGELOG](CHANGELOG.md) for more information on what has changed recently.

## Testing

``` bash
$ npm test
```

## Contributing

Please see [CONTRIBUTING](CONTRIBUTING.md) and [CONDUCT](CONDUCT.md) for details.

## Credits

- [Cedric van Putten][link-author]
- [All Contributors][link-contributors]

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.

[ico-repo]: https://img.shields.io/badge/repo-github-brightgreen.svg?style=flat-square
[ico-build]: https://img.shields.io/travis/rust-lang/rust.svg?style=flat-square
[ico-version]: https://img.shields.io/npm/v/swaglint.svg?style=flat-square
[ico-license]: https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square
[ico-downloads]: https://img.shields.io/npm/dt/swaglint.svg?style=flat-square
[ico-quality]: https://img.shields.io/codacy/grade/b09f559d94ca4facad53b6d9b3a059c4.svg?style=flat-square

[link-repo]: https://github.com/bycedric/swaglint
[link-build]: https://travis-ci.org/byCedric/swaglint
[link-quality]: https://www.codacy.com/app/byCedric/swaglint
[link-npm]: https://www.npmjs.com/package/swaglint
[link-downloads]: https://www.npmjs.com/package/swaglint
[link-author]: https://github.com/bycedric
[link-contributors]: ../../contributors
