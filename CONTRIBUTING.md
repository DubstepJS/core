# Contributing

### Code of conduct

Be respectful, etc. If technical disagreements occur, please avoid being abrasive.

### Styleguide

This project uses ESLint and Prettier for code consistency. Building the project via `yarn dev` or `yarn build` automatically runs the style checker.

### Development

This project uses Yarn for package/lock file management.

Run `yarn dev` to run watchers for transpilation, continuous testing and type checking. You can also run each script separately, via `yarn build`, `yarn test` and `yarn flow`, respectively. You can also check test coverage via `yarn cover`.

Transpilation is done via Babel. Testing and coverage are done via Jest. Type checking is done via Flow.

### Feature requests and questions

Please feel free to use Github issues for feature request discussions and questions.

### Pull requests

Please open an issue for discussion if you are implementing new functionality. Bug fix PRs should ideally have tests, but are welcome regardless. Note that PRs without tests may be edited (to add tests) prior to landing.

### Stewardship

This project was created by [Leo Horie](http://github.com/lhorie) on behalf of Uber's Web Platform team. It will be maintained by Uber Web Platform for the foreseeable future. Nonetheless we are open to granting contributor permissions to individuals who are interested in pushing this project forward as a platform for generic codemodding outside Uber's needs.
