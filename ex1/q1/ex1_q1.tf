provider "aws" {
  profile = "default"
  region = "us-east-2"
}

locals {
  default_vpc_id = "vpc-04efaa78d301e3778"
  default_security_group = "sg-0578a145cbb1e15a8"
  availability_zones = ["us-east-2a", "us-east-2b"]
  availability_zones_default_subnets = ["subnet-0d09f07ee5a445c9e", "subnet-0aa52900916b0f576"]
  vpcCIDRblock = "10.0.0.0/16"
  subnetCIDRblock = "10.0.1.0/24"
  destinationCIDRblock = "0.0.0.0/0"

}

# Create vpc
resource "aws_vpc" "My_VPC" {
  cidr_block           = "10.0.0.0/16"
  instance_tenancy     = "default" 
  enable_dns_support   = true 
  enable_dns_hostnames = true
}

# create the Subnet
resource "aws_subnet" "My_VPC_Subnet_first" {
  vpc_id                  = "${aws_vpc.My_VPC.id}"
  cidr_block              = "10.0.1.0/24"
  map_public_ip_on_launch = true
  availability_zone       = element(local.availability_zones, 0)
}

# create the Subnet
resource "aws_subnet" "My_VPC_Subnet_second" {
  vpc_id                  = aws_vpc.My_VPC.id
  cidr_block              = "10.0.2.0/24"
  map_public_ip_on_launch = true
  availability_zone       = element(local.availability_zones, 1)
}

# Security group to VPC
resource "aws_security_group" "My_VPC_Security_Group" {
  vpc_id       = "${aws_vpc.My_VPC.id}"
  name         = "My VPC Security Group"
  description  = "My VPC Security Group"
  
  # allow ingress of port 22
  ingress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  } 
  
  # allow egress of all ports
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# create VPC Network access control list
resource "aws_network_acl" "My_VPC_Security_ACL" {
  vpc_id = "${aws_vpc.My_VPC.id}"
  subnet_ids = ["${aws_subnet.My_VPC_Subnet_first.id}", "${aws_subnet.My_VPC_Subnet_second.id}"]
# allow ingress port 22
  ingress {
    protocol   = "tcp"
    rule_no    = 100
    action     = "allow"
    cidr_block = local.destinationCIDRblock 
    from_port  = 22
    to_port    = 22
  }
  
  # allow ingress port 80 
  ingress {
    protocol   = "tcp"
    rule_no    = 200
    action     = "allow"
    cidr_block = local.destinationCIDRblock 
    from_port  = 80
    to_port    = 80
  }
  
  # allow ingress ephemeral ports 
  ingress {
    protocol   = "tcp"
    rule_no    = 300
    action     = "allow"
    cidr_block = local.destinationCIDRblock
    from_port  = 1024
    to_port    = 65535
  }
  
  # allow egress port 22 
  egress {
    protocol   = "tcp"
    rule_no    = 100
    action     = "allow"
    cidr_block = local.destinationCIDRblock
    from_port  = 22 
    to_port    = 22
  }
  
  # allow egress port 80 
  egress {
    protocol   = "tcp"
    rule_no    = 200
    action     = "allow"
    cidr_block = local.destinationCIDRblock
    from_port  = 80  
    to_port    = 80 
  }
 
  # allow egress ephemeral ports
  egress {
    protocol   = "tcp"
    rule_no    = 300
    action     = "allow"
    cidr_block = local.destinationCIDRblock
    from_port  = 1024
    to_port    = 65535
  }
}

# Create the Internet Gateway
resource "aws_internet_gateway" "My_VPC_GW" {
 vpc_id = aws_vpc.My_VPC.id
}

# Create the Route Table
resource "aws_route_table" "My_VPC_route_table" {
 vpc_id = aws_vpc.My_VPC.id
}

# Create the Internet Access
resource "aws_route" "My_VPC_internet_access" {
  route_table_id         = aws_route_table.My_VPC_route_table.id
  destination_cidr_block = local.destinationCIDRblock
  gateway_id             = aws_internet_gateway.My_VPC_GW.id
}

# Associate the Route Table with the Subnet
resource "aws_route_table_association" "My_VPC_association_first" {
  subnet_id      = aws_subnet.My_VPC_Subnet_first.id
  route_table_id = aws_route_table.My_VPC_route_table.id
}

