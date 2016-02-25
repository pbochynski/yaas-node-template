# YaaS node.js service template

This service is very simple implementation of wishlist service used in YaaS getting started guides. 
Check out this project to get node.js code with:
	
* wish lists management (create, update, list, get and delete with in memory storage)
* tests for all endpoints in mocha
* integrated RAML api-console
* integrated RAML api-designer
* blue-green deployment

# Installation

Requirements: node.js 0.12.x installed (node and npm are available on path).
 
Check out this project and go into project folder and execute this command: 

	npm install
	
	
# Run locally

Run command:
	
	node index.js

Then open http://localhost:3000 in web browser. You will see api-console and you can play with the API. 
(You can ignore authorization header when playing with local service) 
	
# Execute tests

Install mocha:
	
	npm install -g mocha
	
Run command:
	
	mocha
	
	
# Blue-green deployment

OS X or Linux:
	
	./gradlew cfDeploy cfSwapDeployed -PcfUsername=xxxx -PcfPassword=xxxxx -Ppivotal

Windows (probably):
	
	gradlew.bat cfDeploy cfSwapDeployed -PcfUsername=xxxx -PcfPassword=xxxxx -Ppivotal
	

# What is there?

## Embedded api-designer
 
In YaaS we promote API first approach. We use (RAML)[http://raml.org/] to describe API. This template has embedded 
(api-designer)[https://github.com/mulesoft/api-designer] to simplify design of your API. 
If you want to modify RAML of wishlist service you can start api-designer with this command:

	node api-designer.js
	
Open http://localhost:3000/api-designer/ to browse api-designer. 

## Embedded api-console

To become successful your API should be easy to play with. That's why when you open this service root URL in the browser you will 
be redirected to the (api-console)[https://github.com/mulesoft/api-console] of your service. You can read about API and try it.

Embedded api-console works also if application is behind API proxy (base path is different). 
See details in: [public/api-console/index.html](public/api-console/index.html)

There is also support for automatic token retrieval for client_credential grant. You can just use your client_id and client_secret, 
and token will be automatically retrieved and used for the request. For details check _securitySchemes_ in 
[RAML file](public/api-console/raml/wishlist.raml).  

## Configuration
This template comes with config module. It allows you to define configuration in simple json file 
[(default.json)](config/default.json). You can easily create different profiles for different environments - just create
json file in config file named as your environment and set NODE_ENV variable to that value. 
In the [custom-environment-variables.json](config/custom-environment-variables.json) file you can define which properties should 
be configurable by environment variables (usually some credentials you don't want to keep in source code).
During development it is convenient to use for that local.json file which has highest priority over profiles and environment 
variables (do not add local.json to the source code)

## Multi-tenancy

In YaaS we build API platform for multiple brands (tenants). Tenant is a separate business activity that doesn't share 
data with others. What does it mean for API providers? For simple stateless services nothing. But if you store any any data 
or offer any functionality that depends on customer context (and this context is persistent) - you have to build 
multi-tenancy in your service.

### Example

Basic version of wishlist service doesn't offer multitenancy. It cannot be shared by multiple businesses. If you want to offer 
functionality of managing wishlists to many online shops, it is not desired that manager from first shop can see wishlists created 
in another. In single tenant model you just create another instance of wishlist service that is used by second shop. But having
hundreds or thousands of customers will make your life miserable. Just imagine thousands of servers, and how you will deployment, 
 security, updates for this number of servers. Think also about cost efficiency. It is much better if you can use the same 
 instance of your service for many tenants (customers).  


## Tests with real dependencies

Tests are written with mocked document repository service. If you want to use real document repository just disable NOCK before executing tests:

	NOCK_OFF=true mocha
	
Real implementation require YaaS Client credentials provided in the configuration. Check it in the [config/default.json](config/default.json):

	    "client_id": "setByEnv",
        "client_secret": "setByEnv",
        "yaas_client": "setByEnv"


You can set them by environment variables. See names of variables in the configoration file:
[config/custom-environment-variables.json](config/custom-environment-variables.json)

# License

This project is licensed under the Apache Software License, v. 2 except as noted otherwise in the LICENSE file.


