Very simple dashboard for a home server. All metrics are retrieved from glances.

## Features
- Configurable link list
- Configurable Action list
- Actions can invoke either a script, or send a post request to a consumer

## Preview

<img width="1920" height="1841" alt="image" src="https://github.com/user-attachments/assets/79ea3a21-b98b-4592-9829-3a365ca6fe1a" />


## Configuration

The config is mounted at /app/config, and is a json file. The structure is the following:

### Main
| Field              | Description               | Required  |
| ------------------ | ------------------------- | ----------|
| title              | Title of the dashboard    | String?   |
| glancesUrl         | URL of glances            | String!   |
| webhookConsumerUrl | URL used for curl actions | String?   |
| actions            | List of actions           | Actions[]?|
| links              | List of links             | Links[]?  |

### Actions
| Field       | Description                                                                   | Type    |
| ----------- | ----------------------------------------------------------------------------- | ------- |
| name        | Name of action                                                                | String? |
| description | Description for action                                                        | String? |
| curlName    | If provided will send POST request to `"{webhookConsumerUrl}/run/{curlName}"` | String? |
| scriptName  | If provided will run shell script in `/mnt/scripts/{scriptName}`              | String? |

### Links
| Field   | Description        | Type    |
| ------- | ------------------ | ------- |
| name    | Name of link       | String? |
| url     | URL of link        | String? |
| iconUrl | URL of link's icon | String? |


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
