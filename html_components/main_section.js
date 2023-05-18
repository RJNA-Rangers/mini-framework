import { getFromLocalStorage } from "../storage/functions.js"
import { tag } from "../rjna/elements.js"
import { todo_header } from "./todo_header.js";
import { footer_section } from "./footer_section.js";
import diff from "../rjna/diff.js";
import { getSectionObj, changeRootEl, changeSectionObj, rootEl } from "../main.js";
// main section

export const main_section = (todoArray) => tag.section(
    { class: "main", style: todoArray.length ? "display: block;" : "display: none;" },
    {},
    {},
    tag.input(
        {
            type: "checkbox",
            class: "toggle-all",
            id: "toggle-all"
        },
        {
            onclick: (evt) => {
                todoArray.filter(todo => todo.completed).length
                if (todoArray.filter(todo => todo.completed).length < todoArray.length) {
                    todoArray.forEach(todo => todo.completed = true)
                } else {
                    todoArray.forEach(todo => todo.completed = false)
                }
                const newApp = tag.section({
                    "class": "todoapp",
                }, {}, {}, todo_header,
                    main_section(todoArray),
                    footer_section(todoArray),
                )
                const patch = diff(getSectionObj(), newApp)
                changeRootEl(patch(rootEl))
                changeSectionObj(newApp)
            }
        }
    ),
    tag.label(
        {
            for: "toggle-all",
        },
        {},
        {},
        "Mark All As Complete"
    ),
    tag.ul(
        { class: "todo-list" },
        {},
        {},
        ...getFromLocalStorage(todoArray)
    )
)
