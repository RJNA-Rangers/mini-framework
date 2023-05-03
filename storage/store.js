import { createNode } from "../main.js";
export const storage = {
    "store": function () {
        let allEntries = JSON.parse(localStorage.getItem("todo_list")) || []
        localStorage.setItem("todo_list", JSON.stringify(allEntries))
    },
    "get": function () {
        let allEntries = JSON.parse(localStorage.getItem("todo_list")) || [];
        let todo_arr = []
        allEntries.forEach(todo =>
            todo_arr.push({
                "tag": "li",
                "attrs": {
                    // "class": todo.completed,
                    "data-id": todo.id,
                },
                "children": [{
                    "tag": "div",
                    "attrs": {
                        "class": "view",
                    },
                    "children": [
                        {
                            "tag": "input",
                            "attrs": {
                                "class": "toggle",
                                "type": "checkbox",
                            },
                            "property": {
                                "onclick": function (evt) {
                                    let [node, index, _] = nodeIndex(evt)
                                    console.log({ index })
                                    allEntries[index].completed = !allEntries[index].completed
                                    localStorage.setItem("todo_list", JSON.stringify(allEntries))
                                    if (allEntries[index].completed) {
                                        node.className = "completed"
                                    } else {
                                        node.className = ""
                                    }
                                }
                            }
                        },
                        {
                            "tag": "label",
                            "attrs": {
                                "textContent": todo.content,
                                "contentEditable": "false",

                            },
                            "property": {
                                "ondblclick": storage["edit"],
                                "onkeyup": function () {

                                }
                            }
                        },
                        {
                            "tag": "button",
                            "attrs": {
                                "class": "destroy",
                            },
                            "property": {
                                "onclick": storage["remove"]
                            }
                        }
                    ]

                }
                ],

            })

        )
        return todo_arr.reverse()
    },
    "insert": function (evt) {
        if (evt.key == "Enter" || evt.key == 13) {
            console.log("pressed", evt.target.value)
            if (evt.target.value != "") {

                const new_todo_obj = {
                    id: Date.now().toString(36) + Math.random().toString(36).substr(2),
                    content: evt.target.value,
                    date: Date.now(),
                    completed: false,
                }


                let allEntries = JSON.parse(localStorage.getItem("todo_list")) || [];
                allEntries.push(new_todo_obj);
                localStorage.setItem("todo_list", JSON.stringify(allEntries))
                document.querySelector(".todo-list").prepend(createNode(storage.get()[0]))
                evt.target.value = ""
            }
        }
    },
    "edit": function (evt) {
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

    },
    "remove": function (evt) {
        let [node, index, allEntries] = nodeIndex(evt)
        allEntries = JSON.parse(localStorage.getItem("todo_list")) || [];
        allEntries.splice(index, 1)
        localStorage.setItem("todo_list", JSON.stringify(allEntries))
        node.remove()

    },
    // "update":function update(){

    // }
}

function nodeIndex(evt) {
    let node = evt.target.parentNode.parentNode
    let id = node.attributes["data-id"].nodeValue
    let allEntries = JSON.parse(localStorage.getItem("todo_list")) || [];
    let indexOfTodo = allEntries.findIndex(todo => todo.id === id)
    return [node, indexOfTodo, allEntries]
}