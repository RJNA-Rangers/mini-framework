import RJNA from "./rjna/engine.js";
import { todo_header } from "./html_components/todo_header.js";
import { main_section } from "./html_components/main_section.js";
import { footer_section } from "./html_components/footer_section.js";
import { footerInfo } from "./html_components/footer_info.js";
import { nodeIndex } from "./storage/functions.js";

export function createTodo(todo) {
  return RJNA.tag.section(
    {
      class: "todoapp",
    },
    {},
    {},
    todo_header,
    main_section(todo),
    footer_section(todo)
  );
}

let todoApp,todoList, selectedObj,activeButton,checkBoxes;
window.onload = () => {      
  switch (window.location.href.split("/").at(-1)) {
    case "active":
      todoList = orbital.todo.filter((todo) => !todo.completed);
      todoApp = createTodo(todoList);
      orbital.obj = todoApp;
      orbital.rootEl = RJNA.createNode(todoApp);
      selectedObj = RJNA.getObjByAttrsAndPropsVal(
        todoApp,
        "selected"
      );
      selectedObj.removeAttr("class", "selected", "");
      activeButton = RJNA.getObjByAttrsAndPropsVal(todoApp, "#/active");
      activeButton.setAttr("class", "selected");
      checkBoxes = RJNA.getObjByAttrsAndPropsVal(todoApp, "toggle");
      if (Array.isArray(checkBoxes)) {
        checkBoxes.forEach((input) =>
          input.setProp("onclick", (evt) => {
            let [_, index] = nodeIndex(evt);
            orbital.todo[index].completed = !orbital.todo[index].completed;
            router.routes["active"]();
          })
        );
      } else {
        checkBoxes.setProp("onclick", (evt) => {
          let [_, index] = nodeIndex(evt);
          orbital.todo[index].completed = !orbital.todo[index].completed;
          router.routes["active"]();
        });
      }
      document.body.appendChild(orbital.rootEl);
      break;
    case "completed":
      todoList = orbital.todo.filter((todo) => todo.completed);
      todoApp = createTodo(todoList);
      orbital.obj = todoApp;
      orbital.rootEl = RJNA.createNode(todoApp);
      selectedObj = RJNA.getObjByAttrsAndPropsVal(
        todoApp,
        "selected"
      );
      selectedObj.removeAttr("class", "selected", "");
      activeButton = RJNA.getObjByAttrsAndPropsVal(todoApp, "#/completed");
      activeButton.setAttr("class", "selected");
      checkBoxes = RJNA.getObjByAttrsAndPropsVal(todoApp, "toggle");
      if (Array.isArray(checkBoxes)) {
        checkBoxes.forEach((input) =>
          input.setProp("onclick", (evt) => {
            let [_, index] = nodeIndex(evt);
            orbital.todo[index].completed = !orbital.todo[index].completed;
            router.routes["completed"]();
          })
        );
      } else {
        checkBoxes.setProp("onclick", (evt) => {
          let [_, index] = nodeIndex(evt);
          orbital.todo[index].completed = !orbital.todo[index].completed;
          router.routes["completed"]();
        });
      }
      document.body.appendChild(orbital.rootEl);
      break;
    default:
      todoApp = createTodo(orbital.todo);
      orbital.obj = todoApp;
      orbital.rootEl = RJNA.createNode(todoApp);
      selectedObj = RJNA.getObjByAttrsAndPropsVal(todoApp, "selected");
      selectedObj.removeAttr("class", "selected", " ");
      activeButton = RJNA.getObjByAttrsAndPropsVal(todoApp, "#/");
      activeButton.setAttr("class", "selected");
      document.body.appendChild(orbital.rootEl);
      break;
  }
  document.body.appendChild(RJNA.createNode(footerInfo));
};

orbital.todo = JSON.parse(localStorage.getItem("todo_list")) || [];

window.onbeforeunload = () => {
  localStorage.setItem("todo_list", JSON.stringify(orbital.todo));
};


router.routes = {
  "": () => {
    todoApp = createTodo(orbital.todo);
    RJNA.update(todoApp);
    selectedObj = RJNA.getObjByAttrsAndPropsVal(todoApp,"selected");
    selectedObj.removeAttr("class", "selected", "");
    activeButton = RJNA.getObjByAttrsAndPropsVal(todoApp, "#/");
    activeButton.setAttr("class", "selected");    
  },
  active: () => {
    todoList = orbital.todo.filter((todo) => !todo.completed);
    todoApp = createTodo(todoList);
    RJNA.update(todoApp);
    selectedObj = RJNA.getObjByAttrsAndPropsVal(todoApp,"selected");
    selectedObj.removeAttr("class", "selected", "");
    activeButton = RJNA.getObjByAttrsAndPropsVal(todoApp, "#/active");
    activeButton.setAttr("class", "selected");
    checkBoxes = RJNA.getObjByAttrsAndPropsVal(todoApp, "toggle");
    if (Array.isArray(checkBoxes)) {
      checkBoxes.forEach((input) =>
        input.setProp("onclick", (evt) => {
          let [_, index] = nodeIndex(evt);
          orbital.todo[index].completed = !orbital.todo[index].completed;
          router.routes["active"]();
        })
      );
    } else {
      checkBoxes.setProp("onclick", (evt) => {
        let [_, index] = nodeIndex(evt);
        orbital.todo[index].completed = !orbital.todo[index].completed;
        router.routes["active"]();
      });
    }
  },
  completed: () => {
    todoList = orbital.todo.filter((todo) => todo.completed);
    todoApp = createTodo(todoList);
    RJNA.update(todoApp);
    selectedObj = RJNA.getObjByAttrsAndPropsVal(todoApp,"selected");
    selectedObj.removeAttr("class", "selected", "");
    activeButton = RJNA.getObjByAttrsAndPropsVal(todoApp, "#/completed");
    activeButton.setAttr("class", "selected");
    checkBoxes = RJNA.getObjByAttrsAndPropsVal(todoApp, "toggle");
    if (Array.isArray(checkBoxes)) {
      checkBoxes.forEach((input) =>
        input.setProp("onclick", (evt) => {
          let [_, index] = nodeIndex(evt);
          orbital.todo[index].completed = !orbital.todo[index].completed;
          router.routes["completed"]();
        })
      );
    } else {
      checkBoxes.setProp("onclick", (evt) => {
        let [_, index] = nodeIndex(evt);
        orbital.todo[index].completed = !orbital.todo[index].completed;
        router.routes["completed"]();
      });
    }
  },
};

window.addEventListener(
  "hashchange",
  function () {
    orbital.endpoint = window.location.href.split("/").at(-1);
    router.routes[orbital.endpoint]();
  },
  false
);
