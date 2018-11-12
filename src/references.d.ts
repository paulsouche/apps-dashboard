declare module '*.svg' {
  const _: string;
  export = _;
}

interface VoodooConfig {
  endPoint: string;
  acquisitionKey: string;
  monetizationKey: string;
}

declare var build: {
  mode: string;
  version: string;
  voodoo: VoodooConfig;
};
