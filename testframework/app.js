import RJ from '../rjna/engine.js';

// Define a HelloWorld component using the RJComponent base class
class HelloWorld extends RJ.Component {
  render() {
    // Use the rj helper function to create a more user-friendly syntax
    return RJ.rj`<section class="todoapp">
    <header class="header">
      <h1>todos</h1>
      <input class="new-todo" placeholder="What needs to be done?" autofocus="">
    </header>
    <section class="main" style="display: block;">
      <input id="toggle-all" class="toggle-all" type="checkbox">
      <label for="toggle-all">Mark all as complete</label>
      <ul class="todo-list"></li></ul>
    </section>
    <footer class="footer" style="display: block;">
      <span class="todo-count"><strong>0</strong> items left</span>
      <ul class="filters">
        <li>
          <a href="#/" class="selected">All</a>
        </li>
        <li>
          <a href="#/active">Active</a>
        </li>
        <li>
          <a href="#/completed">Completed</a>
        </li>
      </ul>
      <button class="clear-completed" style="display: block;">Clear completed</button>
    </footer>
  </section>`;
  }
}

// Create an instance of the HelloWorld component and render it
const app = new HelloWorld().render();
console.log({app})
const body = document.body;
RJ.render(app, body);
