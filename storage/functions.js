import { tag } from "../rjna/elements.js";
import RJNA, { createNode } from "../rjna/engine.js"
import { footer_section, updateCount } from "../html_components/footer_section.js";
import { todo_header } from "../html_components/todo_header.js";
import { main_section } from "../html_components/main_section.js";
import diff from "../rjna/diff.js";
import { sectionObj, changeSectionObj, rootEl, changeRootEl } from "../main.js";

function deepEqual(obj1, obj2, path = '') {
    // Check if the objects are of the same type
    if (typeof obj1 !== typeof obj2) {
      console.log(`Type mismatch at path: ${path}`);
      console.log(`Value 1: ${obj1}`);
      console.log(`Value 2: ${obj2}`);
      return false;
    }
  
    // Check if both objects are arrays
    if (Array.isArray(obj1) && Array.isArray(obj2)) {
      // Compare the lengths of the arrays
      if (obj1.length !== obj2.length) {
        console.log(`Array length mismatch at path: ${path}`);
        console.log(`Length 1: ${obj1.length}`);
        console.log(`Length 2: ${obj2.length}`);
        return false;
      }
  
      // Compare each element in the arrays
      for (let i = 0; i < obj1.length; i++) {
        if (!deepEqual(obj1[i], obj2[i], `${path}[${i}]`)) {
          return false;
        }
      }
  
      return true;
    }
  
    // Check if both objects are objects (non-array objects)
    if (
      typeof obj1 === 'object' &&
      obj1 !== null &&
      !Array.isArray(obj1) &&
      typeof obj2 === 'object' &&
      obj2 !== null &&
      !Array.isArray(obj2)
    ) {
      // Get the keys of both objects
      const keys1 = Object.keys(obj1);
      const keys2 = Object.keys(obj2);
  
      // Compare the lengths of the object keys
      if (keys1.length !== keys2.length) {
        console.log(`Object key length mismatch at path: ${path}`);
        console.log(`Keys 1: ${keys1}`);
        console.log(`Keys 2: ${keys2}`);
        return false;
      }
  
      // Compare each key-value pair in the objects
      for (const key of keys1) {
        const subPath = path ? `${path}.${key}` : key;
  
        if (!obj2.hasOwnProperty(key) || !deepEqual(obj1[key], obj2[key], subPath)) {
          return false;
        }
      }
  
      return true;
    }
  
    // Compare primitive values using strict equality
    if (obj1 !== obj2) {
      console.log(`Value mismatch at path: ${path}`);
      console.log(`Value 1: ${obj1}`);
      console.log(`Value 2: ${obj2}`);
      return false;
    }
  
    return true;
  }
  

export function getFromLocalStorage(todoArray) {

    const allEntries = todoArray || [];
    let todo_arr = []
    allEntries.forEach(todo =>
        todo_arr.push(
            tag.li(
                {
                    "class": todo.completed ? "completed" : "",
                    "data-id": todo.id,
                },
                {},
                {},
                tag.div(
                    {
                        "class": "view",
                    },
                    {},
                    {},
                    tag.input(
                        {
                            "class": "toggle",
                            "type": "checkbox",
                        },
                        {
                            "onclick": (evt) => {
                                let [_, index] = nodeIndex(evt)
                                orbital.todo[index].completed = !orbital.todo[index].completed
                                const newApp= tag.section({
                                    "class": "todoapp",
                                }, {}, {}, todo_header,
                                    main_section(orbital.todo),
                                    footer_section(orbital.todo.length - orbital.todo.filter(todo => todo.completed).length)
                                )
                                console.log(newApp)
                                const patch=diff(sectionObj,newApp)
                                let s=patch(rootEl)
                                changeRootEl(s)
                                changeSectionObj(newApp)
                            }
                        },
                        {
                            "checked": todo.completed
                        }
                    ),
                    tag.label(
                        {},
                        {
                            "ondblclick": (evt) => editLabelInStorage(evt),
                        },
                        {},
                        todo.content
                    ),
                    tag.button(
                        {
                            "class": "destroy",
                        },
                        {
                            "onclick": (evt) => removeFromLocalStorage(evt)
                        }
                    )
                ))
        )

    )
    return todo_arr.reverse()
}

