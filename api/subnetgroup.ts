import * as aws from "@pulumi/aws";
import { addStackSuffix } from "./utils";
import {
    privateSubnet1,
    privateSubnet2,
    publicSubnet1,
    publicSubnet2,
} from "./vpc";

// Create VPC subnet groups
export const subnetGroupName = addStackSuffix("api-subnet-group");
export const subnetGroup = new aws.rds.SubnetGroup(subnetGroupName, {
    description: "Subnet group for RDS",
    // subnetIds: [privateSubnet1.id, privateSubnet2.id], private rds
    subnetIds: [publicSubnet1.id, publicSubnet2.id],
    tags: {
        Name: subnetGroupName,
    },
});
