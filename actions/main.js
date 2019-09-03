import * as core from "@actions/core";
import * as github from "@actions/github";
import * as yaml from "js-yaml";

async function run() {
  const token = core.getInput("repo-token", { required: true });
  const issue = github.context.payload.issue;
  console.log(issue.number);
}

run();
