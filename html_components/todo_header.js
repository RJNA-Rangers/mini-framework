import { tag } from "../rjna/elements.js"
import { insertIntoLocalStorage } from "../storage/functions.js"
// main title and input

export const todo_header = tag.header(
    {
        class: "header",
    },
    {},
    {},
    tag.h1({},{},{},"todos"),
    tag.input(
        {
            class: "new-todo",
            placeholder: "What needs to be done?",
            autofocus: "true",
        },
        {
            onkeyup: (evt) => insertIntoLocalStorage(evt),
        },
    )
)