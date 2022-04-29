# Solution

### Step 1: Creating the sql instance
Notice the authorized networks field. By default only RFC-1918 addresses like 192.168.0.0/16 have access to the SQL instance.
Our local ip is non-conformant towards this so we have to let Cloud SQL know that it can trust us.  
Editing this setting removes the other whitelisted ip ranges so after this command only our computer can connect with the instance. 
```
gcloud sql instances create app-sql-instance \
  --database-version=POSTGRES_12 \
  --tier=db-f1-micro \
  --zone=europe-west1-c \
  --authorized-networks={your-local-machine-ip-address/32}
```
Afterwards we have to set a password for the default postgres user.
```
gcloud sql users set-password postgres \
  --instance=app-sql-instance \
  --password={a-password}
```

### Step 2: Create the database
```
gcloud sql databases create app-database --instance=app-sql-instance
```

### Step 3: Create a new user for connection with our database
New users will automatically be superusers.
```
gcloud sql users create app --instance=app-sql-instance --password={a-password}
```
After this, you should be able to connect with the database from your local machine with the following command:
```
psql "sslmode=disable dbname=app-database user=app hostaddr={public ip address of instance}"
```

### Step 4: Create the VPC network for our Compute instance
```
gcloud compute networks create training-network --subnet-mode=custom
gcloud compute networks subnets create app-subnet \
  --network=training-network \
  --range=192.168.0.0/29
```

### Step 5: Create our Compute instance
```
gcloud compute instances create application \
  --image-family=ubuntu-2004-lts \
  --image-project=ubuntu-os-cloud \
  --machine-type=e2-small \
  --network=training-network \
  --subnet=app-subnet \
  --tags=application \
  --metadata-from-file=startup-script={path-to-file}

## startup script app 
#! /bin/bash
apt-get update
curl -fsSL https://deb.nodesource.com/setup_16.x | bash -
apt-get install -y nodejs
npm install pm2@latest -g
pm2
```

### Step 6: Expose our Compute instance
```
gcloud compute firewall-rules create allow-ssh \
  --action=ALLOW \
  --rules tcp:22 \
  --target-tags application \
  --network=training-network;

gcloud compute firewall-rules create enable-port-3000 \
  --action=ALLOW \
  --rules tcp:3000 \
  --target-tags application \
  --network=training-network;
```

### Step 7: Allow our Compute instance to make connection with Cloud SQL
```
gcloud sql instances patch app-sql-instance --authorized-networks={compute engine public ip/32}
```

### Step 8: Move application to Compute instance and run it
Fill in the env variables in the ecosystem.config.js file and run the following commands
```
npm install
npm run build
tar -czvf application.tgz ./dist package.json ecosystem.config.js
gcloud compute scp application.tgz root@application:/var
gcloud compute ssh application --command="cd /var && sudo tar -xzf application.tgz && sudo rm application.tgz && sudo npm install --production && pm2 start ecosystem.config.js"
```

## Intermediate result
After all this, you should be able to use the service and the task is in principal finished. We do have a little problem right now regarding our Cloud SQL instance however.  
Currently, our instance is publicly exposed to the outside world via it's public ip. We can resolve this by disabling the public ip and assigning a private ip for private access on the Cloud SQL instance.  
Since Cloud SQL is a managed service we will have to setup private services access to allow for vpc peering to our Cloud SQL instance. 

### Step 1: Set up private services access
Private services can never go beyond a prefix-length of 24 regarding Google specificiations.
```
gcloud compute addresses create google-managed-services-training-network \
  --global \
  --purpose=VPC_PEERING \
  --addresses=192.168.1.0 \
  --prefix-length=24 \
  --network=projects/winter-brand-343714/global/networks/training-network
```
After this, our training-network is ready to set up vpc peering connections in the range of 192.168.1.0/24. 
Note that using 192.168.0.0/24 would have resulted in a conflict with our app-subnet which reserves 192.168.0.0/29.

### Step 2: Set up the peering connection in our training-network
```
gcloud services vpc-peerings connect \
  --service=servicenetworking.googleapis.com \
  --ranges=google-managed-services-training-network \
  --network=training-network \
  --project=winter-brand-343714
```
After this command, we have set up our future vpc peering connections for our project to be assigned in 192.168.1.0/24 of our training-network.

### Step 3: Update Cloud SQL to use a private ip
With below command, we patch our Cloud SQL instance to drop it's public ip and assign itself a private ip in the range of our network specified in the previous steps.
```
gcloud sql instances patch app-sql-instance \
  --project=winter-brand-343714 \
  --network=projects/winter-brand-343714/global/networks/training-network \
  --no-assign-ip
```

### Step 4: Update our application
SSH into the application Compute Engine and go to the ecosystem.config.js file.
Change the ip address to the private ip of the Cloud SQL instance and restart.  
You should see your data again.  
Break down your environment when satisfied. 