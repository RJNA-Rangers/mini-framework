import RJNA from "./rjna/engine.js";
import { todo_header } from "./html_components/todo_header.js";
import { main_section } from "./html_components/main_section.js";
import { footer_section } from "./html_components/footer_section.js";
import { footerInfo } from "./html_components/footer_info.js";
import diff from "./rjna/diff.js";
import { nodeIndex } from "./storage/functions.js"

export function createTodo(todo) {
    return RJNA.tag.section({
        "class": "todoapp",
    }, {}, {}, todo_header,
        main_section(todo),
        footer_section(todo),
    )
}

window.onload = () => {
    switch (window.location.href.split('/').at(-1)) {
        case "active":
            let activeTodo = orbital.todo.filter(todo => !todo.completed);
            const activeApp = createTodo(activeTodo)
            orbital.rootEl = RJNA.createNode(activeApp)
            let [[oldSelectedVDom], [currentSelectedVDom]] = RJNA.getObjByAttrsAndPropsVal(activeApp, "selected");
            currentSelectedVDom.attrs["class"] = currentSelectedVDom.attrs["class"].replace("selected", " ")
            RJNA.replaceParentNode(activeApp, oldSelectedVDom, currentSelectedVDom)
            let [[oldActiveVDom], [currentActiveVDom]] = RJNA.getObjByAttrsAndPropsVal(getSectionObj(), "#/active");
            currentActiveVDom.attrs["class"] = "selected"
            RJNA.replaceParentNode(activeApp, oldActiveVDom, currentActiveVDom)
            let [oldActiveLi, currentActiveLi] = RJNA.getObjByAttrsAndPropsVal(activeApp, "toggle");
            currentActiveLi.forEach(input => input.property["onclick"] = (evt) => {
                let [_, index] = nodeIndex(evt)
                orbital.todo[index].completed = !orbital.todo[index].completed
                router.routes["active"]()
            })
            currentActiveLi.forEach((input, index) => {
                RJNA.replaceParentNode(activeApp, oldActiveLi[index], input)
                console.log(input.property.onclick)
            })
            orbital.obj = activeApp
            document.body.appendChild(orbital.rootEl);
            document.body.appendChild(RJNA.createNode(footerInfo))
            break;
        case "completed":
            console.log("completed")
            let todo = orbital.todo.filter(todo => todo.completed);
            const newApp = createTodo(todo)
            orbital.rootEl = RJNA.createNode(newApp)
            const [[oldSelectVDom], [currentSelectVDom]] = RJNA.getObjByAttrsAndPropsVal(newApp, "selected");
            currentSelectVDom.attrs["class"] = currentSelectVDom.attrs["class"].replace("selected", " ")
            RJNA.replaceParentNode(newApp, oldSelectVDom, currentSelectVDom)
            const [[oldCompletedVDom], [currentCompletedVDom]] = RJNA.getObjByAttrsAndPropsVal(newApp, "#/completed");
            currentCompletedVDom.attrs["class"] = "selected"
            RJNA.replaceParentNode(newApp, oldCompletedVDom, currentCompletedVDom)
            let [oldCompletedLi, currentCompletedLi] = RJNA.getObjByAttrsAndPropsVal(newApp, "toggle");
            currentCompletedLi.forEach(input => input.property["onclick"] = (evt) => {
                let [_, index] = nodeIndex(evt)
                orbital.todo[index].completed = !orbital.todo[index].completed
                router.routes["completed"]()
            })
            currentCompletedLi.forEach((input, index) => {
                RJNA.replaceParentNode(newApp, oldCompletedLi[index], input)
                console.log(input.property.onclick)
            })
            orbital.obj = newApp
            document.body.appendChild(orbital.rootEl);
            document.body.appendChild(RJNA.createNode(footerInfo))
            break;
        default:
            let sectionObj = createTodo(orbital.todo)
            orbital.rootEl = RJNA.createNode(sectionObj)
            const [[oldSelect], [currentSelect]] = RJNA.getObjByAttrsAndPropsVal(sectionObj, "selected");
            currentSelect.attrs["class"] = currentSelect.attrs["class"].replace("selected", " ")
            RJNA.replaceParentNode(sectionObj, oldSelect, currentSelect)
            const [[oldAll], [currentAll]] = RJNA.getObjByAttrsAndPropsVal(sectionObj, "#/");
            currentAll.attrs["class"] = "selected"
            RJNA.replaceParentNode(sectionObj, oldAll, currentAll)
            orbital.obj = sectionObj
            document.body.appendChild(orbital.rootEl);
            document.body.appendChild(RJNA.createNode(footerInfo))
            break
    }
}


