import { cosmiconfigSync } from "cosmiconfig";

const explorer = cosmiconfigSync("lint-staged", {
  searchPlaces: [
    "package.json",
    ".lintstagedrc",
    ".lintstagedrc.json",
    ".lintstagedrc.js",
    "lint-staged.config.js",
  ],
});
const result = explorer.search();
const config =
  result === null || result.isEmpty
    ? require("./lint-staged.config")
    : result.config;
process.stdout.write(
  Object.entries(config)
    .flatMap(([pattern, commands]: any) =>
      commands.toString().includes("prettier") ? [`**/${pattern}`] : []
    )
    .join(" ")
);
