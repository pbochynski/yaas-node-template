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
	
# Edit RAML with api-designer
 
If you want to modify RAML of wishlist service you can start api-designer with this command:

	node api-designer.js
	
Open http://localhost:3000/api-designer/ to browse api-designer. If you have service already running you have to stop it first 
or change code to use different port.







