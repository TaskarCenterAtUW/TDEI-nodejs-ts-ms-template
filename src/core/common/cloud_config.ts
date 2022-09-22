/**
 * Cloud configuration allows to easily connect to the cloud for all the existing
 * modules
 */
export enum CloudType {
    Azure,
    Gcp,
    AWS
}

export class CloudConfig{
    public cloudType: CloudType = CloudType.Azure; // By default
    public connectionString: string;

    constructor(connectionString:string,cloudType:CloudType = CloudType.Azure){
        this.connectionString = connectionString;
        this.cloudType = cloudType;
    }
}
