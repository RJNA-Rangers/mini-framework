import { createTodo } from "../main.js";
import RJNA from "../rjna/engine.js";
// import { getSectionObj } from "../main.js";

// creates and returns an array of li tags from array of todos
export function getFromLocalStorage(todoArray) {
  const allEntries = todoArray || [];
  let todo_arr = [];
  allEntries.forEach((todo) =>
    todo_arr.push(
      RJNA.tag.li(
        {
          class: todo.completed ? "completed" : "",
          "data-id": todo.id,
        },
        {},
        {},
        RJNA.tag.div(
          {
            class: "view",
          },
          {},
          {},
          RJNA.tag.input(
            {
              class: "toggle",
              type: "checkbox",
            },
            {
              onclick: (evt) => {
                let [_, index] = nodeIndex(evt);
                orbital.todo[index].completed = !orbital.todo[index].completed;
                RJNA.update(createTodo(orbital.todo));
              },
            },
            {
              checked: todo.completed,
            }
          ),
          RJNA.tag.label(
            {},
            {
              ondblclick: (evt) => {
                const currentTodoLi = RJNA.getObjByAttrsAndPropsVal(
                  orbital.obj,
                  todo.id
                );
                currentTodoLi.setAttr("class", "editing");
                currentTodoLi.setChild(
                  RJNA.tag.input(
                    { class: "edit" },
                    { onkeydown: (evt) => keyPressed(evt) },
                    { value: `${evt.target.innerHTML}` }
                  )
                );
                window.onclick = (evt2) => {
                  if (evt2.target.className == "edit") {
                    return;
                  }
                  currentTodoLi.removeAttr("class", "editing", " ");
                  currentTodoLi.removeChildren(currentTodoLi.children.lenghth - 1, 1);
                  window.onclick = () => {};
                  return;
                };
              },
            },
            {},
            todo.content
          ),
          RJNA.tag.button(
            {
              class: "destroy",
            },
            {
              onclick: (evt) => removeFromLocalStorage(evt),
            }
          )
        )
      )
    )
  );
  return todo_arr.reverse();
}

// inserts newly entered todo into orbital.todo and
// updates the VDOM and Real DOM accordingly
export function insertIntoLocalStorage(evt) {
  if (evt.key == "Enter" || evt.key == 13) {
    if (evt.target.value != "" && !/^\s+$/.test(evt.target.value)) {
      const new_todo_obj = {
        id: Date.now().toString(),
        content: evt.target.value,
        completed: false,
      };
      orbital.todo.push(new_todo_obj);
      // console.log(window.location.href)
      switch (window.location.href.split("/").at(-1)) {
        case "active":
          router.routes["active"]();
          break;
        case "completed":
          router.routes["completed"]();
          break;
        case "":
          router.routes[""]();
          break;
      }
      evt.target.value = "";
      return;
    }
  }
}

// applies changes to vDOM and real DOM depending on evts
// when editing
const keyPressed = (evt) => {
  window.onclick = () => {};
  const id = evt.target.closest("li").dataset.id;
  let index = orbital.todo.findIndex((todo) => todo.id === id);
  let label = RJNA.getObjByAttrsAndPropsVal(
    orbital.obj,
    orbital.todo[index]["content"]
  );
  console.log(label, "LASBELLASD");
  const currentTodoLi = RJNA.getObjByAttrsAndPropsVal(
    orbital.obj,
    evt.target.closest("li").dataset.id
  );
  console.log({ currentTodoLi }, "old V dom.");
  if (evt.key == "Escape") {
    currentTodoLi.removeAttr("class", "editing", "");
    currentTodoLi.removeChildren(currentTodoLi.children.length - 1, 1);
    return;
  }
  if (evt.key == "Enter" || evt.key == "Alt" || evt.key == "Tab") {
    if (evt.target.value != "") {
      orbital.todo[index]["content"] = evt.target.value;
      currentTodoLi.removeAttr("class", "editing", "");
      currentTodoLi.removeChildren(currentTodoLi.children.length - 1, 1);
      RJNA.update(createTodo(orbital.todo));
      switch (window.location.href.split("/").at(-1)) {
        case "active":
          router.routes["active"]();
          break;
        case "completed":
          router.routes["completed"]();
          break;
        case "":
          router.routes[""]();
          break;
      }
      return;
    } else {
      removeFromLocalStorage(evt);
      return;
    }
  }
  window.onclick = (evt2) => {
    if (evt2.target.className == "edit") {
      return;
    }
    if (evt.target.value != "") {
      window.onclick = () => {};
      orbital.todo[index]["content"] = evt.target.value;
      currentTodoLi.removeAttr("class", "editing", "");
      currentTodoLi.removeChildren(currentTodoLi.children.length - 1, 1);
      RJNA.update(createTodo(orbital.todo));
      switch (window.location.href.split("/").at(-1)) {
        case "active":
          router.routes["active"]();
          break;
        case "completed":
          router.routes["completed"]();
          break;
        case "":
          router.routes[""]();
          break;
      }
    } else {
      window.onclick = () => {};
      removeFromLocalStorage(evt);
    }
    return;
  };
};

// remove todo into orbital.todo and
// updates the VDOM and Real DOM accordingly
export function removeFromLocalStorage(evt) {
  let [_, index] = nodeIndex(evt);
  orbital.todo.splice(index, 1);
  switch (window.location.href.split("/").at(-1)) {
    case "active":
      router.routes["active"]();
      break;
    case "completed":
      router.routes["completed"]();
      break;
    case "":
      router.routes[""]();
      break;
  }
}

// returns index of todo in oribital.todo using the evt id
export function nodeIndex(evt) {
  let node = evt.target.parentNode.parentNode;
  let id = node.dataset.id;
  let indexOfTodo = orbital.todo.findIndex((todo) => todo.id === id);
  return [node, indexOfTodo];
}
