import * as aws from "@pulumi/aws";
import { addStackSuffix, cidrOpenToInternet, region } from "./utils";

// Create a VPC
const vpcName = addStackSuffix("api-vpc");
export const vpc = new aws.ec2.Vpc(vpcName, {
    cidrBlock: "10.0.0.0/16",
    enableDnsHostnames: true,
    enableDnsSupport: true,
    instanceTenancy: "default",
    tags: {
        Name: vpcName,
    },
});

export const availabilityZoneA = `${region}a`;
export const availabilityZoneB = `${region}b`;

// Create a public subnet
const publicSubnet1Name = addStackSuffix("api-public-subnet-1");
export const publicSubnet1 = new aws.ec2.Subnet(publicSubnet1Name, {
    availabilityZone: availabilityZoneA,
    cidrBlock: "10.0.1.0/24",
    tags: {
        Name: publicSubnet1Name,
    },
    vpcId: vpc.id,
});

const publicSubnet2Name = addStackSuffix("api-public-subnet-2");
export const publicSubnet2 = new aws.ec2.Subnet(publicSubnet2Name, {
    availabilityZone: availabilityZoneB,
    cidrBlock: "10.0.2.0/24",
    tags: {
        Name: publicSubnet2Name,
    },
    vpcId: vpc.id,
});

// Create a private subnet
const privateSubnet1Name = addStackSuffix("api-private-subnet-1");
export const privateSubnet1 = new aws.ec2.Subnet(privateSubnet1Name, {
    availabilityZone: availabilityZoneA,
    cidrBlock: "10.0.3.0/24",
    tags: {
        Name: privateSubnet1Name,
    },
    vpcId: vpc.id,
});

const privateSubnet2Name = addStackSuffix("api-private-subnet-2");
export const privateSubnet2 = new aws.ec2.Subnet(privateSubnet2Name, {
    availabilityZone: availabilityZoneB,
    cidrBlock: "10.0.4.0/24",
    tags: {
        Name: privateSubnet2Name,
    },
    vpcId: vpc.id,
});

// Create internet gateway
const internetGatewayName = addStackSuffix("api-igw");
const internetGateway = new aws.ec2.InternetGateway(internetGatewayName, {
    tags: {
        Name: internetGatewayName,
    },
    vpcId: vpc.id,
});

// Create public route table
const publicRouteTableName = addStackSuffix("api-public-route-table");
const publicRouteTable = new aws.ec2.RouteTable(publicRouteTableName, {
    routes: [
        {
            cidrBlock: cidrOpenToInternet,
            gatewayId: internetGateway.id,
        },
    ],
    tags: {
        Name: publicRouteTableName,
    },
    vpcId: vpc.id,
});

// Associate the route table
const publicSubnetAssociation1Name = addStackSuffix("api-public-subnet-ass-1");
const publicSubnetAssociation1 = new aws.ec2.RouteTableAssociation(
    publicSubnetAssociation1Name,
    {
        routeTableId: publicRouteTable.id,
        subnetId: publicSubnet1.id,
    }
);

const publicSubnetAssociation2Name = addStackSuffix("api-public-subnet-ass-2");
const publicSubnetAssociation2 = new aws.ec2.RouteTableAssociation(
    publicSubnetAssociation2Name,
    {
        routeTableId: publicRouteTable.id,
        subnetId: publicSubnet2.id,
    }
);

// Create nat gateway
const natElasticIPName = addStackSuffix("api-nat-eip");
const natElasticIP = new aws.ec2.Eip(natElasticIPName, { vpc: true });

const natGatewayName = addStackSuffix("api-nat-gw");
const natGateway = new aws.ec2.NatGateway(
    natGatewayName,
    {
        allocationId: natElasticIP.id,
        subnetId: publicSubnet1.id,
    },
    {
        dependsOn: [internetGateway],
    }
);

// Create private route table
const privateRouteTableName = addStackSuffix("api-private-route-table");
const privateRouteTable = new aws.ec2.RouteTable(privateRouteTableName, {
    routes: [
        {
            cidrBlock: cidrOpenToInternet,
            natGatewayId: natGateway.id,
        },
    ],
    tags: {
        Name: privateRouteTableName,
    },
    vpcId: vpc.id,
});

// Associate the private route table
const privateSubnetAssociation1Name = addStackSuffix(
    "api-private-subnet-ass-1"
);
const privateSubnetAssociation1 = new aws.ec2.RouteTableAssociation(
    privateSubnetAssociation1Name,
    {
        routeTableId: privateRouteTable.id,
        subnetId: privateSubnet1.id,
    }
);

const privateSubnetAssociation2Name = addStackSuffix(
    "api-private-subnet-ass-2"
);
const privateSubnetAssociation2 = new aws.ec2.RouteTableAssociation(
    privateSubnetAssociation2Name,
    {
        routeTableId: privateRouteTable.id,
        subnetId: privateSubnet2.id,
    }
);
