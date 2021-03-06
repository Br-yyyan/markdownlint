// @ts-check

"use strict";

const fs = require("fs");
const path = require("path");
const globby = require("globby");
const tape = require("tape");
require("tape-player");
const markdownlint = require("../lib/markdownlint");
const { utf8Encoding } = require("../helpers");

// Simulates typing each test file to validate handling of partial input
const files = fs.readdirSync("./test");
files.filter((file) => /\.md$/.test(file)).forEach((file) => {
  const strings = {};
  let content = fs.readFileSync(path.join("./test", file), utf8Encoding);
  while (content) {
    strings[content.length.toString()] = content;
    content = content.slice(0, -1);
  }
  tape(`type ${file}`, (test) => {
    test.plan(1);
    markdownlint.sync({
      // @ts-ignore
      strings,
      "resultVersion": 0
    });
    test.pass();
    test.end();
  });
});

// Parses all Markdown files in all package dependencies
tape("parseAllFiles", (test) => {
  test.plan(1);
  const options = {
    "files": globby.sync("**/*.{md,markdown}")
  };
  markdownlint(options, (err) => {
    test.ifError(err);
    test.end();
  });
});
