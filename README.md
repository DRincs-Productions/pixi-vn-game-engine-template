# Game Engine

Game Engine created with TypeScript and Pixi’VN.

## How build it

1. Install dependencies with `npm install` or `yarn install`
2. Build the project with `npm run build` or `yarn build`

## How push it to NPM

Prerequisites:

- NPM account: <https://www.npmjs.com/signup>
- NPM login: `npm login`

1. [Build the project](#how-build-it)
2. (Optional) Edit the version in `package.json` (e.g., `1.0.0` to `1.0.1`)
3. Publish the project with `npm publish` or `yarn publish`

### How to publish with GitHub Actions

Prerequisites:

- Create a NPM token
- Create a GitHub secret with the name `NPM_TOKEN` and the value of your NPM token

1. Edit the version in `package.json` (e.g., `1.0.0` to `1.0.1`)
2. (Optional) Create a new tag that starts with `v` (e.g., `v1.0.1`)
3. Push the tag to GitHub with `git push origin v1.0.1`
