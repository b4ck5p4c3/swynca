# Swynca

Shiny Ultra Brand New Accounting & Members Management.

README is TBD.

## Installation

This is Next.js project with modern Yarn as package manager.
Current Node.js LTS release is required.

```shell
# If you don't have Yarn v2 installed, run:
corepack enable
yarn set version stable

# Install deps
yarn install
```

**TODO:** configuration, SSO, all the stuff. Currently, reach to @imcatwhocode or @shatie for instructions.

## Kubernetes (WIP, development)

```shell
docker build -t swynca:prod -f node.prod.dockerfile .
minikube image load swynca:prod
kubectl create configmap swynca-env --from-env-file=./.env
kubectl apply -f swynca-node-deployment.yaml,swynca-node-service.yaml
minikube service swynca-node --url
```

Make sure that endpoint ```/api/auth/callback/logto``` already added to CWC Swynca Settings 
