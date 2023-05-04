import RJ from '../rjna/engine.js';

class HelloWorld extends RJ.Component {
  create() {
    return RJ.createElement('div', {class:"lol"},"hello");
  }
}
class header extends RJ.Component {
  create() {
    return RJ.createElement('header', {"class": "header"},RJ.createElement('h1', {},"todos"),
    RJ.createElement('input',{ "class": "new-todo",
          "placeholder": "What needs to be done?",
          "autofocus": "true",})
    );
  }
}

// {
//   "tag": "h1",
//   "attrs": {
//       "textContent": "todos"
//   },

// },
// {
//   "tag": "input",
//   "attrs": {
//       "class": "new-todo",
//       "placeholder": "What needs to be done?",
//       "autofocus": "true",
//   },
//   "property": {
//       "onkeyup": storage["insert"],
//   },
// },

const gfg = new HelloWorld().create();
const root = document.getElementById('root');
let head=new header().create()
console.log({head})
RJ.render(gfg, root);
RJ.render(head, root);
