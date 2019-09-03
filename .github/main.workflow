workflow "Issue" {
  resolves = ["Create an issue"]
  on = "issues"
}

action "Create an issue" {
  uses = "./actions"
  secrets = ["GITHUB_TOKEN"]
}
