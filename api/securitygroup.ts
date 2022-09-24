import * as aws from "@pulumi/aws";
import { addStackSuffix, cidrOpenToInternet } from "./utils";
import { vpc } from "./vpc";

//Create security groups
const webSecurityGroupName = addStackSuffix("api-web-security-group");
export const webSecurityGroup = new aws.ec2.SecurityGroup(webSecurityGroupName, {
    description: "Security group for public internet traffic",
    egress: [
        {
            cidrBlocks: [cidrOpenToInternet],
            description: "ALL",
            fromPort: 0,
            protocol: "-1",
            toPort: 0,
        },
    ],
    ingress: [
        {
            cidrBlocks: [cidrOpenToInternet],
            description: "HTTP",
            fromPort: 80,
            protocol: "tcp",
            toPort: 80,
        },
        {
            cidrBlocks: [cidrOpenToInternet],
            description: "HTTPS",
            fromPort: 443,
            protocol: "tcp",
            toPort: 443,
        },
        {
            cidrBlocks: [cidrOpenToInternet],
            description: "SSH",
            fromPort: 22,
            protocol: "tcp",
            toPort: 22,
        },
    ],
    tags: {
        Name: webSecurityGroupName,
    },
    vpcId: vpc.id,
});

//Create security groups
const rdsSecurityGroupName = addStackSuffix("api-rds-security-group");
export const rdsSecurityGroup = new aws.ec2.SecurityGroup(
    rdsSecurityGroupName,
    {
        description:
            "Security group for traffic coming into the private subnet",
        egress: [
            {
                cidrBlocks: [cidrOpenToInternet],
                fromPort: 0,
                protocol: "-1",
                toPort: 0,
            },
        ],
        ingress: [
            {
                // cidrBlocks: ["10.0.1.0/24"], // private rds
                cidrBlocks: [cidrOpenToInternet],
                description: "Postgres DB",
                fromPort: 5432,
                protocol: "tcp",
                securityGroups: [webSecurityGroup.id],
                toPort: 5432,
            },
            {
                cidrBlocks: ["10.0.1.0/24"],
                description: "ALL",
                fromPort: 0,
                protocol: "-1",
                toPort: 0,
            },
        ],
        tags: {
            Name: rdsSecurityGroupName,
        },
        vpcId: vpc.id,
    }
);
