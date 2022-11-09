/**
 * Contains all the configurations required for setting up the core project
 * While most of the parameters are optional, appInsights connection is 
 * a required parameter since it is auto imported in the `tdei_logger.ts`
 */
export const environment = {
    connections:{
        serviceBus: "XXXX",
        blobStorage:"XXXX",
        appInsights:"XXXX"
    },
    queueName:"tdei-poc-queue",
    blobContainerName:"tdei-storage-test",
    appName: process.env.npm_package_name
}