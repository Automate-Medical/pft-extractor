terraform {
  backend "remote" {
    hostname = "app.terraform.io"
    organization = "automate-medical"

    workspaces {
      prefix = "pft-x-"
    }
  }
}