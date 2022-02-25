# Gateways managing - with SpringBoot and ReactJS

![image](https://user-images.githubusercontent.com/53590759/155584278-433c1724-42f8-4962-8017-ea6066f23f15.png)

This application was generated using JHipster 7.6.0, `to have a good starting point`, you can find documentation and help at [https://www.jhipster.tech/documentation-archive/v7.6.0](https://www.jhipster.tech/documentation-archive/v7.6.0).

## Easy Peasy Lemon Squeezy

A sample project to managing gateways - master devices that control multiple peripheral devices.

## Logic of the application

REST service (JSON/HTTP) for storing information about these gateways and their associated devices. This information is stored in the database.
When storing a gateway, any field marked as "to be validated" must be validated and an error returned if it is invalid. Also, no more than 10 peripheral devices are allowed for a gateway.

The service must also offer an operation for displaying information about all stored gateways (and their devices) and an operation for displaying details for a single gateway. Finally, it must be possible to add and remove a device from a gateway.

Each gateway has:

- a unique serial number (string),
- human-readable name (string),
- IPv4 address (to be validated),
- multiple associated peripheral devices.

Each peripheral device has:

- a UID (number),
- vendor (string),
- date created,
- status - online/offline.

## Technologys used

- [jhipster v7.6](https://www.jhipster.tech)
- [open-jdk v11.0](https://adoptopenjdk.net/)
- [npm v8.3](https://www.npmjs.com/)
- [node.js v16.14](https://nodejs.org/)
- [react.js v17.0](https://git-scm.com/)
- [webpack v5.66](https://webpack.github.io/)
- [ant-design v4.16](https://webpack.github.io/)
- [jest v27.4](https://facebook.github.io/jest/)
- [swagger v3.0](https://swagger.io)

## Installation

## Development

Before you can build this project, you must install and configure the following dependencies on your machine:

But first, clone the project

```
git clone https://github.com/FrankSiret/spring-boot-gateway.git
```

1. [Node.js](https://nodejs.org/en/download/): We use Node to run a development web server and build the project.

After installing Node, you should be able to run the following command to install development tools.

```
npm install
```

We use npm scripts and [Webpack](https://webpack.js.org/) as our build system.

### Configure the environment

It required to configure ports, database name and users credentials for accessing the database,

1. in the file `.\pom.xml`:

   ![image](https://user-images.githubusercontent.com/53590759/155591550-ae7fcf63-5158-46ff-9c02-e661ab1b6841.png)

   - at line 918 and 919 you can change the database name,
   - at line 920 and 920 you can find the user credentials,
   - remplace all that for your data

2. and file `.\src\main\resources\config\application-dev`

   ![image](https://user-images.githubusercontent.com/53590759/155591665-240896ae-8d0c-4cff-a016-9f3e85706115.png)

   - at line 35, 36, and 37 are all data you need to change

Then, run the following commands in two separate terminals to create a blissful development experience.

```
./mvnw
npm start
```

At this point, you should be ready to start browsing. Open your favorite browser at the url http://localhost:9000/.

## Packaging as jar

To build the final jar and optimize the gateways application for production, run:

```
./mvnw -Pprod clean verify
```

To ensure everything worked, run:

```
java -jar target/*.jar
```

Then navigate to [http://localhost:8080](http://localhost:8080) in your browser.

## Testing

To launch your application's tests, run:

```
./mvnw verify
```

### Client tests

Unit tests are run by [Jest](https://jestjs.io/). They're located in [src/test/javascript/](src/test/javascript/) and can be run with:

```
npm test
```

## Contact

Frank Rodríguez Siret

- Linkedin: [Frank Rodríguez Siret](https://www.linkedin.com/in/frank-siret)
- Email: frank.siret@gmail.com
