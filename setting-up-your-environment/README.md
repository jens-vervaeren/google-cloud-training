# Setting up your environment

1. First of all, go through the process of creating a trial account for [Google Cloud Platform](https://cloud.google.com/)
  * This will require a VISA but the tasks will normally not generate a lot of costs and, at time of writing, you get a 300$ trial budget
  * Also, use a personal gmail account to sign up instead of your Pàu one
2. Once finished, install the [Google Cloud CLI](https://cloud.google.com/sdk/docs/install)
3. When installed, login and connect to your environment through the CLI with the `gcloud init` command
  * Use your gmail account you created or have used in step 1 to connect
  * When prompted for a default zone/region, pick `europe-west1-c` as we only need general purpose machines for our tasks
