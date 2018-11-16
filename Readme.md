# Apps dashboard

Angular Dashboard

## Usage

### Clone This Project

```
git clone
```

### Install Dependencies

Install all the dependencies:
```
yarn
```

### Local Development Server

To start a local development web server:
```
yarn start
```
Your application will be accessible at [localhost:3000](http://localhost:3000/) by default. See the [webpack-dev-server docs](https://webpack.github.io/docs/webpack-dev-server.html) if you want to customise anything.

### Tests

To execute tests & generate coverage
```
yarn test
```

During development
```
yarn test-watch
```

### Build

To build spa
```
yarn build
```

### Env

An `env.json` file can be added to the project to configure voodoo API. The schema is

```json
{
  "voodoo": {
    "endPoint": "{protocol}://{host}:{port]",
    "acquisitionKey":"{yourAcquisitionKey}",
    "monetizationKey": "{yourMonetizationKey}"
  }
}
```

On a CI you can serialize this config in `ENV` variable
