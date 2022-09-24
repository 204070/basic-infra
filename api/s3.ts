import * as aws from "@pulumi/aws";
import { addStackSuffix, projectName } from "./utils";

// Create an AWS resource (S3 Bucket)
const s3BucketName = addStackSuffix(`${projectName}-s3`);
const bucket = new aws.s3.Bucket(s3BucketName);

// Export the name of the bucket
export const bucketName = bucket.id;
