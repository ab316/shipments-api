# Scenario 1
1. Getting started
1. 5 developers
1. 1000 monthly active users using the application once per day

In this scenario, we
1. Do not have a lot of money to pay for many services/subscriptions
1. Do not have many developers making changes to the application simultaneously
1. Do not have a lot of load from the consumers
1. Do not have the bandwidth and need for complex deployments and infrastructure

We want to
1. Minimize cost
1. Minimize hassle of managing infrastructure
1. Make sure the system is still available. There is no need to look for any high number of 9s of availability

We can deploy both our application and our database on a single server on a cloud. E.g. an EC2 instance or AWS Fargate. We can even use the `docker-compose.yml` file available in the repository. But we should definitely backup the database regularly to a different more reliable location e.g. an S3 bucket.
If needed (and affordable), we can host the database on a managed database service with Amazon RDS. Then we can also run two VM instances for the application server for resilience.

We should also use a CI/CD pipeline to make pushing code to production easier.

# Scenario 2
* More mature business
* 30 developers
* 10M monthly active users using the application 100 times per day. i.e. 1B requests per day.

In this scenario
1. We are generating a good revenue
1. Can afford to dedicate some developer's time to monitor the application
1. Have a lot of load to deal with
1. Have the bandwidth for complex infrastructure for the application

We want to
1. Make sure that the application is highly available. Decide on the required availability
1. Make sure that the user experience is not affect by the high load
1. To able to deploy changes quickly to production
1. To be able to monitor the performance of the application

If price is not a problem, we can continue using the public cloud.

## Separate the Application and Database Servers
In this scenario, the application and the database servers can not be hosted on a single machine. So, we must manage isolate them.

## Scaling the Application Server
The first thing that needs to be done is to scale the servers to be able to manage the request load. We scale horizontally as NodeJs is single-threaded and increasing the machine size will hit a limit soon. We will need to add a large number of servers. With a cloud-service like AWS EC2 Auto-Scaling, the number of servers can be adjusted automatically based on the load based on some-metric like request latency or requests-per-second.
With multiple servers, a load-balancer is needed to balance the traffic. A cloud service like EC2 provides that as well. Since our application server is state-less, we can scale it to any number of instances.

At this stage, we can also look into something like Kubernetes to make managing the server cluster easier.

## Scaling the Database
With the application server scaled. The database server also needs to be scaled since every request processed by the application server may access the database multiple times. Scaling a relational database is challenging. It can be done in multiple ways. One way is through read-replicas. This is useful if our application is read-intensive. Other options include breaking the database in different ways (like sharding or federation). We can also go a completely different way and opt for a no-SQL database like MongoDB which is distributed and scalable by nature. By the time we reach 10M users, we will know a lot about our application. Only then we can make the best decision. In all cases, if we are using a cloud-provider like AWS with a managed database, it will be easy to scale the database as long as it does not require changing anything in the application.

## Multiple Availability Zones
At 10M users, we need to ensure that our application is resilient to the entire data-center going down e.g. due to a power outage. Therefore, our application needs to reside in multiple geographically isolated locations. With a public cloud like AWS, this is easy to setup.

## Caching
At 10M users, we would have found out which are the more "hot" API endpoints. Some of these hot endpoints could returning the same data over some short interval, resulting in avoidable calls to the database. We can start to put an In-Memory cache like Redis to reduce the load on the database.

## Monitoring
With a mature application, we need to be able to monitor keys metrics of the system and be able to process the large amount of logs generated to debug issues. Technologies like ELK stack and Grafana dashboards can help us do that.

## Development Process
At this level, our development practices will mature.

### Multiple Environments
We need to make sure that the developers, probably distributed across multiple teams, can productively push working code to production and everything works together. We will need to have multiple environments prior to production e.g. Dev and Staging to make sure that everything is tested together before it is pushed to production.

### Automated Tests
To increase the trust in the code we push, we should bend more towards automated testing and Test-Driven-Development to minimize the testing time after every change. A growing test-suite will increase the confidence of the developers pushing the code. The tests should run in the pipeline before the code is deployed.

## Final Comments
Going from scenario 1 to scenario 2 would be a gradual process taking a long-time. To be successful, we will need to be agile and learn and adapt along the way.