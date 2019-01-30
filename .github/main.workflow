workflow "Test and deploy to heroku" {
  on = "push"
  resolves = ["Test", "Deploy to heroku"]
}

action "Install" {
  uses = "actions/npm@3c8332795d5443adc712d30fa147db61fd520b5a"
  args = "install"
}

action "Lint" {
  uses = "actions/npm@3c8332795d5443adc712d30fa147db61fd520b5a"
  needs = ["Install"]
  args = "run lint"
}

action "Test" {
  uses = "actions/npm@3c8332795d5443adc712d30fa147db61fd520b5a"
  needs = ["Install"]
  args = "test"
  secrets = ["LDAP_PASSWORD", "JWT_SECRET", "JUMPCLOUD_API_KEY", "LDAP_USERNAME", "LDAP_ORG_ID"]
}

action "On master" {
  uses = "actions/bin/filter@c6471707d308175c57dfe91963406ef205837dbd"
  needs = ["Lint", "Test"]
  args = "branch master"
}

action "Login to Heroku" {
  uses = "actions/heroku@6db8f1c22ddf6967566b26d07227c10e8e93844b"
  needs = ["On master"]
  args = "container:login"
  secrets = ["HEROKU_API_KEY"]
}

action "Push to heroku" {
  uses = "actions/heroku@6db8f1c22ddf6967566b26d07227c10e8e93844b"
  needs = ["Login to Heroku"]
  args = "[\"container:push\",\"web\"]"
  secrets = ["HEROKU_APP", "HEROKU_API_KEY"]
  env = {
    NODE_ENV = "production"
  }
}

action "Add env variables to Heroku" {
  uses = "actions/heroku@6db8f1c22ddf6967566b26d07227c10e8e93844b"
  needs = ["Push to heroku"]
  args = "[\"config:set\",\"NODE_ENV=production\"]"
  secrets = [
    "HEROKU_APP",
    "HEROKU_API_KEY",
    "JUMPCLOUD_API_KEY",
    "JWT_SECRET",
    "LDAP_ORG_ID",
    "LDAP_USERNAME",
    "LDAP_PASSWORD",
  ]
}

action "Deploy to heroku" {
  uses = "actions/heroku@6db8f1c22ddf6967566b26d07227c10e8e93844b"
  needs = ["Add env variables to Heroku"]
  args = "container:release"
  secrets = ["HEROKU_APP", "HEROKU_API_KEY"]
}
