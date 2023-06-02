import { getFromLocalStorage } from "../storage/functions.js"
import RJNA from "../rjna/engine.js"
import { createTodo } from "../main.js"

// main section (todo display)
export const main_section = (todoArray) => RJNA.tag.section(
    { class: "main", style: todoArray.length ? "display: block;" : "display: none;" },
    {},
    {},
    RJNA.tag.input(
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
                const newApp = createTodo(todoArray)
                RJNA.update(newApp)
            }
        }
    ),
    RJNA.tag.label(
        {
            for: "toggle-all",
        },
        {},
        {},
        "Mark All As Complete"
    ),
    RJNA.tag.ul(
        { class: "todo-list" },
        {},
        {},
        ...getFromLocalStorage(todoArray)
    )
)
