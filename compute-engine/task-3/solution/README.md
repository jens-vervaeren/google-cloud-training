# Solution

### Step 1: Create the network and subnets
You have already seen this. We set up a network and assign two subnets to it.  
This to better separate the instances. You can also only create one if you prefer.
```bash
gcloud compute networks create training-network --subnet-mode=custom
gcloud compute networks subnets create app-subnet \
  --network=training-network \
  --range=192.168.0.0/29
gcloud compute networks subnets create database-subnet \
  --network=training-network \
  --range=192.168.0.8/29
```

### Step 2: Create the two Compute Engine instances
We spin up two Compute Engine instances.  
The startup script of the application gets the environment ready for the NestJs app. Note the tags we assign to each instance. This is to better manage them without having to use their ip ranges.
```bash
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
The startup script of the database instance, installs a Postgres database.
```bash
gcloud compute instances create database \
  --image-family=ubuntu-2004-lts \
  --image-project=ubuntu-os-cloud \
  --machine-type=e2-small \
  --network=training-network \
  --subnet=database-subnet \
  --tags=database \
  --metadata-from-file=startup-script={path-to-file}

## Startup script database
#! /bin/bash
apt-get update
apt-get install -y postgresql-12 postgresql-contrib
systemctl start postgresql.service
```

### Step 3: Allow SSH'ing into the instances
Pretty straightforward
```bash
gcloud compute firewall-rules create allow-ssh \
  --action=ALLOW \
  --rules tcp:22 \
  --target-tags application,database \
  --network=training-network;
```

### Step 4: Complete database setup on the instance
To complete our Postgres install, we have to change it's settings to allow connections from the outside. We also need a new postgres user for that
```
gcloud compute ssh database 
# While on instance
sudo su postgres
createuser -s app
createdb app
psql 
# while on the sql cli
ALTER ROLE app WITH password='{your-password}';
```

Location of the following files you have to edit is default here:
```
/etc/postgresql/{version -> in our case 12}/main
```

Edit postgres.conf to allow connections from outside:
```
listen_addresses = '*'
```

Edit pg_hba.conf to allow incoming connections http connections but perform MD5 authentication for the user' password:
```
# TYPE  DATABASE        USER            ADDRESS                 METHOD
host    all             all             0.0.0.0/0               md5
```

### Step 5: Open up connections to the database for the application instance
Allow connections made on port 5432 of our database, but only for connections coming from our application instance. Notice the use of the tags.  
We assign the rule to an instance by use of `target-tags` field and only allow the rule for others by use of the `source-tags` field.
```bash
gcloud compute firewall-rules create allow-db-connection \
  --action=ALLOW \
  --rules tcp:5432 \
  --target-tags database \
  --source-tags application \
  --network=training-network;
```

### Step 6: Move the application to the designated instance
Before building and moving our application, let's take a step back and look at what we need to do to make the application run.  
We need to let our application know where our database is located to connect with it. This can be done via environment variables. PM2 allows us to pass these through the use of an ecosystem config file. There is one supplied in the solution folder that looks like this:
```javascript
module.exports = {
  apps: [{
    name: "crud-application",
    script: "./dist/main.js",
    env: {
      NODE_ENV: "production",
      APP_PORT: 3000,
      POSTGRES_HOST: "{internal dns of database}",
      POSTGRES_PORT: 5432,
      POSTGRES_DATABASE: "app",
      POSTGRES_USERNAME: "app",
      POSTGRES_PASSWORD: "{password}"
    }
  }]
}
```
All of these should be self-explanatory but take a look at the `POSTGRES_HOST` variable. It says the host should be pointed towards the internal dns of the database.  
Remember that we only opened up port 5432 for the application instance? This means that our database is separated from the outside world but how can you connect to it then?  
The GCloud VPC allows us to connect with instances in the same network by making use of the so called internal DNS name of the instance.  
The internal DNS name is unusable for the outside world but allows instances in the same network to connect with eachother, regardless of the fact that we opened up connections towards the instance.  
This means that we can keep our database private from the outside while still allowing connections from our services.  
When you have filled in all the environment variables, run the following commands:
```bash
npm install
npm run build
tar -czvf application.tgz ./dist package.json ecosystem.config.js
gcloud compute scp application.tgz root@application:/var
gcloud compute ssh application --command="sudo su root && cd /var && tar -xzf application.tgz && rm application.tgz && npm install --production && pm2 start ecosystem.config.js"
```

### Step 7: Expose the application to the outside world
```bash
gcloud compute firewall-rules create enable-port-3000 \
  --action=ALLOW \
  --rules tcp:3000 \
  --target-tags application \
  --network=training-network;
```

When all has been done, you should be able to use the application. Clean up your services afterwards.

P.S.:  
In the application we put the synchronisation of the database on `true`. This to ensure we create all the necessary tables and columns. Proper database synchronisation is outside of the scope of this task as we would have to go in to much detail.