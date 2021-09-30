import Game from '/src/engine/core/Game';

const requireAll = r => {
  const required = [];

  for (let key of r.keys()) {
    required.push(r(key).default);
  }

  return required;
};

const loadScenes = () => {
  console.log('Loading scenes...');

  const scenes = requireAll(require.context('/src/game/scenes', true, /\.js$/));

  console.log('Loaded', scenes.length, 'scenes');

  return scenes;
};

const createGame = () => {
  console.log('Creating game...');

  new Game(loadScenes());
};

const initializeEngine = () => {
  console.log('Initializing engine...');

  createGame();

  console.log('Engine initialized!');
};

export default initializeEngine;

