import RJ from '../rjna/engine.js';

class HelloWorld extends RJ.Component {
  create() {
    return RJ.createElement('div', {}, 'Hello, World!');
  }
}

const app = new HelloWorld().create();
const root = document.getElementById('root');
RJ.render(app, root);
