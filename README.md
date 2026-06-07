Very simple dashboard for a home server. All metrics are retrieved from glances.

## Features
- Configurable link list
- Configurable Action list
- Actions can invoke either a script, or send a post request to a consumer

## Preview

## Configuration

The config is mounted at /app/config, and is a json file. The structure is the following:

### Main
`title`
: Title of the dashboard
: Optional

`glancesUrl`
: url of glances
: Required

`webhookConsumerUrl`
: url of used for curl actions
: Optional

### Actions
`name`
: name of action
: Optional

`description`
: description for action
: Optional

`curlName`
: if provided will send post request to "{webhookConsumerUrl}/run/{curlName}"
: Optional

`scriptName`
: if provided will run sh script in /mnt/scripts/{scriptName}
: Optional

### Links
`name`
: name of link
: Optional

`url"
: url of link
: Optional

`iconUrl"
: url of link's icon
: Optional


## Installation

Used with docker. This is a compose file to setup it up,

```yml
services:
    dashboard:
        image: ghcr.io/nexx42/server_dashboard
        container_name: dashboard
        restart: always
        volumes:
            - ./dashboard:/app/config
            - ./dashboardScripts:/mnt/scripts/
        extra_hosts:
            - "host.docker.internal:host-gateway"
        ports:
            - "3000:3000"
```


## Webhook Consumer

A lightweight fastfetch python api to bridge from the docker container to the host machine. Not required because you can manually change the config's "webhookConsumerUrl" and manually handle it yourself.

### Installation

1. Copy files from "webhook_consumer" to desired directory (in this example to /opt/docker/dashboardScripts)
2. run setup.sh
3. move the "webhook-consumer.service" to /etc/systemd/system/ (if on systemd)
4. start the service ```sh systemctl enable --now webhook-consumer```

> [!IMPORTANT]
> Contingent on where you place the "webhook_consumer" project, you must update the service to reflect that. If you didnt use /opt/docker/dashboardScripts, you must replace all instances of that within the service.