orbital.todo = JSON.parse(localStorage.getItem('todo_list')) || [];

window.onbeforeunload = () => {
    localStorage.setItem('todo_list', JSON.stringify(orbital.todo))
}

router.routes = {
    '': () => {
        const newApp = createTodo(orbital.todo)
        RJNA.update(newApp)
        const [[oldSelectedVDom], [currentSelectedVDom]] = RJNA.getObjByAttrsAndPropsVal(orbital.obj, "selected");
        currentSelectedVDom.attrs["class"] = currentSelectedVDom.attrs["class"].replace("selected", " ")
        RJNA.replaceParentNode(newApp, oldSelectedVDom, currentSelectedVDom)
        const [[oldActiveVDom], [currentActiveVDom]] = RJNA.getObjByAttrsAndPropsVal(orbital.obj, "#/");
        currentActiveVDom.attrs["class"] = "selected"
        RJNA.replaceParentNode(newApp, oldActiveVDom, currentActiveVDom)
    },
    'active': () => {
        let todo = orbital.todo.filter(todo => !todo.completed);
        const newApp = createTodo(todo)
        RJNA.update(newApp)
        const [[oldSelectedVDom], [currentSelectedVDom]] = RJNA.getObjByAttrsAndPropsVal(newApp, "selected");
        currentSelectedVDom.attrs["class"] = currentSelectedVDom.attrs["class"].replace("selected", " ")
        RJNA.replaceParentNode(newApp, oldSelectedVDom, currentSelectedVDom)
        const [[oldActiveVDom], [currentActiveVDom]] = RJNA.getObjByAttrsAndPropsVal(newApp, "#/active");
        currentActiveVDom.attrs["class"] = "selected"
        RJNA.replaceParentNode(newApp, oldActiveVDom, currentActiveVDom)
        let [oldActiveLi, currentActiveLi] = RJNA.getObjByAttrsAndPropsVal(newApp, "toggle");
        currentActiveLi.forEach(input => input.property["onclick"] = (evt) => {
            let [_, index] = nodeIndex(evt)
            orbital.todo[index].completed = !orbital.todo[index].completed
            router.routes["active"]()
        })
        currentActiveLi.forEach((input, index) => {
            RJNA.replaceParentNode(newApp, oldActiveLi[index], input)
            console.log(input.property.onclick)
        })
    },
    'completed': () => {
        let todo = orbital.todo.filter(todo => todo.completed);
        const newApp = createTodo(todo)
        RJNA.update(newApp)
        const [[oldSelectedVDom], [currentSelectedVDom]] = RJNA.getObjByAttrsAndPropsVal(newApp, "selected");
        currentSelectedVDom.attrs["class"] = currentSelectedVDom.attrs["class"].replace("selected", " ")
        RJNA.replaceParentNode(newApp, oldSelectedVDom, currentSelectedVDom)
        const [[oldActiveVDom], [currentActiveVDom]] = RJNA.getObjByAttrsAndPropsVal(newApp, "#/completed");
        currentActiveVDom.attrs["class"] = "selected"
        RJNA.replaceParentNode(newApp, oldActiveVDom, currentActiveVDom)
        let [oldCompletedLi, currentCompletedLi] = RJNA.getObjByAttrsAndPropsVal(newApp, "toggle");
        currentCompletedLi.forEach(input => input.property["onclick"] = (evt) => {
            let [_, index] = nodeIndex(evt)
            orbital.todo[index].completed = !orbital.todo[index].completed
            router.routes["completed"]()
        })
        currentCompletedLi.forEach((input, index) => {
            RJNA.replaceParentNode(newApp, oldCompletedLi[index], input)
            console.log(input.property.onclick)
        })
    },
}

window.addEventListener('hashchange', function () {
    orbital.endpoint = window.location.href.split('/').at(-1);


    console.log("🚀 ~ file: main.js:79 ~ window.addEventListener ~ orbital.endpoint:", orbital.endpoint)
    router.routes[orbital.endpoint]()


}, false);
