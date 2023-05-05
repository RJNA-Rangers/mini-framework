import { storage } from "./store.js";
import tag from "../rjna/elements.js";
export function createLocalStorage(){
        let allEntries = JSON.parse(localStorage.getItem("todo_list")) || []
        localStorage.setItem("todo_list", JSON.stringify(allEntries))
}
export function getFromLocalStorage() {
    const allEntries = JSON.parse(localStorage.getItem("todo_list")) || [];
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
                            "onclick": function (evt) {

                                console.log("li click")
                                let [node, index, allEntries2] = nodeIndex(evt)
                                allEntries2[index].completed = !allEntries2[index].completed
                                console.log({allEntries2})
                                localStorage.setItem("todo_list", JSON.stringify(allEntries2))
                                if (allEntries2[index].completed) {
                                    node.className = "completed"
                                } else {
                                    node.className = ""
                                }
                            }
                        },
                        { 
                            "checked": todo.completed 
                        }
                    ),
                    tag.label(
                        {
                            "textContent": todo.content,
                            "contentEditable": "false",
                        },
                        {
                            "ondblclick": storage["edit"](editLabelInStorage),
                        },
                    ),
                    tag.button(
                        {
                            "class": "destroy",
                        },
                        {
                            "onclick": storage["remove"](removeFromLocalStorage)
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

export function insertIntoLocalStorage() {
    return (evt) => {
        if (evt.key == "Enter" || evt.key == 13) {
            if (evt.target.value != "" &&  !/^\s+$/.test(evt.target.value)  ) {
                const new_todo_obj = {
                    id: Date.now().toString(36) + Math.random().toString(36).substr(2),
                    content: evt.target.value,
                    date: Date.now(),
                    completed: false,
                }
                let allEntries = JSON.parse(localStorage.getItem("todo_list")) || [];
                allEntries.push(new_todo_obj);
                localStorage.setItem("todo_list", JSON.stringify(allEntries))
                document.querySelector(".todo-list").prepend(createNode(storage.get(getFromLocalStorage)[0]))
                evt.target.value = ""
            }
        }
    }
}

export function editLabelInStorage() {
    return (evt) => {
        let node = evt.target
        node.contentEditable = true
        node.onkeydown = (evt) => {
            if (evt.key == "Enter" || evt.key == 13) {
                console.log(evt.target)
                node.contentEditable = false;
                let [_, index, allEntries] = nodeIndex(evt)
                allEntries[index].content = evt.target.innerHTML
                localStorage.setItem("todo_list", JSON.stringify(allEntries))
            }
        }
    }
}

export function removeFromLocalStorage() {
    return (evt) => {
        let [node, index, allEntries] = nodeIndex(evt)
        allEntries = JSON.parse(localStorage.getItem("todo_list")) || [];
        allEntries.splice(index, 1)
        localStorage.setItem("todo_list", JSON.stringify(allEntries))
        node.remove()
        console.log("remove")
    }
}
function nodeIndex(evt) {
    let node = evt.target.parentNode.parentNode
    let id = node.dataset.id
    let allEntries = JSON.parse(localStorage.getItem("todo_list")) || [];
    let indexOfTodo = allEntries.findIndex(todo => todo.id === id)
    return [node, indexOfTodo, allEntries]
}

export function completeAllTasks() {     
       return () => {
        Array.from(document.querySelectorAll(".completed")).forEach(completedNode => {
            let allEntries = JSON.parse(localStorage.getItem("todo_list")) || [];
            const index = allEntries.findIndex(todo => todo.id === completedNode.dataset.id)
            allEntries.splice(index, 1)
            console.log({allEntries})
            localStorage.setItem("todo_list", JSON.stringify(allEntries))
            completedNode.remove()
            console.log({ completedNode }, "comes here")
        })
       } 
    
}