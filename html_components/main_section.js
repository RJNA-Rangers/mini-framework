import { getFromLocalStorage, toggleAll } from "../storage/functions.js"
import { tag } from "../rjna/elements.js"
// main section
let style = "display: block;";
if (orbital.todo.length <= 0){
    style = "display: none;"
}
export const main_section =(todoArray)=> tag.section(
    { class: "main", style:`${style}`},
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
        ...getFromLocalStorage(todoArray)
    )
)
