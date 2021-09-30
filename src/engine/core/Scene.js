export default class Scene extends Phaser.Scene {
  baseURL = null;
  resources = null;

  #preloadBaseURL(baseURL) {
    if (baseURL !== null) {
      if (typeof baseURL === 'string' && baseURL.length > 0) {
        console.log('Setting base URL to', baseURL);

        this.load.setBaseURL(baseURL);
      } else {
        throw new Error(`Invalid ${this.constructor.name}.baseURL, expected string, got ${typeof baseURL}`);
      }
    }
  }

  #preloadResources(resources) {
    if (typeof resources === 'object') {
      for (const [name, resource] of Object.entries(resources)) {
        console.log('Loading resource', name, `(type: ${resource.constructor.name})`);

        resource.load(this);
      }
    } else {
      throw new Error(`Invalid ${this.constructor.name}.resources, expected object, got ${typeof resources}`);
    }
  }

  constructor(config) {
    super(config);
  }

  get res() {
    return this.resources;
  }

  preload() {
    console.log('Preloading scene', this.constructor.name);

    if (this.baseURL !== null) {
      this.#preloadBaseURL(this.baseURL);
    }

    if (this.resources !== null) {
      this.#preloadResources(this.resources);
    }
  }

  // Subclass methods
  create() {}
  update() {}
}