export function insertIntoLocalStorage(evt) {
    if (evt.key == "Enter" || evt.key == 13) {
        if (evt.target.value != "" && !/^\s+$/.test(evt.target.value)) {
            const new_todo_obj = {
                id: Date.now().toString(),
                content: evt.target.value,
                completed: false,
            }
            orbital.todo.push(new_todo_obj);
            const newApp= tag.section({
                "class": "todoapp",
            }, {}, {}, todo_header,
            main_section(orbital.todo),
            footer_section(orbital.todo.length - orbital.todo.filter(todo => todo.completed).length),
            )
            const patch=diff(sectionObj,newApp)
            let s=patch(rootEl)
            changeRootEl(s)
            changeSectionObj(newApp)
            evt.target.value = ""
        }
    }
}


export function editLabelInStorage(evt1) {
    let [node, index] = nodeIndex(evt1)
    let text = evt1.target.innerHTML;
    node.classList.add("editing")
    RJNA.appendElement(createNode(tag.input({ class: "edit" }, { onkeydown: (evt) => keyPressed(evt), oninput: (evt) => { text = evt.target.value } }, { value: `${evt1.target.innerHTML}` })), node);
    const keyPressed = (evt2) => {
        if (evt2.key == "Escape") {
            node.classList.remove("editing");
            evt2.target.remove()
            text = evt1.target.innerHTML;
            return
        }
        if (evt2.key == "Enter" || evt2.key == "Alt" || evt2.key == "Tab") {
            if (text != "") {
                console.log(orbital.todo);
                orbital.todo[index]["content"] = evt2.target.value
                evt1.target.innerHTML = evt2.target.value
                node.classList.remove("editing")
                evt2.target.remove();
                return
            } else {
                removeFromLocalStorage(evt1)
                return
            }

        }
    }
    window.onclick = (evt) => {
        if (evt.target.className == "edit") {
            return;
        }

        if (text !== "" && text != evt1.target.innerHTML) {
            console.log(orbital.todo[index].content)
            orbital.todo[index].content = text;
            evt1.target.innerHTML = text;
            node.classList.remove("editing");
        } else if (text != "" && text == evt1.target.innerHTML) {
            node.classList.remove("editing");
        } else {
            removeFromLocalStorage(evt1)
        }

        if (document.querySelector('.edit'))
            document.querySelector('.edit').remove()
        window.onclick = () => { };
        return
    }
}

export function removeFromLocalStorage(evt) {
    let [node, index] = nodeIndex(evt);
    orbital.todo.splice(index, 1);
    const newApp= tag.section({
        "class": "todoapp",
    }, {}, {}, todo_header,
    main_section(orbital.todo),
    footer_section(orbital.todo.length - orbital.todo.filter(todo => todo.completed).length),
    )
    console.log( main_section(orbital.todo))
    const patch=diff(sectionObj,newApp)
    let s=patch(rootEl)
    console.log({s})
    changeRootEl(s)
    changeSectionObj(newApp)
}

function nodeIndex(evt) {
    let node = evt.target.parentNode.parentNode
    let id = node.dataset.id
    let indexOfTodo = orbital.todo.findIndex(todo => todo.id === id)
    return [node, indexOfTodo]
}

export function clearCompleted() {
    Array.from(document.querySelectorAll(".completed")).forEach(completedNode => {
        const index = orbital.todo.findIndex(todo => todo.id === completedNode.dataset.id);
        orbital.todo.splice(index, 1);
        completedNode.remove();
    })
    updateCount();
}

export function toggleAll() {
    let completedLength = Array.from(document.querySelectorAll(".completed")).length
    let allTodo = Array.from(document.querySelector(".todo-list").children)
    if (completedLength < allTodo.length) {
        allTodo.forEach(
            toCompleteNode => {
                if (!toCompleteNode.classList.contains("completed")) {
                    const index = orbital.todo.findIndex(todo => todo.id === toCompleteNode.dataset.id)
                    orbital.todo[index].completed = !orbital.todo[index].completed
                    toCompleteNode.classList.add("completed")
                }
            }
        )
        document.querySelectorAll(".toggle").forEach(checkbox => {
            checkbox.checked = true
        })
    } else {
        allTodo.forEach(
            toCompleteNode => {
                const index = orbital.todo.findIndex(todo => todo.id === toCompleteNode.dataset.id)
                orbital.todo[index].completed = !orbital.todo[index].completed
                toCompleteNode.classList.remove("completed")
            }
        )
        document.querySelectorAll(".toggle").forEach(checkbox => {
            checkbox.checked = false
        })
    }

    // if (Array.from(document.querySelectorAll(".completed")).length!=)
    updateCount();
}

