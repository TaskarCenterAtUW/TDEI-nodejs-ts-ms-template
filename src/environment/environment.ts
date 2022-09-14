export const environment = {
    connections:{
        serviceBus: "Endpoint=sb://tdei-sample.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=4UNDrVpThcnbqWlGFFQEcivuPlvMMWcSHwbyHgEv+rg=",
        blobStorage:"DefaultEndpointsProtocol=https;AccountName=tdeisamplestorage;AccountKey=l9JSJCGq9NrXqRVKApSk1wwV27aWaOVuxeY0NWOZz2svIlJzyncr3UFTzLoAanFbmJIeb2WmwIcS+AStj5gELg==;EndpointSuffix=core.windows.net",
        appInsights:"InstrumentationKey=f98ba6d5-58e1-4267-827e-ccac68caf50f;IngestionEndpoint=https://westus2-2.in.applicationinsights.azure.com/;LiveEndpoint=https://westus2.livediagnostics.monitor.azure.com/"
    },
    queueName:"tdei-poc-queue",
    blobContainerName:"tdei-storage-test",
    appName: process.env.npm_package_name
}