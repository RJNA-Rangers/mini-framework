import { tag } from "../rjna/elements.js";
import RJNA from "../rjna/engine.js"
import { footer_section } from "../html_components/footer_section.js";
import { todo_header } from "../html_components/todo_header.js";
import { main_section } from "../html_components/main_section.js";
import diff from "../rjna/diff.js";
import { changeSectionObj, rootEl, changeRootEl, getSectionObj } from "../main.js";

export function getFromLocalStorage(todoArray) {

    const allEntries = todoArray || [];
    let todo_arr = []
    allEntries.forEach(todo =>
        todo_arr.push(
            tag.li(
                {
                    "class": todo.completed ? "completed" : "",
                    "data-id": todo.id,
                    min: "week"
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
                                const newApp = tag.section({
                                    "class": "todoapp",
                                }, {}, {}, todo_header,
                                    main_section(orbital.todo),
                                    footer_section(orbital.todo)
                                )
                                const patch = diff(getSectionObj(), newApp)
                                let s = patch(rootEl)
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
                            "ondblclick": (evt) => {
                                const [[oldVDom], [currentVDom]] = RJNA.getObjByAttrsAndPropsVal(getSectionObj(), todo.id);
                                console.log(oldVDom)
                                currentVDom.attrs["class"] = currentVDom.attrs["class"] += " editing"
                                currentVDom.children.push(tag.input({ class: "edit", focusVisible: "true" }, { onkeydown: (evt) => keyPressed(evt) }, { value: `${evt.target.innerHTML}`, autofocus: true }))
                                let oldSection = JSON.parse(JSON.stringify(getSectionObj()))
                                const newApp = RJNA.replaceParentNode(getSectionObj(), oldVDom, currentVDom)
                                const patch = diff(oldSection, newApp)
                                let s = patch(rootEl)
                                window.onclick = (evt2) => {
                                    if (evt2.target.className == "edit") {
                                        console.log("touch")
                                        return;
                                    }
                                    let oldSection = JSON.parse(JSON.stringify(getSectionObj()))
                                    currentVDom.attrs["class"] = currentVDom.attrs["class"].replace("editing", "")
                                    currentVDom.children.splice((currentVDom.children.length - 1), 1)
                                    const newApp = RJNA.replaceParentNode(getSectionObj(), oldVDom, currentVDom)
                                    const patch = diff(oldSection, newApp)
                                    changeRootEl(patch(rootEl))
                                    window.onclick = () => { };
                                    return
                                }
                            }
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
            const newApp = tag.section({
                class: "todoapp",
            }, {}, {}, todo_header,
                main_section(orbital.todo),
                footer_section(orbital.todo),
            )
            const patch = diff(getSectionObj(), newApp)
            changeRootEl(patch(rootEl))
            changeSectionObj(newApp)
            evt.target.value = ""
            return
        }
    }
}

const keyPressed = (evt) => {
    window.onclick = () => { };
    const id = evt.target.closest("li").dataset.id
    let index = orbital.todo.findIndex(todo => todo.id === id)
    const [[oldVDom], [currentVDom]] = RJNA.getObjByAttrsAndPropsVal(getSectionObj(), evt.target.closest("li").dataset.id);
    let oldSection = JSON.parse(JSON.stringify(getSectionObj()))
    if (evt.key == "Escape") {
        currentVDom.attrs["class"] = currentVDom.attrs["class"].replace("editing", "")
        currentVDom.children.splice((currentVDom.children.length - 1), 1)
        const newApp = RJNA.replaceParentNode(getSectionObj(), oldVDom, currentVDom)
        diff(oldSection, newApp)
        return
    }
    if (evt.key == "Enter" || evt.key == "Alt" || evt.key == "Tab") {
        if (evt.target.value != "") {

            orbital.todo[index]["content"] = evt.target.value
            currentVDom.attrs["class"] = currentVDom.attrs["class"].replace("editing", "")
            currentVDom.children.splice((currentVDom.children.length - 1), 1)
            const newApp = tag.section({
                "class": "todoapp",
            }, {}, {}, todo_header,
                main_section(orbital.todo),
                footer_section(orbital.todo),
            )
            const patch = diff(getSectionObj(), newApp)
            changeRootEl(patch(rootEl))
            changeSectionObj(newApp)
            return
        } else {
            removeFromLocalStorage(evt)
            return
        }
    }
    window.onclick = (evt2) => {
        if (evt2.target.className == "edit") {
            return;
        }
        if (evt.target.value != "") {
            window.onclick = () => { };
            orbital.todo[index]["content"] = evt.target.value
            currentVDom.attrs["class"] = currentVDom.attrs["class"].replace("editing", "")
            currentVDom.children.splice((currentVDom.children.length - 1), 1)
            const newApp = tag.section({
                "class": "todoapp",
            }, {}, {}, todo_header,
                main_section(orbital.todo),
                footer_section(orbital.todo),
            )
            const patch = diff(getSectionObj(), newApp)
            changeRootEl(patch(rootEl))
            changeSectionObj(newApp)
        } else {
            window.onclick = () => { };
            removeFromLocalStorage(evt)
        }
        return
    }
}

export function removeFromLocalStorage(evt) {
    let [node, index] = nodeIndex(evt);
    orbital.todo.splice(index, 1);
    const newApp = tag.section({
        "class": "todoapp",
    }, {}, {}, todo_header,
        main_section(orbital.todo),
        footer_section(orbital.todo),
    )
    const patch = diff(getSectionObj(), newApp)
    changeRootEl(patch(rootEl))
    changeSectionObj(newApp)
}

function nodeIndex(evt) {
    let node = evt.target.parentNode.parentNode
    let id = node.dataset.id
    let indexOfTodo = orbital.todo.findIndex(todo => todo.id === id)
    return [node, indexOfTodo]
}

