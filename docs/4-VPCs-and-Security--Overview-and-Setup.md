# VPCs and Security-Overview and Setup

#### VPCs Overview
  * Overall view of VPC ![alt text](https://github.com/zoro16/devops-aws/blob/master/screenshots/VPC-01.png)
  * [Classless Inter-Domain Routing (CIDR)](https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing)
  * [VPCs and Subnets](https://docs.aws.amazon.com/AmazonVPC/latest/UserGuide/VPC_Subnets.html)
  * [What is a Subnet Mask?](https://www.iplocation.net/subnet-mask)
  * [Internet Protocol Tutorial - Subnets](https://www.lifewire.com/internet-protocol-tutorial-subnets-818378)
  * Public Subnets and Internet Gateways
    - Public => Access to the internet
    - Route Table with an internet Gateway Attached = Public Route Table
    - An Internet Gateway => a portal to the internet
  * Network ACLS: "Security Gates"
    - What traffic can enter and leave our Subnets
    ![alt text](https://github.com/zoro16/devops-aws/blob/master/screenshots/VPC-06.png)
  * Servers and Services
    ![alt text](https://github.com/zoro16/devops-aws/blob/master/screenshots/VPC-07.png)
  * Security Groups
    - What traffic is allowed in at the resource (server) level ?
    - Unlike Network ACLs, Security Groups only cares about whether or not the traffic is allowed to enter or leave.
    - Security Groups can't explicitly deny traffic
    - Security Groups are Stateful - reponses to requests initiated from our VPC allowed back in
    - Servers/Services can have Multiple Security Groups
    - ![alt text](https://github.com/zoro16/devops-aws/blob/master/screenshots/VPC-09.png)

  * ![alt text](https://github.com/zoro16/devops-aws/blob/master/screenshots/VPC-10.png)


#### VPC Bastions and Key Pairs
  * Bastion Server
    - Is a server that we put into one of our VPCs Public Subnets so that its accessable from the internet, and from it we can access the private servers/services in our VPC
    - ![alt text](https://github.com/zoro16/devops-aws/blob/master/screenshots/VPC-11.png)

  * Key Pairs
    - SSH Key Pairs for EC2 Access


#### Approaches to VPC Creation
  * [IP Address Guide](https://www.ipaddressguide.com/cidr)
  * [MX Toolbox](https://mxtoolbox.com/subnetcalculator.aspx)
  * What availability zones should they reside in?
    - All of them
  * How many subnets do we need?
    - At minimum, one in every AZ
  * How big should they be?
    - How many servers and services do we predict needing?
  * Steps to your own IP Range CIDR Blocks
    1. Read up more on CIDR Notation
    2. Decide on the size of the subnets
    3. Use a subnet calculator to create ranges
  * some exmaples
    ![alt text](https://github.com/zoro16/devops-aws/blob/master/screenshots/VPC-12.png)
    ![alt text](https://github.com/zoro16/devops-aws/blob/master/screenshots/VPC-13.png)


#### Setting Up Our VPC
  * Create VPC
    - `Name tag`=> `<anyname>`
    - `IPv4 CIDR block`=> `10.0.0.0/20`
    - `Tenancy` => `Default`, not that `Default`means we share space with tendance, whereas it's not the case in  `Dedicated`
  * Create Subnets
    - We are going to create 4 subnets for each availability zone that we want to support
    - The 4 main subnets are going to be for `private`, `public`, `db`, and `spare` subnets
    - example
      ```
      Availability Zone: ap-southeast-1a
      -----------------------------
      10.0.0.0/24 - vpcity-a-public
      10.0.1.0/25 - vpcity-a-private
      10.0.1.128/26 - vpcity-a-db
      10.0.1.192/26 - vpcity-a-spare

      Availability Zone: ap-southeast-1b
      -----------------------------
      10.0.2.0/24 - vpcity-b-public
      10.0.3.0/25 - vpcity-b-private
      10.0.3.128/26 - vpcity-b-db
      10.0.3.192/26 - vpcity-b-spare
      ```
    - Another example
        ```
        Availability Zone: us-east-1a
        -----------------------------
        10.0.0.0/24 - vpcity-a-public
        10.0.1.0/25 - vpcity-a-private
        10.0.1.128/26 - vpcity-a-db
        10.0.1.192/26 - vpcity-a-spare
        
        Availability Zone: us-east-1b
        -----------------------------
        10.0.2.0/24 - vpcity-b-public
        10.0.3.0/25 - vpcity-b-private
        10.0.3.128/26 - vpcity-b-db
        10.0.3.192/26 - vpcity-b-spare
        
        Availability Zone: us-east-1c
        -----------------------------
        10.0.4.0/24 - vpcity-c-public
        10.0.5.0/25 - vpcity-c-private
        10.0.5.128/26 - vpcity-c-db
        10.0.5.192/26 - vpcity-c-spare
        
        Availability Zone: us-east-1d
        -----------------------------
        10.0.6.0/24 - vpcity-d-public
        10.0.7.0/25 - vpcity-d-private
        10.0.7.128/26 - vpcity-d-db
        10.0.7.192/26 - vpcity-d-spare
        
        Availability Zone: us-east-1e
        -----------------------------
        10.0.8.0/24 - vpcity-e-public
        10.0.9.0/25 - vpcity-e-private
        10.0.9.128/26 - vpcity-e-db
        10.0.9.192/26 - vpcity-e-spare
        ```
    - Now for every public subnet we've create we need to do the following:
      1. Select the public subnet 
      2. `Subnet Actions -> Modify auto-assign IP settings`
      3. Tick `Auto-assign IPs`
    - The above step is need to *Enable auto-assign public IPv4 or IPv6 addresses to automatically request an IP address for instances launched into this subnet.*

  * Create Internet Gateway
    - Go to `Internet Gateways`
    - Click on `Create Internet Gateway` and give it a Name tag
    - Select the newly created Internet Gateway and then click `Attach to VPC`, then select our `VPC`

  * Create Route Tables, from `Route Tables -> Create Route Table`
    - We need to create 2 route tables, one for `private` another is `public`
    - For our VPC there will be an auto created Route Table and it's `Private`,
      so we can just rename it as so. Its private because it the only `destination` it points to is `10.0.0.0/20`
    - Now create you a new Route table `public`
      - we need to add a route to the internet
      - from `Routes`, click `Edit`, then `Add another route`
      - `Destination`=> `0.0.0.0/0`, `Target`=> `the Internet Gateway we've created previously`
      - Now even thought we've connect to the Internet Gateway, we have no Subnets associated to it
        - To do so go to `Subnet Associations`
        - click `Edit`
        - select all the public subnets
        - click `Save`
      - If any of the private subnets needs access to the internet, they need NAT Gateway

  * Create a NAT Gateway, from `NAT Gateways -> Create NAT Gateway`
    - `Subnet` => `one of the public subnets`
    - `Elastic IP Allocation ID` => we need to assign an Elastic IP to this NAT Gateway, we just click `Create New EIP`
    - `Create a NAT Gateway`
  * We head back to `Route Tables`, select our `private route table`
    - click `Routes`, then `Edit`, then `Add another route`
    - `Destination`=> `0.0.0.0/0`, `Target`=> `the NAT Gateway we've created previously`



#### Bastion Server
  1. Create a security groups for the bastion server with the following `Inbound Rules`
     1. `Type`=> `ssh`
     2. `Protocol` => `TCP`
     3. `Port Range` => `22`
     4. `Source` => we set it as our current machine's IP e.g. `123.1212.33.212/32`
  2. Create Key Pair
  3. Launch an EC2 Instane (AMI)
  4. `ssh -A ec2-user@<instance ip>`, we're using `-A` option to copy the key to our instance.
  5. Once we're in:
     1. `sudo yum update -y`
     2. `sudo yum install mysql -y`, we need to login to our bastion instance,
     from here login connect to our RDS server


#### IAM Overview
  1. Policies
    1. `Who` do `what` to `which` resourcese. `When` do we care?
    2. `Who` => `principal`, `what` => `actions`, `when` => `conditions`
    3. `Principal` => `user`, `group`, or `role`
  2. Users
    1. They can't do anything until we attach policies to them.
  3. Groups
    1. Groups just serve as a delegation for users to share polices
  4. Roles
    1. Roles allow other services, like EC2, to act on other AWS resources
