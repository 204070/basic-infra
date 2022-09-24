import * as aws from "@pulumi/aws";
import * as fs from "fs";
import { addStackSuffix, smallAmi, sshKeyPath, projectPath } from "./utils";
import { availabilityZoneA, publicSubnet1 } from "./vpc";
import { webSecurityGroup } from "./securitygroup";

const seunKeyPair = new aws.ec2.KeyPair("seun_key_pair", {
    publicKey: fs.readFileSync(sshKeyPath).toString(),
});

// Create EC2
const ec2InstanceName = addStackSuffix("api-node-1");
const ec2InstanceType = "t3.micro";

const userData = fs
    .readFileSync(`${projectPath}/api/files/setup.sh`)
    .toString();

export const ec2Instance1 = new aws.ec2.Instance(ec2InstanceName, {
    ami: smallAmi,
    associatePublicIpAddress: true,
    availabilityZone: availabilityZoneA,
    instanceType: ec2InstanceType,
    keyName: seunKeyPair.id,
    sourceDestCheck: false,
    subnetId: publicSubnet1.id,
    tags: {
        Name: ec2InstanceName,
    },
    userData,
    vpcSecurityGroupIds: [webSecurityGroup.id],
});

// Create ec2 elastic IP
const ec2ElasticIPName = addStackSuffix(`${ec2InstanceName}-eip`);
export const ec2ElasticIP = new aws.ec2.Eip(ec2ElasticIPName, {
    instance: ec2Instance1.id,
    vpc: true,
});
