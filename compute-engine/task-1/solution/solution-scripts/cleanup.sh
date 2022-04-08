#! /bin/bash
# cleanup everything
gcloud compute instances delete nestjs-instance
gcloud compute firewall-rules delete allow-port-3000 allow-ssh
gcloud compute networks subnets delete training-network-subnet
gcloud compute networks delete training-network
