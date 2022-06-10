# Create Notion App &middot; [![CI](https://github.com/nbundle/create-notion-app/actions/workflows/ci.yml/badge.svg)](https://github.com/nbundle/create-notion-app/actions/workflows/ci.yml)

Create [nbundle]-powered [Notion] apps with one command:

<details>
<summary>npm</summary>

```shell
npx create-notion-app
```

</details>

<details>
<summary>yarn</summary>

```shell
yarn create notion-app
```

</details>

<details>
<summary>pnpm</summary>

```shell
pnpm create notion-app
```

</details>

Or for a TypeScript project:

<details>
<summary>npm</summary>

```shell
npx create-notion-app --ts
```

</details>

<details>
<summary>yarn</summary>

```shell
yarn create notion-app --ts
```

</details>

<details>
<summary>pnpm</summary>

```shell
pnpm create notion-app --ts
```

</details>

## Options

`create-notion-app` comes with the following options:

| Option                     | Description                        |
| -------------------------- | ---------------------------------- |
| **-t, --ts, --typescript** | Initialize as a TypeScript project |

## Contributing

### Requirements

- Node 14+

- Yarn 1.22+

### Setup

1. Install requirements

2. Clone the repository

3. Run `yarn` to install dependencies

### Develop

- Run `yarn start` to start building & watching in development mode

- Commit adhering to [Angular commit convention](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#commit) (use `yarn commit` or [Conventional Commits in Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=vivaxy.vscode-conventional-commits) to commit interactively)

- Submit a PR and make sure required status checks pass

- When a PR is merged or code is pushed to `main`, Github automatically builds & publishes a new release if there are relevant changes

<!-- Links -->

[nbundle]: https://www.nbundle.com
[notion]: https://www.notion.so
