#! /bin/bash
cd ../gcloud-basic-app
# Set up the VPC network for our instance
gcloud compute networks create training-network --subnet-mode=custom
gcloud compute networks subnets create training-network-subnet \
  --network=training-network \
  --range=192.168.0.0/29
gcloud compute firewall-rules create enable-port-3000 \
  --action=ALLOW \
  --rules tcp:3000 \
  --network=training-network;
gcloud compute firewall-rules create enable-ssh \
  --action=ALLOW \
  --rules tcp:22 \
  --network=training-network;
# Create the new Compute Engine instance and assign to the network/subnet
gcloud compute instances create nestjs-instance \
  --image-family=ubuntu-2004-lts \
  --image-project=ubuntu-os-cloud \
  --machine-type=e2-small \
  --network=training-network \
  --subnet=training-network-subnet
  --metadata-from-file=startup-script=../startup-script/startup.sh
# Build our NestJS application and move it to the instance
npm install
npm run build
tar -czvf application.tgz ./dist package.json
gcloud compute scp application.tgz root@nestjs-instance:/var
gcloud compute ssh nestjs-instance --command="cd /var && sudo tar -xzf application.tgz && sudo rm application.tgz && npm install --production && pm2 start dist/main.js --name application"