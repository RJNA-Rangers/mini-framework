import {tag } from "../rjna/elements.js"
import { insertIntoLocalStorage } from "../storage/functions.js"
import { storage } from "../storage/store.js"
// main title and input

export const todo_header =tag.header(
    {
        class: "header",
    },
    {},
    {},
    tag.h1({
        textContent: "todos"
    }),
    tag.input(
        {
            class: "new-todo",
            placeholder: "What needs to be done?",
            autofocus: "true",
        },
        {
            onkeyup: storage["insert"](insertIntoLocalStorage),
        },
     )
)