import RJNA from "./rjna/engine.js";
import { todo_header } from "./html_components/todo_header.js";
import { main_section } from "./html_components/main_section.js";
import { footer_section } from "./html_components/footer_section.js";
import { footerInfo } from "./html_components/footer_info.js";
import diff from "./rjna/diff.js";
import {nodeIndex} from "./storage/functions.js"

export let sectionObj = RJNA.tag.section({
    "class": "todoapp",
}, {}, {},
    todo_header,
    main_section(orbital.todo),
    footer_section(orbital.todo),
)
export function changeSectionObj(newObj) {
    sectionObj = newObj
}

export function getSectionObj() {
    return sectionObj
}

export let rootEl
export function changeRootEl(newNode) {
    rootEl = newNode
}
export function createTodo() {
    return RJNA.tag.section({
        "class": "todoapp",
    }, {}, {}, todo_header,
        main_section(orbital.todo),
        footer_section(orbital.todo),
    )
}

window.onload = () => {
    switch (window.location.href.split('/').at(-1)) {
        case "active":
            let activeTodo = orbital.todo.filter(todo => !todo.completed);
            const activeApp = RJNA.tag.section({
                "class": "todoapp",
            },
                {},
                {},
                todo_header,
                main_section(activeTodo),
                footer_section(activeTodo),
            )
            rootEl = RJNA.createNode(activeApp)
            let [[oldSelectedVDom], [currentSelectedVDom]] = RJNA.getObjByAttrsAndPropsVal(activeApp, "selected");
            currentSelectedVDom.attrs["class"] = currentSelectedVDom.attrs["class"].replace("selected", " ")
            RJNA.replaceParentNode(activeApp,oldSelectedVDom, currentSelectedVDom)
            let [[oldActiveVDom], [currentActiveVDom]] = RJNA.getObjByAttrsAndPropsVal(getSectionObj(), "#/active");
            currentActiveVDom.attrs["class"] = "selected"
            RJNA.replaceParentNode(activeApp,oldActiveVDom, currentActiveVDom)
            let [oldActiveLi, currentActiveLi] = RJNA.getObjByAttrsAndPropsVal(activeApp, "toggle");
            currentActiveLi.forEach(input=>input.property["onclick"]=(evt)=>{
                let [_, index] = nodeIndex(evt)
                orbital.todo[index].completed = !orbital.todo[index].completed
                router.routes["active"]()
            })
            currentActiveLi.forEach((input,index)=>{
                RJNA.replaceParentNode(activeApp,oldActiveLi[index], input)
                console.log(input.property.onclick)
            })
            sectionObj = activeApp
            document.body.appendChild(rootEl);
            document.body.appendChild(RJNA.createNode(footerInfo))
            break;
        case "completed":
            console.log("completed")
            let todo = orbital.todo.filter(todo => todo.completed);
            const newApp = RJNA.tag.section({
                "class": "todoapp",
            },
                {},
                {},
                todo_header,
                main_section(todo),
                footer_section(todo),
            )
           
            
            rootEl = RJNA.createNode(newApp)
            document.body.appendChild(rootEl);
            document.body.appendChild(RJNA.createNode(footerInfo))
             const [[oldSelectVDom], [currentSelectVDom]] = RJNA.getObjByAttrsAndPropsVal(newApp, "selected");
            currentSelectVDom.attrs["class"] = currentSelectVDom.attrs["class"].replace("selected", " ")
            RJNA.replaceParentNode(newApp,oldSelectVDom, currentSelectVDom)
            const [[oldCompletedVDom], [currentCompletedVDom]] = RJNA.getObjByAttrsAndPropsVal(getSectionObj(), "#/completed");
            currentCompletedVDom.attrs["class"] = "selected"
            RJNA.replaceParentNode(newApp,oldCompletedVDom, currentCompletedVDom)
            let [oldCompletedLi, currentCompletedLi] = RJNA.getObjByAttrsAndPropsVal(newApp, "toggle");
            currentCompletedLi.forEach(input=>input.property["onclick"]=(evt)=>{
                let [_, index] = nodeIndex(evt)
                orbital.todo[index].completed = !orbital.todo[index].completed
                router.routes["completed"]()
            })
            currentCompletedLi.forEach((input,index)=>{
                RJNA.replaceParentNode(newApp,oldCompletedLi[index], input)
                console.log(input.property.onclick)
            })
            sectionObj = newApp
            break;
        default:
            rootEl = RJNA.createNode(createTodo())
            document.body.appendChild(rootEl);
            document.body.appendChild(RJNA.createNode(footerInfo))
            const [[oldSelect], [currentSelect]] = RJNA.getObjByAttrsAndPropsVal(sectionObj, "selected");
            currentSelect.attrs["class"] = currentSelect.attrs["class"].replace("selected", " ")
            RJNA.replaceParentNode(sectionObj,oldSelect, currentSelect)
            const [[oldAll], [currentAll]] = RJNA.getObjByAttrsAndPropsVal(getSectionObj(), "#/");
            currentAll.attrs["class"] = "selected"
            RJNA.replaceParentNode(sectionObj,oldAll, currentAll)
            break
    }
}


