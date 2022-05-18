# Solution

### Step 1: Build a NestJS application
Check solution folder for a simple application that shows a message on the index route.
### Step 2: Create a Dockerfile to build the application image
Check the solution folder to find the following Dockerfile:
```docker
# Stage 1: Build distributable
FROM node:16-alpine AS distributable-build-stage
WORKDIR /installation
COPY package*.json ./
RUN npm install
COPY tsconfig.build.json ./
COPY tsconfig.json ./
COPY nest-cli.json ./
COPY ./src ./src
RUN npm run build

# Stage 2: Copy distributable and install only production modules
# We copy our distributable, production node modules
# We expose port 80 and supply an env variable to use for our application
FROM node:16-alpine AS serving-stage
COPY --from=distributable-build-stage ./installation/dist ./dist
COPY package*.json ./
RUN npm ci --production
ENV APP_PORT=80
ENTRYPOINT ["node", "dist/main"]
EXPOSE 80
```
Notice that the build is handled in two stages. During the first stage we build the dist folder of our application. The second stage installs only the production node modules and copies our distributable folder from the first build step.  
When the container is started, the command `node dist/main` is executed to start the application. Also notice the default env variable APP_PORT. This corresponds to our env variable our application needs to run on a specific port and can be overridden by passing the same env variable when starting the container.  

The reason we use multiple build steps and why we only install the production node_modules is because Docker images have to be as lightweight as possible.  
The bigger the image, the longer it takes to download from the repository and the longer it takes to startup your new VM hosted containerized application.

