import * as aws from "@pulumi/aws";
import { rdsSecurityGroup } from "./securitygroup";
import { subnetGroup } from "./subnetgroup";
import { addStackSuffix, dbName, dbPassword, dbUsername } from "./utils";
import { privateSubnet1, publicSubnet1 } from "./vpc";

// Create RDS
const rdsInstanceName = addStackSuffix("api-master-rds");
const rdsInstanceClass = "db.t3.micro";

export const rdsInstance = new aws.rds.Instance(rdsInstanceName, {
    allocatedStorage: 5,
    // availabilityZone: privateSubnet1.availabilityZone, // private rds
    availabilityZone: publicSubnet1.availabilityZone,
    backupRetentionPeriod: 30,
    backupWindow: "03:00-06:00",
    dbSubnetGroupName: subnetGroup.name,
    deletionProtection: false,
    engine: "postgres",
    engineVersion: "14.2",
    finalSnapshotIdentifier: `${rdsInstanceName}-snap`,
    identifier: rdsInstanceName,
    instanceClass: rdsInstanceClass,
    maintenanceWindow: "Mon:00:00-Mon:03:00",
    multiAz: false,
    dbName: dbName,
    password: dbPassword,
    port: 5432,
    skipFinalSnapshot: true,
    publiclyAccessible: true, // remove when private rds subnets are used
    storageType: "gp2",
    tags: {
        Name: rdsInstanceName,
    },
    username: dbUsername,
    vpcSecurityGroupIds: [rdsSecurityGroup.id],
});
