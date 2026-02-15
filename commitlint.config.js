module.exports = {
  extends: ["@commitlint/config-conventional"],
  parserPreset: {
    parserOpts: {
      headerPattern:
        /^(?:(?:\p{Emoji_Presentation}|\p{Extended_Pictographic}|:\w+:)\s+)?(\w+)(?:\(([^)]+)\))?: (.+)/u,
      headerCorrespondence: ["type", "scope", "subject"],
    },
  },
  rules: {
    "header-case": [0],
    "header-max-length": [2, "always", 120],
    "type-enum": [
      2,
      "always",
      [
        "build",
        "chore",
        "ci",
        "docs",
        "feat",
        "fix",
        "perf",
        "refactor",
        "revert",
        "style",
        "test",
      ],
    ],
    "type-case": [2, "always", "lower-case"],
    "type-empty": [2, "never"],
    "scope-case": [0],
    "subject-case": [0],
    "subject-empty": [2, "never"],
    "subject-full-stop": [2, "never", "."],
  },
}