orbital.todo = JSON.parse(localStorage.getItem('todo_list')) || [];

window.onbeforeunload = () => {
    localStorage.setItem('todo_list', JSON.stringify(orbital.todo))
}

router.routes = {
    '': () => {
        let todo = orbital.todo;
        const newApp = RJNA.tag.section({
            "class": "todoapp",
        },
            {},
            {},
            todo_header,
            main_section(todo),
            footer_section(todo),
        )
        // inside new newApp, get selected RJNA.tag and 
        const patch = diff(getSectionObj(), newApp)
        changeRootEl(patch(rootEl))
        changeSectionObj(newApp)
        const [[oldSelectedVDom], [currentSelectedVDom]] = RJNA.getObjByAttrsAndPropsVal(newApp, "selected");
        currentSelectedVDom.attrs["class"] = currentSelectedVDom.attrs["class"].replace("selected", " ")
        RJNA.replaceParentNode(newApp,oldSelectedVDom, currentSelectedVDom)
        const [[oldActiveVDom], [currentActiveVDom]] = RJNA.getObjByAttrsAndPropsVal(getSectionObj(), "#/");
        currentActiveVDom.attrs["class"] = "selected"
        RJNA.replaceParentNode(newApp,oldActiveVDom, currentActiveVDom)
    },
    'active': () => {
        let todo = orbital.todo.filter(todo => !todo.completed);
        const newApp = RJNA.tag.section({
            "class": "todoapp",
        },
            {},
            {},
            todo_header,
            main_section(todo),
            footer_section(todo),
        )
        const patch = diff(getSectionObj(), newApp)
        changeRootEl(patch(rootEl))
        changeSectionObj(newApp)
        const [[oldSelectedVDom], [currentSelectedVDom]] = RJNA.getObjByAttrsAndPropsVal(newApp, "selected");
        currentSelectedVDom.attrs["class"] = currentSelectedVDom.attrs["class"].replace("selected", " ")
        RJNA.replaceParentNode(newApp,oldSelectedVDom, currentSelectedVDom)
        const [[oldActiveVDom], [currentActiveVDom]] = RJNA.getObjByAttrsAndPropsVal(getSectionObj(), "#/active");
        currentActiveVDom.attrs["class"] = "selected"
        RJNA.replaceParentNode(newApp,oldActiveVDom, currentActiveVDom)
        let [oldActiveLi, currentActiveLi] = RJNA.getObjByAttrsAndPropsVal(newApp, "toggle");
            currentActiveLi.forEach(input=>input.property["onclick"]=(evt)=>{
                let [_, index] = nodeIndex(evt)
                orbital.todo[index].completed = !orbital.todo[index].completed
                router.routes["active"]()
            })
            currentActiveLi.forEach((input,index)=>{
                RJNA.replaceParentNode(newApp,oldActiveLi[index], input)
                console.log(input.property.onclick)
            })
    },
    'completed': () => {
        let todo = orbital.todo.filter(todo => todo.completed);
        console.log(getSectionObj());
        const newApp = RJNA.tag.section({
            "class": "todoapp",
        },
            {},
            {},
            todo_header,
            main_section(todo),
            footer_section(todo),
        )
        const patch = diff(getSectionObj(), newApp)
        changeRootEl(patch(rootEl))
        changeSectionObj(newApp)
        const [[oldSelectedVDom], [currentSelectedVDom]] = RJNA.getObjByAttrsAndPropsVal(newApp, "selected");
        currentSelectedVDom.attrs["class"] = currentSelectedVDom.attrs["class"].replace("selected", " ")
        RJNA.replaceParentNode(newApp,oldSelectedVDom, currentSelectedVDom)
        const [[oldActiveVDom], [currentActiveVDom]] = RJNA.getObjByAttrsAndPropsVal(getSectionObj(), "#/completed");
        currentActiveVDom.attrs["class"] = "selected"
        RJNA.replaceParentNode(newApp,oldActiveVDom, currentActiveVDom)
        let [oldCompletedLi, currentCompletedLi] = RJNA.getObjByAttrsAndPropsVal(newApp, "toggle");
        currentCompletedLi.forEach(input=>input.property["onclick"]=(evt)=>{
            let [_, index] = nodeIndex(evt)
            orbital.todo[index].completed = !orbital.todo[index].completed
            router.routes["completed"]()
        })
        currentCompletedLi.forEach((input,index)=>{
            RJNA.replaceParentNode(newApp,oldCompletedLi[index], input)
            console.log(input.property.onclick)
        })
    },
}

window.addEventListener('hashchange', function () {
    orbital.endpoint = window.location.href.split('/').at(-1);


    console.log("🚀 ~ file: main.js:79 ~ window.addEventListener ~ orbital.endpoint:", orbital.endpoint)
    router.routes[orbital.endpoint]()


}, false);