# Associate the Route Table with the Subnet
resource "aws_route_table_association" "My_VPC_association_second" {
  subnet_id      = aws_subnet.My_VPC_Subnet_second.id
  route_table_id = aws_route_table.My_VPC_route_table.id
}

# resource "aws_vpc" "ex1" {
#   cidr_block = "10.0.0.0/16"
# }

# resource "aws_subnet" "ex1-b" {
#   availability_zone = "us-east-2b"
#   vpc_id     = "${aws_vpc.ex1.id}"
#   cidr_block = "10.0.1.0/24"
# }

# resource "aws_subnet" "ex1-a" {
#   availability_zone = "us-east-2a"
#   vpc_id     = "${aws_vpc.ex1.id}"
#   cidr_block = "10.0.2.0/24"
# }


# resource "aws_security_group" "ex1" {
#   name        = "ex1"
#   description = "Only in side communication"
#   vpc_id      = "${aws_vpc.ex1.id}"

#   egress {
#     from_port   = 0
#     to_port     = 0
#     protocol    = "-1"
#     cidr_blocks = ["0.0.0.0/0"]
#   }
# }

resource "aws_db_subnet_group" "ex1" {
  name       = "ex1"
  subnet_ids = ["${aws_subnet.My_VPC_Subnet_first.id}", "${aws_subnet.My_VPC_Subnet_second.id}"]
}

resource "aws_db_instance" "ex1" {
  skip_final_snapshot = true
  allocated_storage    = 20
  storage_type         = "gp2"
  engine               = "mysql"
  engine_version       = "8.0.17"
  instance_class       = "db.t2.micro"
  name                 = "ex1"
  username             = "admin"
  password             = "0522703456"
  vpc_security_group_ids = ["${aws_security_group.My_VPC_Security_Group.id}"]
  db_subnet_group_name = "${aws_db_subnet_group.ex1.name}"
}

resource "aws_lb_target_group" "ex1" {
  name     = "ex1"
  port     = 80
  protocol = "HTTP"
  vpc_id   = "${aws_vpc.My_VPC.id}"
}

resource "aws_lb" "ex1" {
  name               = "ex1"
  internal           = false
  load_balancer_type = "application"
  security_groups    = ["${aws_security_group.My_VPC_Security_Group.id}"]
  subnets            =  ["${aws_subnet.My_VPC_Subnet_first.id}", "${aws_subnet.My_VPC_Subnet_second.id}"]
}

resource "aws_lb_listener" "ex1" {
  load_balancer_arn = "${aws_lb.ex1.arn}"
  port              = "80"
  protocol          = "HTTP"
  default_action {
    type             = "forward"
    target_group_arn = "${aws_lb_target_group.ex1.arn}"
  }
}

resource "aws_launch_template" "ex1" {
  name_prefix   = "ex1"
  image_id      = "ami-0b896ffad68d3a7d2"
  instance_type = "t2.micro"
  vpc_security_group_ids = ["${aws_security_group.My_VPC_Security_Group.id}"]
  key_name = "IDC"
}

resource "aws_autoscaling_group" "ex1" {
  name = "ex1"
  vpc_zone_identifier = ["${aws_subnet.My_VPC_Subnet_first.id}", "${aws_subnet.My_VPC_Subnet_second.id}"]
  availability_zones = local.availability_zones
  desired_capacity   = 2
  max_size           = 4
  min_size           = 2
  launch_template {
    id      = "${aws_launch_template.ex1.id}"
    version = "$Latest"
  }
  target_group_arns = ["${aws_lb_target_group.ex1.arn}"]
}

resource "aws_autoscaling_policy" "ex1" {
  name                   = "ex1"
  scaling_adjustment     = 1
  adjustment_type        = "ChangeInCapacity"
  cooldown               = 300
  autoscaling_group_name = "${aws_autoscaling_group.ex1.name}"
}

resource "aws_cloudwatch_metric_alarm" "ex1" {
  alarm_name          = "ex1"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = "2"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/EC2"
  period              = "120"
  statistic           = "Average"
  threshold           = "80"

  dimensions = {
    AutoScalingGroupName = "${aws_autoscaling_group.ex1.name}"
  }

  alarm_description = "This metric monitors ec2 cpu utilization"
  alarm_actions     = ["${aws_autoscaling_policy.ex1.arn}"]
}