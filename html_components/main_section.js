import { getFromLocalStorage, toggleAll } from "../storage/functions.js"
import { tag } from "../rjna/elements.js"
// main section
export const main_section = tag.section(
    { class: "main" },
    {},
    {},
    tag.input(
        {
            type: "checkbox",
            class: "toggle-all",
            id: "toggle-all"
        },
        { onclick: (evt) => toggleAll(evt) }
    ),
    tag.label(
        {
            for: "toggle-all",
            textContent: "Mark All As Complete"
        }
    ),
    tag.ul(
        { class: "todo-list" },
        {},
        {},
        ...getFromLocalStorage()
    )
)
