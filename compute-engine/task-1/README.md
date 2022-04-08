# Compute Engine: Task 1

### Set up a Compute Engine instance with a small NestJS API that is accessible from a public IP address

For this exercise, you will setup a Compute Engine instance that will run a small NestJS API that is publicly available to the outside world via it's external IP.  
Since this will probably be your first time experiencing the Google Cloud environment, a lot of elements will be new so for this first task we will provide a more outlined explanation in which steps you have to take to get the desired end result.

At first sight, the task at hand might seem pretty simple:  
Spin up an Compute Engine, plop some code in there and access via it's IP.
It's not all that simple.

First of all, a Compute Engine instance needs to be assigned to a subnet in a network.
We can use the default network Google provides us for this but to better understand the capabilities of the VPC were are going to handle this ourselves. For that we need to create a network, a subnet and firewall-rules in our Google VPC.  
After we have spin up our Compute Engine, we only have an empty server so we will need to install NodeJS on it and optionally a process manager since if you are familiar with local NodeJS development you might know that the node process runs until you quit it on your CLI. This means we also have to interact with a process manager to be able to keep our NodeJS application running after we leave.

In short, the tasks you have to perform:
1. Create a new network called training-network
2. Create a new subnet called training-network-subnet
3. Create two firewall rules, one to allow access on port 3000 and one to allow ssh connections
4. Create a Compute Engine instance named nestjs-instance that situates itself in the training-network-subnet
5. Create a NestJS application that outputs some text on the index route
6. Build the NestJS application and copy it to the Compute Engine instance
7. On the instance, run the NestJS application via a process manager like pm2 or systemd

Documentation:  
[Google Cloud VPC](https://cloud.google.com/vpc/docs/vpc)  
[Google Compute Engine](https://cloud.google.com/compute/docs/instances)  
[NestJS](https://docs.nestjs.com/)  
[PM2 (Process manager)](https://pm2.keymetrics.io/docs/usage/quick-start/)  
[Systemd with NodeJS (Process manager)](https://natancabral.medium.com/run-node-js-service-with-systemd-on-linux-42cfdf0ad7b2)  
