// tslint:disable-next-line:no-implicit-dependencies
import 'jest-preset-angular';
import { version } from './package.json';

(global as any).build = {
  mode: 'test',
  version,
  voodoo: {
    acquisitionKey: 'acquisitionKey',
    endPoint: 'http://host:port',
    monetizationKey: 'monetizationKey',
  },
};
