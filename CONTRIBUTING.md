# Contributing

Excited to hear that you are interested in contributing to this project! Thanks!

## Setup (locally)

This project uses [`pnpm`](https://pnpm.io/) to manage the dependencies, install it if you haven't via

```bash
npm i -g pnpm
```

Clone this repo to your local machine and install the dependencies.

```bash
pnpm install
```

## Development

First, run `pnpm metadata:dev` to generate the metadata for the development environment.

To start the demo extension, run

```bash
pnpm dev
```

And press `F5` to start the extension.

To develop the documentation, run

```bash
pnpm docs:dev
```

To run the tests, run

```bash
pnpm test
```

## Project Structure

### Monorepo

We use monorepo to manage multiple packages.

```
demo/                 - the demo extension
docs/                 - the documentation
packages/
  metadata/           - metadata generator and metadata
  reactive-vscode/    - the main package
tests/                - tests
```

## Code Style

Don't worry about the code style as long as you install the dev dependencies. Git hooks will format and fix them for you on committing. If the autofix CI still fails, run

```bash
pnpm lint --fix
```

## Thanks

Thank you again for being interested in this project! You are awesome!
