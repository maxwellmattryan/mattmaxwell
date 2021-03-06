#!/bin/bash

convertsecs() {
    ((m = (${1} % 3600) / 60))
    ((s = ${1} % 60))
    printf "%02dm %02ds\n" $m $s
}

NODE_VERSION=15.10.0-alpine3.10

API_IMAGE=mattmaxwell-api
UI_IMAGE=mattmaxwell-ui
DOMAIN=mattmaxwell.dev

GCP_CONFIGURATION=mattmaxwell
GCP_HOSTNAME=gcr.io
GCP_PLATFORM=managed
GCP_REGION=us-central1
GCP_PROJECT_ID=mattmaxwell-304801
GCP_SERVICE_ACCOUNT=gcloud-api@mattmaxwell-304801.iam.gserviceaccount.com
GCP_AUTH_KEY_FILE=./conf/gcloud/gcloud-api.json
GCP_API_SERVICE=mattmaxwell-api
GCP_UI_SERVICE=mattmaxwell-ui
GCP_API_IMAGE_PATH="$GCP_HOSTNAME/$GCP_PROJECT_ID/$API_IMAGE"
GCP_UI_IMAGE_PATH="$GCP_HOSTNAME/$GCP_PROJECT_ID/$UI_IMAGE"

API_ACTION=false
UI_ACTION=false
for i in "$@"; do
    case $i in
    -a|--api)
        API_ACTION=true
        shift
        ;;
    -u|--ui)
        UI_ACTION=true
        shift
        ;;
    esac
done

START=1
if [ "$API_ACTION" = true ] && [ "$UI_ACTION" = true ]
then
    STEPS=12
else
    if [ "$API_ACTION" = false ] && [ "$UI_ACTION" = false ]
    then
        API_ACTION=true
        UI_ACTION=true

        STEPS=12
    else
        STEPS=7
    fi
fi

start_time=$(date +%s)

echo -e "\n($START/$STEPS) Initiating pre-build checks...\n"
START=2

BRANCH="$(git rev-parse --abbrev-ref HEAD)"
if [ "$BRANCH" != "main" ];
then
    echo -e "\t[✘] Branch is set to \"main\"\n"
    echo -e "To switch to the correct branch, please use:\n\n\tgit checkout main"

    exit 1;
else
    echo -e "\t[✔] Branch is set to \"main\""
fi

CURRENT_GCP_PROJECT=$(gcloud config get-value project)
if [ "$CURRENT_GCP_PROJECT" != "$GCP_PROJECT_ID" ]
then
    echo -e "\t[✘] Cloud SDK's configuration is set for $GCP_PROJECT_ID\n"
    echo -e "To properly configure the SDK for this project, use:\n\n\tgcloud config configurations activate $GCP_CONFIGURATION"

    exit 1;
else
    echo -e "\t[✔] Cloud SDK's configuration is set for $GCP_PROJECT_ID"
fi

CURRENT_GCP_ACCOUNT=$(gcloud config list account --format "value(core.account)")
if [ "$CURRENT_GCP_ACCOUNT" != "$GCP_SERVICE_ACCOUNT" ]
then
    echo -e "\t[✘] Cloud IAM service account is set to $GCP_SERVICE_ACCOUNT\n"
    echo -e "To properly set the service account for this project, use:\n\n\tgcloud config set account $GCP_SERVICE_ACCOUNT"
    echo -e "and"
    echo -e "\tgcloud auth activate-service-account $GCP_SERVICE_ACCOUNT --key-file=$GCP_AUTH_KEY_FILE"

    exit 1;
else
    echo -e "\t[✔] Cloud IAM service account is set to $GCP_SERVICE_ACCOUNT\n"
fi

echo -e "[Success]: Pre-build checks passed!\n"

if [ "$API_ACTION" = true ]
then
    cd api/ || echo -e "\nERROR: API folder does not exist" | exit

    echo -e "($(expr $START)/$STEPS) Building local API image...\n"
    docker build . --no-cache --tag "$API_IMAGE"
    echo -e "[Success]: Built local API image!\n"

    echo -e "($(expr $START + 1)/$STEPS) Tagging local API image for Container Registry..."
    docker tag "$API_IMAGE" "$GCP_API_IMAGE_PATH"
    echo -e "[Success]: Tagged local API image!\n"

    echo -e "($(expr $START + 2)/$STEPS) Pushing local API image to Container Registry...\n"
    docker push "$GCP_API_IMAGE_PATH"
    echo -e "[Success]: Pushed local API image!\n"

    echo -e "($(expr $START + 3)/$STEPS) Deploying to Cloud Run service ($GCP_API_SERVICE)...\n"
    gcloud run deploy "$GCP_API_SERVICE" --image="$GCP_API_IMAGE_PATH" --platform="$GCP_PLATFORM" --region="$GCP_REGION"
    echo -e "[Success]: Deployed service!\n"

    echo -e "($(expr $START + 4)/$STEPS) Removing API images from Docker...\n"
    docker rmi "$API_IMAGE:latest"
    docker rmi "$GCP_API_IMAGE_PATH:latest"
    echo -e "[Success]: Removed API image(s)!\n"

    START=7

    cd ../
fi

if [ "$UI_ACTION" = true ]
then
    cd ui/ || echo -e "\nERROR: UI folder does not exist" | exit

    echo -e "($(expr $START)/$STEPS) Building local UI image...\n"
    docker build . --no-cache --tag "$UI_IMAGE"
    echo -e "[Success]: Built local UI image!\n"

    echo -e "($(expr $START + 1)/$STEPS) Tagging local UI image for Container Registry..."
    docker tag "$UI_IMAGE" "$GCP_UI_IMAGE_PATH"
    echo -e "[Success]: Tagged local UI image!\n"

    echo -e "($(expr $START + 2)/$STEPS) Pushing local UI image to Container Registry...\n"
    docker push "$GCP_UI_IMAGE_PATH"
    echo -e "[Success]: Pushed local UI image!\n"

    echo -e "($(expr $START + 3)/$STEPS) Deploying to Cloud Run service ($GCP_UI_SERVICE)...\n"
    gcloud run deploy "$GCP_UI_SERVICE" --image="$GCP_UI_IMAGE_PATH" --platform="$GCP_PLATFORM" --region="$GCP_REGION"
    echo -e "[Success]: Deployed service!\n"

    echo -e "($(expr $START + 4)/$STEPS) Removing UI images from Docker...\n"
    docker rmi "$UI_IMAGE:latest"
    docker rmi "$GCP_UI_IMAGE_PATH:latest"
    echo -e "[Success]: Removed UI image(s)!\n"

    if [ "$STEPS" = 12 ]
    then
        START=12
    else
        START=7
    fi

    cd ../
fi

echo -e "($(expr $START)/$STEPS) Cleaning up dangling / unused images...\n"
docker rmi "node:$NODE_VERSION"
printf 'y\n' | docker image prune
echo -e "[Success]: Cleaned up images!\n"

end_time=$(date +%s)
execution_time=$(expr $end_time - $start_time)
echo -e "Total build and deployment time elapsed: $(convertsecs $execution_time)\n"

echo -e "COMPLETE! Check it out at https://$DOMAIN/"
