const github = require("@actions/github");
const process = require("process");
const yaml = require("js-yaml").safeLoad;

const octokit = new github.GitHub(process.env.GITHUB_TOKEN);

const config_file_path = ".github/labels.yml";

async function run() {
  const payload = github.context.payload;
  const action = payload.action;
  if (action == "labeled") {
    label_name = payload.label.name;
    config = await fetchConfig(
      payload.repository.owner.login,
      payload.repository.name
    );

    config.forEach(function(setting) {
      if (setting.on_label == label_name) {
        octokit.issues.create({
          owner: setting.create_issue.at.owner,
          repo: setting.create_issue.at.repo,
          title: setting.create_issue.title,
          body: setting.create_issue.body
        });
      }
    });
  } else {
    console.log(`Wanted a "labeled" event, but got "${action}"`);
  }
}

async function fetchConfig(owner, repo) {
  const response = await octokit.repos.getContents({
    owner: owner,
    repo: repo,
    path: config_file_path,
    ref: github.context.sha
  });

  config_contents = Buffer.from(response.data.content, "base64").toString();
  return yaml(config_contents);
}

run();
