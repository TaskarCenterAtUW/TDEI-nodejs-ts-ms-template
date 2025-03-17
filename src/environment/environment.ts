/**
 * Contains all the configurations required for setting up the core project
 * While most of the parameters are optional, it is recommended to set them up
 * for a better experience
 */
export const environment = {
    queueName:"tdei-poc-queue",
    storageContainerName:"tdei-storage-test",
    appName: process.env.npm_package_name,
    topic: 'gtfs-flex-upload',
    
}