### Step 3: Publish your image to Google Cloud Artifact Registry
First of, create the repository you will push to:
```bash
gcloud artifacts repositories create training-repo --repository-format=docker --location=europe-west1
```
Then, authorize your local docker to push to the registry in your region:
```bash
gcloud auth configure-docker europe-west1-docker.pkg.dev
```
Afterwards, build your images in the application folder.  
Notice:  
Your images have to adhere to the following structure to be pushed to the repository: LOCATION-docker.pkg.dev/PROJECT-ID/REPOSITORY/IMAGE_NAME  
In our case, the location is europe-west1 and the repository is training-repo. I used training-application as image name. You can use the same or pick your own.
```bash
docker build --no-cache -t europe-west1-docker.pkg.dev/PROJECT-ID/training-repo/IMAGE_NAME:1.0 -t europe-west1-docker.pkg.dev/PROJECT-ID/training-repo/IMAGE_NAME:latest .
```
Lastly, push the images to the repository with the `docker push` command.  
The second push tags the uploaded version as the latest image.
```bash
docker push europe-west1-docker.pkg.dev/PROJECT-ID/training-repo/IMAGE:1.0 (for specific tag)
docker push europe-west1-docker.pkg.dev/PROJECT-ID/training-repo/IMAGE (for latest)
```
### Step 4: Create a training-network with a training-subnet just like task 1
This you have seen before. This is our network and subnet our managed instances will live in. 
```bash
gcloud compute networks create training-network --subnet-mode=custom
gcloud compute networks subnets create app-subnet \
  --network=training-network \
  --range=192.168.0.0/29
```
### Step 5: Create the instance template your managed instance group will run from using the previously created docker image
The instance template is the template where our Compute Engine VM's start from when being created in the managed instance group. Here we define in which network and subnet our VM's are started and scaled, which machine type they should run and etc.  
In this case we use the `create-with-container` command to specify we are starting from a container image. Just like instance templates, you can also create single VM's with command `gcloud compute instances create-with-container` instead of the `gcloud compute instances create` command you saw in the first task.
```bash
gcloud compute instance-templates create-with-container instance-template-training-v1 \
  --machine-type=e2-small \
  --network=training-network \
  --subnet=app-subnet \
  --tags=http-application \
  --container-image={europe-west1-docker.pkg.dev/PROJECT-ID/training-repo/IMAGE_NAME:1.0} \
  --container-env=APP_PORT=80
```
### Step 6: Start the managed instance group with a size of two
We specify our instance-template to start from, the starting size of our managed instance group and in which zone we want to deploy. For more failover, you can switch the zone variable for the region variable which will spread your VM's across an entire region.  
```bash
gcloud compute instance-groups managed create training-mig \
  --template=instance-template-training-v1 \
  --size=2 \
  --zone=europe-west1-c
```
Notice:  
Currently our managed instance group is not autoscaling but set at a default size of 2 VM's. To set autoscaling, use the following command: `gcloud compute instance-groups managed set-autoscaling`  
For our purposes, we do not need this but good to know none the less.
### Step 7: Load balance the managed instance group with an External HTTP load balancer scheme.
As specified in the task overview, we need to complete a couple of steps to create a load balancer scheme. Since we are going to make a HTTP call to our application we will opt for an External HTTP Load Balancer scheme as specified [here](https://cloud.google.com/load-balancing/docs/https/ext-https-lb-simple#https-topology).  
The first step in this, is to create a health check that our load balancer will use to verify if our backend service still has a healthy instance running. To do this we need to name our http port on our managed instance group and set a firewall rule that allows the incoming health check pings to reach our backend service. This results in the following cli commands:
```bash
# Name our port
gcloud compute instance-groups set-named-ports training-mig \
  --named-ports http:80 \
  --zone europe-west1-c
# Create the firewall rule 
gcloud compute firewall-rules create allow-lb-health-checks \
  --network=training-network \
  --action=allow \
  --direction=ingress \
  --source-ranges=130.211.0.0/22,35.191.0.0/16 \
  --target-tags=http-application \
  --rules=tcp:80
# Create the health check
gcloud compute health-checks create http http-basic-check \
  --port 80
```
Next up, is to create our backend service:
```bash
gcloud compute backend-services create load-balancer-backend-service \
  --load-balancing-scheme=EXTERNAL \
  --protocol=HTTP \
  --port-name=http \
  --health-checks=http-basic-check \
  --global
```
With the variables above we define how we are going to distribute the traffic in our managed instance group. In this case, we will distribute on the named http port we previously tagged. While not present in the command, the default `balancing-mode` is based on `UTILIZATION`, based on CPU usage, which is more then good enough for our use-case. The other options are `RATE`, based on requests per second, and `CONNECTION`, based on concurrent connections.  

Next, attach our managed instance group to our new load balancer backend service with the following command:
```bash
gcloud compute backend-services add-backend load-balancer-backend-service \
  --instance-group=training-mig \
  --instance-group-zone=europe-west1-c \
  --global
```
Next, create a url map that will serve to route our request to the correct backend service. Since we only have one, all requests will be routed to the same service but note that an url map can route to multiple backend services if you so wish.
```bash
gcloud compute url-maps create web-map-http \
  --default-service load-balancer-backend-service
```
Next, create a target http proxy which will be targeted by our forwarding rule we will create next. The proxy serves to route requests to our URL map we created previous.
```bash
gcloud compute target-http-proxies create http-lb-proxy \
  --url-map=web-map-http
```
Lastly, create a forwarding rule. A forwarding rule is the actual ip address end users will hit when making a request. A forwarding rule relies on a reserved ip address so we will have to create that first.
```bash
# Reserve the external ip address
gcloud compute addresses create lb-ipv4 \
  --ip-version=IPV4 \
  --network-tier=PREMIUM \
  --global

# Create the forwarding rule
gcloud compute forwarding-rules create managed-instance-http \
  --load-balancing-scheme=EXTERNAL \
  --address=lb-ipv4 \
  --global \
  --target-http-proxy=http-lb-proxy \
  --ports=80
```
After all these steps, our load balancing scheme is set up. Do note that it might make a couple of minutes until all the pieces work together and your request reaches the managed instance group.  
In short, load balancing in Google Cloud is not so much a single service that we enable but more a sequence of individual parts our request goes through that we can customize according to the behavior we need.  
### Step 8: To see our managed instance group updates in action, publish a new image to our Artifact Registry
Make a change to the sentence that is being shown in the application and create a new image with the change:
```bash
docker build --no-cache -t europe-west1-docker.pkg.dev/PROJECT-ID/training-repo/IMAGE_NAME:2.0 -t europe-west1-docker.pkg.dev/PROJECT-ID/training-repo/IMAGE_NAME:latest .
```
Then push to the Artifact repository:
```bash
docker push europe-west1-docker.pkg.dev/PROJECT-ID/training-repo/IMAGE:2.0 (for specific tag)
docker push europe-west1-docker.pkg.dev/PROJECT-ID/training-repo/IMAGE (for latest)
```
### Step 9: Create a new instance template that makes use of the the new image
Instance templates cannot really be updated in Google Cloud so instead we create a new version and apply the new one to our managed instance group with an update.
```bash
gcloud compute instance-templates create-with-container instance-template-training-v2 \
  --machine-type=e2-small \
  --network=training-network \
  --subnet=app-subnet \
  --tags=http-application \
  --container-image={europe-west1-docker.pkg.dev/PROJECT-ID/training-repo/IMAGE_NAME:2.0} \
  --container-env=APP_PORT=80
```
### Step 10: Start a rolling update of the managed instance group that applies the new image
The following command starts a rolling update of our managed instance group which in short replaces every VM one by one while only making maximum one of the older one goes unavailable.
```bash
gcloud compute instance-groups managed rolling-action start-update training-mig \
  --version=template=instance-template-training-v2 \
  --max-surge=1 \
  --max-unavailable=1 \
  --zone=europe-west1-c
```
### Step 11: Check the result and cleanup
When satisfied with your work, cleanup the created items. It might be nice to use the online console for this due to all the interconnected pieces for the load balancer.
