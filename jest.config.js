/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "node",
  // Only look at tests/. Without this Jest also finds other git worktrees under .claude/ and the
  // Workers' node:test files under workers/, which are not Jest tests.
  roots: ["<rootDir>/tests"],
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { tsconfig: "tsconfig.test.json" }],
  },
};
