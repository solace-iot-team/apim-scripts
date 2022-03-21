# Scripts: APS External Business Groups

> :warning: UNDER CONSTRUCTION

---

The End.

## Overview

- describe the integration approach
- picture?

## Prerequisites

- Solace Cloud & Event Portal API Token
- 1 service in Solace Cloud to act as the Solae API Gateway
- docker, docker-compose
- nodejs v16.6.1
- npm 7.20.3
- [jq](https://stedolan.github.io/jq/)
- [jwt-cli](https://github.com/mike-engel/jwt-cli)

```bash
npm install
```

## Configure

Set the environment variables defined in `template.source.env.sh`.

```bash
cp template.source.env.sh source.{your-env-name}.sh
# edit the values ...
source source.{your-env-name}.sh
```

## Standup Local APIM System

**standup:**

```bash
source source.{your-env-name}.sh
./apim-system/start.system.sh
```

**browser: apim-demo-portal:**

```text
http://localhost:5003
```

**browser: apim-concept-portal:**

```text
http://localhost:5000
user: root.admin@aps.com
password: admin123!
```

**After integration run:**

- Create {master user} with access to all roles and orgs
- Create {developer} user as provisioned by integration run with role='API Consumer', access to the org
  - login as {developer} - see your app
  - login as {master user} - see the admin part

**browser: apim-connector api explorer:**

```text
http://localhost:5000/api-explorer
```

## Pre-Provision Solace APIM Connector

Basic setup of connector:

- organization
- environment

```bash
source source.{your-env-name}.sh
npm run pre-provision
```

## Run Integration

Pipeline:

- Apigee: Get API Keys (Apps)
- Apigee: Get API Product Info for each App
- Generate Async Api Spec from resources in API Product
- Solace: Create API
- Solace: Create API Product
- Solace: Create Developer
- Solace: Create Developer APP
- Solace: Get Developer APP Details & APP Async API Spec

```bash
npm run integration
```

## De-Provision Solace APIM Connector

Delete the organization, de-provisions the Solace Service.

```bash
source source.{your-env-name}.sh
npm run de-provision
```

## Teardown Local APIM System

```bash
source source.{your-env-name}.sh
./apim-system/stop.system.sh
```

## Development

```bash
source source.{your-env-name}.sh
```

Run the compiler only:

```bash
npm run build
```

Run script in ts-node:

```bash
npm run dev-pre-provision
npm run dev-integration
npm run dev-de-provision
```
