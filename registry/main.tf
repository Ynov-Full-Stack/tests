terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.92"
    }
  }

  required_version = ">= 1.2"
}

provider "aws" {
  region = "eu-west-3" # Paris
}

locals {
  ssh_key_name = "registry-key-simple-kenzo"
  ssh_key_file = "${local.ssh_key_name}.pem"
  ssh_sg_name = "registry-sg-simple-kenzo"
}

# 1. AMI Ubuntu 24.04
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"]

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd-gp3/ubuntu-noble-24.04-amd64-server-*"]
  }
}

# 2. Clé SSH
resource "tls_private_key" "pk" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "aws_key_pair" "generated_key" {
  key_name   = local.ssh_key_name
  public_key = tls_private_key.pk.public_key_openssh
}

resource "local_file" "ssh_key" {
  filename        = "${path.module}/${local.ssh_key_file}"
  content         = tls_private_key.pk.private_key_pem
  file_permission = "0400"
}

resource "local_file" "ansible_inventory" {
  filename = "${path.module}/inventory.ini"
  content = templatefile("${path.module}/templates/inventory.ini.tftpl", {
    host_ip  = aws_instance.registry_server.public_ip
    ssh_key  = "./${local.ssh_key_file}"
    ssh_user = "ubuntu"
  })
}

# 3. Security Group (Port 443)
resource "aws_security_group" "registry_sg" {
  name        = local.ssh_sg_name
  description = "Allow SSH, HTTP (UI), Registry (443)"
  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    description = "Registry UI"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    description = "Registry Docker API"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# 4. Instance EC2
resource "aws_instance" "registry_server" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = "t3.micro"
  key_name      = aws_key_pair.generated_key.key_name

  vpc_security_group_ids = [aws_security_group.registry_sg.id]

  root_block_device {
    volume_size = 20
    volume_type = "gp3"
  }

  tags = {
    Name = "Terraform-Registry-Simple"
  }
}

#4 Outputs
output "instance_ip" {
  description = "Public IP registry server"
  value = aws_instance.registry_server.public_ip
}

output "private_key" {
  description = "Private Key SSH generated"
  value     = tls_private_key.pk.private_key_pem
  sensitive = true
}

output "ssh_user" {
  value = "ubuntu"
}

output "ssh_command" {
  description = "SSH command to login"
  value       = "ssh -i registry-key-simple.pem ubuntu@${aws_instance.registry_server.public_ip}"
}