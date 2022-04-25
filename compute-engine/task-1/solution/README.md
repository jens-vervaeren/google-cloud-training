# Solution

### Step 1: Create the network
We start of by creating a new network with subnet mode set to custom.  
```bash
gcloud compute networks create training-network --subnet-mode=custom
```
This tells Google Cloud that we are going to create our own subnets and that it shouldn't provide us with a predefined subnet in each of the regions.  
As for our subnet creation:  
```bash
gcloud compute networks subnets create training-network-subnet \
  --network=training-network \
  --range=192.168.0.0/29
```
Notice that the subnet mask `/29` does not seem to adhere to the masks specified in the documentation of Class A, B or C networks.  
Google actually allows to use other subnets masks, the smallest being `/29` as we defined above, as long as the resulting ip range falls in between the valid ip ranges and does not conflict with the prohibited ranges specified [here](https://cloud.google.com/vpc/docs/subnets#ipv4-ranges)  
Our resulting useable range is 192.168.0.2 to 192.168.0.6, due to Google Cloud reservations, which is nicely in range of a Class C network and doesn't conflict with any of the prohibited ranges.

After creation of the subnet, we will create two firewall rules.  
```bash
gcloud compute firewall-rules create enable-port-3000 \
  --action=ALLOW \
  --rules tcp:3000 \
  --network=training-network;
gcloud compute firewall-rules create enable-ssh \
  --action=ALLOW \
  --rules tcp:22 \
  --network=training-network;
```
Notice the enabling of port 3000.  
This is the default port the NestJS application runs on that we will expose to the outside world.  
So our application will be available to the outside world on http://{ip of instance}:3000  
We will discuss port forwarding rules later on how to match incoming calls on port 80 to the running instance port, so for now this is enough.

### Step 2: Create the Compute Engine instance
With the following command, we will create the Compute Engine instance that will run our NestJS application.
```bash
gcloud compute instances create nestjs-instance \
  --image-family=ubuntu-2004-lts \
  --image-project=ubuntu-os-cloud \
  --machine-type=e2-small \
  --network=training-network \
  --subnet=training-network-subnet
  --metadata-from-file=startup-script={path-to-file}
```
With this command, we setup an Ubuntu 20.04 Compute Engine that gets an internal ip in the range we specified on our `training-network-subnet` earlier on.  
Notice that, I pass in a startup script from a file. This startup script is located in the folder with the same name and contains the following:
```bash
#! /bin/bash
apt-get update
curl -fsSL https://deb.nodesource.com/setup_lts.x | bash -
apt install -y nodejs
npm install pm2@latest -g
```
In short this does the following:
* We update the base packages of Ubuntu
* We download the LTS nodesource and build it locally
* We then install NodeJS which will refer to the built source version
* Lastly, I install pm2 which is a node-based process manager to manage the running of our application on the server. This is optional as you can also use systemd for this which comes pre-installed.

Now that we have our Compute Engine instance and exposed it to the outside world, it is time to enable our application on it.  
For this we first have to build our NestJS application in the `gcloud-basic-app` folder:
```bash
npm install
npm run build
```
After this we have to create a tar archive of the dist folder and the package.json file.
```bash
tar -czvf application.tgz ./dist package.json
```
Once we have the archive we have to move it over to the instance and start up the application
```bash
gcloud compute scp application.tgz root@nestjs-instance:/var
gcloud compute ssh nestjs-instance --command="cd /var && sudo tar -xzf application.tgz && sudo rm application.tgz && npm install --production && pm2 start dist/main.js --name application"
```
The first command copies our tar archive to the instance.  
The second one unpacks it, throws the archive away, installs the dependencies and uses the pm2 process manager to startup the application.  
The reason we are able to do this is because we have enabled the ssh port to be accessed with a firewall-rule earlier.

When all this has passed, you should be able to view a message on the following url:  
http://{external-ip-of-instance}:3000

Clean up your services when done.
