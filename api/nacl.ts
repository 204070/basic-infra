import * as aws from "@pulumi/aws";
import { cidrOpenToInternet } from "./utils";
import {
    privateSubnet1,
    privateSubnet2,
    publicSubnet1,
    publicSubnet2,
    vpc,
} from "./vpc";

// Create public network ACL
const webNaclName = "api-web-nacl";
export const webNacl = new aws.ec2.NetworkAcl(webNaclName, {
    egress: [
        {
            action: "allow",
            cidrBlock: cidrOpenToInternet,
            fromPort: 80,
            protocol: "tcp",
            ruleNo: 100,
            toPort: 80,
        },
        {
            action: "allow",
            cidrBlock: cidrOpenToInternet,
            fromPort: 443,
            protocol: "tcp",
            ruleNo: 110,
            toPort: 443,
        },
        {
            action: "allow",
            cidrBlock: cidrOpenToInternet,
            fromPort: 32768,
            protocol: "tcp",
            ruleNo: 120,
            toPort: 65535,
        },
        {
            action: "allow",
            cidrBlock: cidrOpenToInternet,
            fromPort: 22,
            protocol: "tcp",
            ruleNo: 130,
            toPort: 22,
        },
        {
            action: "allow",
            // cidrBlock: "10.0.3.0/24", // private rds
            cidrBlock: "10.0.1.0/24",
            fromPort: 5432,
            protocol: "tcp",
            ruleNo: 140,
            toPort: 5432,
        },
        {
            action: "allow",
            // cidrBlock: "10.0.4.0/24", // private rds
            cidrBlock: "10.0.2.0/24",
            fromPort: 5432,
            protocol: "tcp",
            ruleNo: 150,
            toPort: 5432,
        },
    ],
    ingress: [
        {
            action: "allow",
            cidrBlock: cidrOpenToInternet,
            fromPort: 80,
            protocol: "tcp",
            ruleNo: 100,
            toPort: 80,
        },
        {
            action: "allow",
            cidrBlock: cidrOpenToInternet,
            fromPort: 443,
            protocol: "tcp",
            ruleNo: 110,
            toPort: 443,
        },
        {
            action: "allow",
            cidrBlock: cidrOpenToInternet,
            fromPort: 22,
            protocol: "tcp",
            ruleNo: 120,
            toPort: 22,
        },
        {
            action: "allow",
            cidrBlock: "10.0.3.0/24",
            fromPort: 32768,
            protocol: "tcp",
            ruleNo: 130,
            toPort: 65535,
        },
        {
            action: "allow",
            cidrBlock: "10.0.4.0/24",
            fromPort: 32768,
            protocol: "tcp",
            ruleNo: 140,
            toPort: 65535,
        },
        {
            action: "allow",
            cidrBlock: cidrOpenToInternet,
            fromPort: 1024,
            protocol: "tcp",
            ruleNo: 150,
            toPort: 65535,
        },
    ],
    subnetIds: [publicSubnet1.id, publicSubnet2.id],
    tags: {
        Name: webNaclName,
    },
    vpcId: vpc.id,
});

const rdsNaclName = "api-rds-nacl";
export const rdsNacl = new aws.ec2.NetworkAcl(rdsNaclName, {
    egress: [
        {
            action: "allow",
            // cidrBlock: "10.0.1.0/24", // private rds
            cidrBlock: cidrOpenToInternet,
            fromPort: 5432,
            protocol: "tcp",
            ruleNo: 100,
            toPort: 5432,
        },
        {
            action: "allow",
            // cidrBlock: "10.0.2.0/24", // private rds
            cidrBlock: cidrOpenToInternet,
            fromPort: 5432,
            protocol: "tcp",
            ruleNo: 110,
            toPort: 5432,
        },
        {
            action: "allow",
            cidrBlock: "10.0.1.0/24",
            fromPort: 32768,
            protocol: "tcp",
            ruleNo: 120,
            toPort: 65535,
        },
        {
            action: "allow",
            cidrBlock: "10.0.2.0/24",
            fromPort: 32768,
            protocol: "tcp",
            ruleNo: 130,
            toPort: 65535,
        },
    ],
    ingress: [
        {
            action: "allow",
            // cidrBlock: "10.0.1.0/24", private rds
            cidrBlock: cidrOpenToInternet,
            fromPort: 5432,
            protocol: "tcp",
            ruleNo: 100,
            toPort: 5432,
        },
        {
            action: "allow",
            // cidrBlock: "10.0.2.0/24", // private rds
            cidrBlock: cidrOpenToInternet,
            fromPort: 5432,
            protocol: "tcp",
            ruleNo: 110,
            toPort: 5432,
        },
        {
            action: "allow",
            cidrBlock: cidrOpenToInternet,
            fromPort: 1024,
            protocol: "tcp",
            ruleNo: 120,
            toPort: 65535,
        },
    ],
    // subnetIds: [privateSubnet1.id, privateSubnet2.id], // private rds
    subnetIds: [publicSubnet1.id, publicSubnet2.id],
    tags: {
        Name: rdsNaclName,
    },
    vpcId: vpc.id,
});
