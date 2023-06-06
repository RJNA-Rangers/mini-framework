import RJNA from "./rjna/engine.js";
import { todo_header } from "./html_components/todo_header.js";
import { main_section } from "./html_components/main_section.js";
import { footer_section } from "./html_components/footer_section.js";
import { footerInfo } from "./html_components/footer_info.js";
import diff from "./rjna/diff.js";
import { nodeIndex } from "./storage/functions.js";

export let sectionObj = RJNA.tag.section(
  {
    class: "todoapp",
  },
  {},
  {},
  todo_header,
  main_section(orbital.todo),
  footer_section(orbital.todo)
);
export function changeSectionObj(newObj) {
  sectionObj = newObj;
}

export function getSectionObj() {
  return sectionObj;
}

export let rootEl;
export function changeRootEl(newNode) {
  rootEl = newNode;
}
export function createTodo() {
  return RJNA.tag.section(
    {
      class: "todoapp",
    },
    {},
    {},
    todo_header,
    main_section(orbital.todo),
    footer_section(orbital.todo)
  );
}

window.onload = () => {
  switch (window.location.href.split("/").at(-1)) {
    case "active":
      let activeTodo = orbital.todo.filter((todo) => !todo.completed);
      const activeApp = RJNA.tag.section(
        {
          class: "todoapp",
        },
        {},
        {},
        todo_header,
        main_section(activeTodo),
        footer_section(activeTodo)
      );
      rootEl = RJNA.createNode(activeApp);
      RJNA.render(activeApp, "selected", "class", " ");
      RJNA.render(getSectionObj(), "#/active", "class", "selected");
      RJNA.render(activeApp, "toggle", "onclick", (evt) => {
        let [_, index] = nodeIndex(evt);
        orbital.todo[index].completed = !orbital.todo[index].completed;
        router.routes["active"]();
      });
      sectionObj = activeApp;
      document.body.appendChild(rootEl);
      document.body.appendChild(RJNA.createNode(footerInfo));
      break;
    case "completed":
      console.log("completed");
      let todo = orbital.todo.filter((todo) => todo.completed);
      const newApp = RJNA.tag.section(
        {
          class: "todoapp",
        },
        {},
        {},
        todo_header,
        main_section(todo),
        footer_section(todo)
      );

      rootEl = RJNA.createNode(newApp);
      document.body.appendChild(rootEl);
      document.body.appendChild(RJNA.createNode(footerInfo));
      RJNA.render(newApp, "selected", "class", " ");
      RJNA.render(getSectionObj(), "#/completed", "class", "selected");
      RJNA.render(newApp, "toggle", "onclick", (evt) => {
        let [_, index] = nodeIndex(evt);
        orbital.todo[index].completed = !orbital.todo[index].completed;
        router.routes["completed"]();
      });
      sectionObj = newApp;
      break;
    default:
      rootEl = RJNA.createNode(createTodo());
      document.body.appendChild(rootEl);
      document.body.appendChild(RJNA.createNode(footerInfo));
      RJNA.render(sectionObj, "selected", "class", " ");
      RJNA.render(getSectionObj(), "#/", "class", "selected");
      break;
  }
};

orbital.todo = JSON.parse(localStorage.getItem("todo_list")) || [];

window.onbeforeunload = () => {
  localStorage.setItem("todo_list", JSON.stringify(orbital.todo));
};

router.routes = {
  "": () => {
    let todo = orbital.todo;
    const newApp = RJNA.tag.section(
      {
        class: "todoapp",
      },
      {},
      {},
      todo_header,
      main_section(todo),
      footer_section(todo)
    );
    // inside new newApp, get selected RJNA.tag and
    const patch = diff(getSectionObj(), newApp);
    changeRootEl(patch(rootEl));
    changeSectionObj(newApp);
    RJNA.render(newApp, "selected", "class", " ");
    RJNA.render(newApp, "#/", "class", "selected");
  },
  active: () => {
    let todo = orbital.todo.filter((todo) => !todo.completed);
    const newApp = RJNA.tag.section(
      {
        class: "todoapp",
      },
      {},
      {},
      todo_header,
      main_section(todo),
      footer_section(todo)
    );
    const patch = diff(getSectionObj(), newApp);
    changeRootEl(patch(rootEl));
    changeSectionObj(newApp);
    RJNA.render(newApp, "selected", "class", " ");
    RJNA.render(getSectionObj(), "#/active", "class", "selected");
    RJNA.render(newApp, "toggle", "onclick", (evt) => {
      let [_, index] = nodeIndex(evt);
      orbital.todo[index].completed = !orbital.todo[index].completed;
      router.routes["active"]();
    });
  },
  completed: () => {
    let todo = orbital.todo.filter((todo) => todo.completed);
    const newApp = RJNA.tag.section(
      {
        class: "todoapp",
      },
      {},
      {},
      todo_header,
      main_section(todo),
      footer_section(todo)
    );
    const patch = diff(getSectionObj(), newApp);
    changeRootEl(patch(rootEl));
    changeSectionObj(newApp);
    RJNA.render(newApp, "selected", "class", " ");
    RJNA.render(getSectionObj(), "#/completed", "class", "selected");
    RJNA.render(newApp, "toggle", "onclick", (evt) => {
      let [_, index] = nodeIndex(evt);
      orbital.todo[index].completed = !orbital.todo[index].completed;
      router.routes["completed"]();
    });
  },
};

window.addEventListener(
  "hashchange",
  function () {
    orbital.endpoint = window.location.href.split("/").at(-1);

    console.log(
      "🚀 ~ file: main.js:79 ~ window.addEventListener ~ orbital.endpoint:",
      orbital.endpoint
    );
    router.routes[orbital.endpoint]();
  },
  false
);
