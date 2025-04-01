terraform {
  backend "s3" {
    bucket         = "travelease-tf-state-ca"
    key            = "travelease/terraform.tfstate"
    region         = "ca-central-1"
    dynamodb_table = "terraform-locks"
    encrypt        = true
  }
}