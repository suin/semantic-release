import { Type, types } from "./types.js";
import { Options, PluginSpec } from "semantic-release";
import type { PluginConfig as YarnOptions } from "@suin/semantic-release-yarn";

const changelogFile = "CHANGELOG.md";

const releaseEmoji =
  types.find(({ type }) => type === "release")?.emoji ?? "🚀";

const defineConfig = ({
  types: userDefinedTypes,
  defaultBranch = "main",
  packageManager = { use: "yarn" },
  exec = false,
  ...options
}: defineConfig.UserOptions = {}): Options => {
  const plugins: Array<PluginSpec> = [
    /**
     * semantic-release plugin to analyze commits with conventional-changelog
     * @see https://github.com/semantic-release/commit-analyzer
     */
    [
      "@semantic-release/commit-analyzer",
      {
        preset: "conventionalcommits",
        releaseRules: [
          { breaking: true, release: "major" },
          { revert: true, release: "patch" },
          ...(userDefinedTypes ?? types).flatMap(({ type, release }) =>
            release ? [{ type, release }] : []
          ),
        ],
      },
    ],
    /**
     * semantic-release plugin to generate changelog content with conventional-changelog
     * @see https://github.com/semantic-release/release-notes-generator
     */
    [
      "@semantic-release/release-notes-generator",
      {
        preset: "conventionalcommits",
        presetConfig: {
          types: (userDefinedTypes ?? types).map(
            ({ type, section, hidden }) => ({
              type,
              section,
              hidden: hidden ?? true,
            })
          ),
        },
      },
    ],
    /**
     * semantic-release plugin to create or update a changelog file.
     * @see https://github.com/semantic-release/changelog
     */
    ["@semantic-release/changelog", { changelogFile }],
    /**
     * semantic-release plugin to publish a GitHub release and comment on released Pull Requests/Issues.
     * @see https://github.com/semantic-release/github
     */
    [
      "@semantic-release/github",
      {
        releasedLabels: ["released", "${nextRelease.gitTag}"],
        successComment: `${releaseEmoji} This $\{issue.pull_request ? 'pull request' : 'issue'} is included in version $\{nextRelease.gitTag}.`,
      },
    ],
  ];

  if (packageManager !== null && typeof packageManager === "object") {
    switch (packageManager.use) {
      case "npm":
        plugins.push(
          /**
           * semantic-release plugin to publish a npm package.
           * @see https://github.com/semantic-release/npm
           */
          ["@semantic-release/npm", packageManager.options]
        );
        break;
      case "yarn":
        plugins.push(
          /**
           * semantic-release plugin to publish a npm package with yarn@berry.
           * @see https://github.com/suin/semantic-release-yarn
           */
          ["@suin/semantic-release-yarn", packageManager.options]
        );
        break;
    }
  }

  if (exec) {
    plugins.push(
      /**
       * semantic-release plugin to execute custom shell commands.
       * @see https://github.com/semantic-release/exec
       */
      ["@semantic-release/exec", exec]
    );
  }

  // this plugin must be added last, because the prepare step must be executed at the end.
  plugins.push(
    /**
     * semantic-release plugin to commit release assets to the project's git repository.
     * @see https://github.com/semantic-release/git
     */
    [
      "@semantic-release/git",
      {
        assets: [
          "package.json", // to commit the "version" property change
          "package-lock.json", // to commit the "version" property change
          changelogFile,
        ],
        message: `release: ${releaseEmoji} $\{nextRelease.gitTag} [skip ci]

$\{nextRelease.notes}`,
      },
    ]
  );

  return {
    branches: [
      defaultBranch,
      "+([0-9])?(.{+([0-9]),x}).x", // maintenance branch
      { name: "beta", prerelease: true },
      { name: "alpha", prerelease: true },
    ],
    tagFormat: "v${version}",
    plugins,
    ...options,
  };
};

declare namespace defineConfig {
  interface UserOptions extends Options {
    types?: ReadonlyArray<Type>;

    defaultBranch?: string;

    /**
     * The package manager choice to publish a npm package.
     *
     * If `false`, the npm package will not be published.
     */
    packageManager?:
      | {
          use: "npm";
          /**
           * Options to pass to the @semantic-release/npm plugin
           */
          options?: NpmOptions;
        }
      | {
          use: "yarn";
          /**
           * Options to pass to the @suin/semantic-release-yarn plugin
           */
          options?: YarnOptions;
        }
      | false;

    /**
     * Options to pass to the @semantic-release/exec plugin. If false, the plugin is disabled.
     */
    exec?: ExecOptions | boolean;
  }

  interface NpmOptions {
    /**
     * Whether to publish the npm package to the registry. If false the package.json version will still be updated.
     *
     * @default false if the package.json private property is true, true otherwise.
     */
    npmPublish?: boolean;

    /**
     * Directory path to publish.
     *
     * @default "."
     */
    pkgRoot?: string;

    /**
     * Directory path in which to write the package tarball. If false the tarball is not be kept on the file system.
     *
     * @default false
     */
    tarballDir?: string | false;
  }

  interface ExecOptions {
    verifyConditionsCmd?: string;
    analyzeCommitsCmd?: string;
    verifyReleaseCmd?: string;
    generateNotesCmd?: string;
    prepareCmd?: string;
    addChannelCmd?: string;
    publishCmd?: string;
    successCmd?: string;
    failCmd?: string;
    shell?: string;
    execCwd?: string;
  }
}

export = defineConfig;
