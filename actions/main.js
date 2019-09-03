const core = require("@actions/core");
const github = require("@actions/github");
// import * as yaml from "js-yaml";

async function run() {
  const token = core.getInput("repo-token", { required: true });
  const issue = github.context.payload.issue;
  console.log(issue.number);
}

run();
