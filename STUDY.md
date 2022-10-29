# Information from Requirements
## Data
1. Shipment Info
  1. Sender country
  1. Receiver country
  1. Weight
1. Customer Info
1. Region to Country association
  1. Country codes
  1. Regions
1. Pricing information
  1. Weight classes
  1. Multipliers

## Tasks
1. Store and retrieve shipments
1. Calculate price for a given shipment
1. See previous shipments

## To Develop
1. REST API

## Priority
1. Store and retrieve customers
1. Store and retrieve shipments
1. Country and pricing meta-data
1. Calculate pricing
1. API to manage country and pricing meta-data

# Assumptions
1. All prices are in SEK

# Stack
1. NodeJs with TypeScript
1. ExpressJs
1. Prisma
1. PostgreSQL
1. Docker

## NodeJs with TypeScript
The foremost reason for choosing NodeJs was the high availability of competence which would result in lower time-to-market. In addition
1. Excellent online community
1. Availability of client libraries for e.g. Database
1. Availability of third-party libraries for fast development
1. NodeJs runtime is easily containarized and deployed at scale

TypeScript adds type-checking to JavaScript that allows to detect bugs earlier in the development phase.

## ExpressJs
ExpressJs is a popular NodeJs package for developing REST API. It was selected for API development for minimal overhead. Developing a GraphQL server is another option but it takes more time and is overkill for the current application.

## Prisma
Prisma is an ORM that works for both Relational and NoSQL databases. It has its own schema language. It was selected for rapid database schema development auto-generated static types for the server.

## PostgreSQL
Open-source, modern, and cost-free database. It is easy to set up and work with. An NoSQL database like MongoDB could have equally been used in place of PostgreSQL. More requirements need to be discovered to decide between relation and NoSQL databases. At this time, given that we have structured data, using a relational database made more sense. In the future, if we have to scale, then a NoSQL database might be a better choice.

## Docker
For easy of developing and setting up the stack locally. It can also be used for production deployment.