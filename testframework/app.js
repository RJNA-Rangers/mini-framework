import RJ from '../rjna/engine.js';

// Define a HelloWorld component using the RJComponent base class
class HelloWorld extends RJ.Component {
  render() {
    // Use the rj helper function to create a more user-friendly syntax
    return RJ.rj`<div>Hello, World!</div>`;
  }
}

// Create an instance of the HelloWorld component and render it
const app = new HelloWorld().render();
const root = document.getElementById('root');
RJ.render(app, root);
