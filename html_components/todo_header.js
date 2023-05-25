import RJNA from "../rjna/engine.js"
import { insertIntoLocalStorage } from "../storage/functions.js"

// main title and input text
export const todo_header = RJNA.tag.header(
    {
        class: "header",
    },
    {},
    {},
    RJNA.tag.h1({},{},{},"todos"),
    RJNA.tag.input(
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