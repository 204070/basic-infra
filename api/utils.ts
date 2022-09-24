import * as pulumi from "@pulumi/pulumi";

const config = new pulumi.Config();
export const projectName = config.get("project-name");
export const projectPath = config.get("project-path");
export const sshKeyPath =
    config.get("ssh-key-path") || "/home/seun/.ssh/id_rsa.pub";

export const smallAmi = config.get("small-ami") || "ami-0440e5026412ff23f";
export const region = config.get("aws:region") || "eu-north-1";
export const cidrOpenToInternet =
    config.get("cidrOpenToInternet") || "0.0.0.0/0";

export const stackName = pulumi.getStack();
export function addStackSuffix(name: string) {
    return name + "-" + stackName;
}

export const dbPassword = config.getSecret("db-password");
export const dbUsername = config.get("db-username");
export const dbName = config.get("db-name");