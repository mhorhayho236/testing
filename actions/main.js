const core = require("@actions/core");
const github = require("@actions/github");
const process = require("process");
// import * as yaml from "js-yaml";

const octokit = new github.GitHub(process.env.GITHUB_TOKEN);

async function run() {
  const issue = github.context.payload.issue;
  console.log(issue.number);

  const { data: pullRequest } = await octokit.pulls.get({
    owner: "octokit",
    repo: "rest.js",
    pull_number: 123,
    mediaType: {
      format: "diff"
    }
  });
  console.log(pullRequest);
}

run();
