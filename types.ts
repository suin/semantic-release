export type Type = {
  /**
   * A commit type of conventional commits.
   */
  type: string;
  /**
   * Determines that the commit type makes what kind of release.
   */
  release?: "major" | "minor" | "patch";
  /**
   * The message that is shown in git-cz.
   */
  description: string;
  /**
   * The emoji character that is shown in git-cz.
   */
  emoji: string;
  /**
   * Specifies what title is shown in the changelog.
   */
  section?: string;
  /**
   * Specifies whether this commit type is shown in the changelog.
   */
  hidden?: boolean;
};

export const types: Array<Type> = [
  {
    type: "feat",
    release: "minor",
    description: "A new feature",
    emoji: "🎸",
    section: "Features",
    hidden: false,
  },
  {
    type: "fix",
    release: "patch",
    description: "A bug fix",
    emoji: "🐛",
    section: "Bug Fixes",
    hidden: false,
  },
  {
    type: "sec",
    release: "patch",
    description: "A vulnerability fix",
    emoji: "👮",
    section: "Security",
    hidden: false,
  },
  {
    type: "perf",
    release: "patch",
    description: "A code change that improves performance",
    emoji: "⚡️",
    section: "Performance Improvements",
    hidden: false,
  },
  {
    type: "deps",
    release: "patch",
    description: "Dependency related changes",
    emoji: "📦",
    section: `Dependencies`,
  },
  {
    type: "refactor",
    description: "A code change that neither fixes a bug or adds a feature",
    emoji: "✨",
    section: "Code Refactoring",
    hidden: false,
  },
  {
    type: "docs",
    description: "Documentation only changes",
    emoji: "✏️",
    section: `Documentation`,
    hidden: false,
  },
  {
    type: "release",
    description: "Create a release commit",
    emoji: "🚀",
    hidden: true,
  },
  {
    type: "style",
    description: "Markup, white-space, formatting, missing semi-colons...",
    emoji: "💎",
    section: "Styles",
    hidden: false,
  },
  {
    type: "test",
    description: "Adding missing tests",
    emoji: "💯",
    section: "Tests",
    hidden: false,
  },
  {
    type: "ci",
    description: "CI related changes",
    emoji: "🎡",
    section: `Continuous Integration`,
    hidden: false,
  },
  {
    type: `chore`,
    description: `Build process or auxiliary tool changes`,
    emoji: "🛠️",
    section: `Chore`,
    hidden: true,
  },
];
