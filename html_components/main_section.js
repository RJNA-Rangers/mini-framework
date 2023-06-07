import { getFromLocalStorage } from "../storage/functions.js"
import RJNA from "../rjna/engine.js"
import { createTodo } from "../main.js"

// main section (todo display)
export const main_section = (todoArray) => RJNA.tag.section(
    { class: "main", style: orbital.todo.length ? "display: block;" : "display: none;" },
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
                console.log(orbital.todo.filter(todo => todo.completed).length)
                if (orbital.todo.filter(todo => todo.completed).length < orbital.todo.length) {
                    orbital.todo.forEach(todo => todo.completed = true)
                } else {
                    orbital.todo.forEach(todo => todo.completed = false)
                }
                switch (window.location.href.split('/').at(-1)) {
                    case "active":
                        router.routes["active"]()
                        break
                    case "completed":
                        router.routes["completed"]()
                        break
                    case "":
                        router.routes[""]()
                        break
                }
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
