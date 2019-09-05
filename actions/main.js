const github = require("@actions/github");
const process = require("process");
const yaml = require("js-yaml").safeLoad;

const octokit = new github.GitHub(process.env.GITHUB_TOKEN);

const config_file_path = ".github/labels.yml";

async function run() {
  const issue = github.context.payload.issue;
  console.log(issue);
  if (issue.action == "labeled") {
    config = await fetchConfig(issue.owner.login, issue.repository.name);
    console.log(config);
  }
}

async function fetchConfig(owner, repo) {
  const response = await client.repos.getContents({
    owner: owner,
    repo: repo,
    path: config_file_path,
    ref: github.context.sha
  });

  config_contents = Buffer.from(response.data.content, "base64").toString();
  return yaml(config_contents);
}

run();
