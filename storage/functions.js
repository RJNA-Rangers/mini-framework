import { tag } from "../rjna/elements.js";
import RJNA, { createNode } from "../rjna/engine.js"
import { updateCount } from "../html_components/footer_section.js";
export function getFromLocalStorage() {

    const allEntries = orbital.todo || [];
    let todo_arr = []
    allEntries.forEach(todo =>
        todo_arr.push(
            tag.li(
                {
                    "class": taskCompleted(todo),
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
                                let [node, index] = nodeIndex(evt)
                                orbital.todo[index].completed = !orbital.todo[index].completed
                                if (orbital.todo[index].completed) {
                                    node.className = "completed"
                                } else {
                                    node.className = ""
                                }
                                updateCount();
                            }
                        },
                        {
                            "checked": todo.completed
                        }
                    ),
                    tag.label(
                        {
                            "textContent": todo.content,
                        },
                        {
                            "ondblclick": (evt) => editLabelInStorage(evt),
                        },
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


function taskCompleted(todo) {
    if (todo.completed) {
        return "completed"
    }
    return ""
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
            document.querySelector(".todo-list").prepend(createNode(getFromLocalStorage()[0]))
            evt.target.value = ""
        }
        updateCount();
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
    node.remove();
    updateCount();
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

