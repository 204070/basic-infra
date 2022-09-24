import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as api from "./api";
import { ec2Instance1, rdsInstance } from "./api";

export const ec2 = ec2Instance1.publicIp;
export const rds = rdsInstance.endpoint;
