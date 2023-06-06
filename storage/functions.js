import RJNA from "../rjna/engine.js";
import { getSectionObj } from "../main.js";

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
                RJNA.update();
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
                // this using array destructuring syntax to assign values to two variables
                // if you want the returned array, remoe the [] from the variable (i.e. oldVDOM=[]).
                // else it will return the first element of the returned array (in our case
                // the first elements of each respective array, i.e [oldVDOM]=arr1[0], [currentvDOM]=arr2[0])
                const [[oldVDom], [currentVDom]] = RJNA.render(
                  getSectionObj(),
                  todo.id,
                  "class",
                  "+= editing",
                  [
                    RJNA.tag.input(
                      { class: "edit", focusVisible: "true" },
                      { onkeydown: (evt) => keyPressed(evt) },
                      { value: `${evt.target.innerHTML}`, autofocus: true }
                    ),
                  ]
                );
                RJNA.replaceParentNode(getSectionObj(), oldVDom, currentVDom);
                window.onclick = (evt2) => {
                  if (evt2.target.className == "edit") {
                    console.log("touch");
                    return;
                  }
                  currentVDom.attrs["class"] = currentVDom.attrs[
                    "class"
                  ].replace("editing", "");
                  currentVDom.children.splice(
                    currentVDom.children.length - 1,
                    1
                  );
                  RJNA.replaceParentNode(getSectionObj(), oldVDom, currentVDom);
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
      RJNA.update();
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
  const [[oldVDom], [currentVDom]] = RJNA.getObjByAttrsAndPropsVal(
    getSectionObj(),
    evt.target.closest("li").dataset.id
  );
  if (evt.key == "Escape") {
    currentVDom.attrs["class"] = currentVDom.attrs["class"].replace(
      "editing",
      ""
    );
    currentVDom.children.splice(currentVDom.children.length - 1, 1);
    RJNA.replaceParentNode(getSectionObj(), oldVDom, currentVDom);
    return;
  }
  if (evt.key == "Enter" || evt.key == "Alt" || evt.key == "Tab") {
    if (evt.target.value != "") {
      orbital.todo[index]["content"] = evt.target.value;
      currentVDom.attrs["class"] = currentVDom.attrs["class"].replace(
        "editing",
        ""
      );
      currentVDom.children.splice(currentVDom.children.length - 1, 1);
      RJNA.update();
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
      currentVDom.attrs["class"] = currentVDom.attrs["class"].replace(
        "editing",
        ""
      );
      currentVDom.children.splice(currentVDom.children.length - 1, 1);
      RJNA.update();
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
  RJNA.update();
}

// returns index of todo in oribital.todo using the evt id
export function nodeIndex(evt) {
  let node = evt.target.parentNode.parentNode;
  let id = node.dataset.id;
  let indexOfTodo = orbital.todo.findIndex((todo) => todo.id === id);
  return [node, indexOfTodo];
}
