import tag from "../rjna/elements.js"
import { completeAllTasks } from "../storage/functions.js"
import { storage } from "../storage/store.js"

const todo_counter =
    tag.span(
        {
            class: "todo-count",
            textContent: " items left ",
        },
        {},
        {},
        tag.strong(
            {
                textContent: 0,
                // in the state management to see how many to-do 
                // list
            },
        )
    )

const todo_clear_completed = tag.button(
    {
        class: "clear-completed",
        // "style":""
    },
    {},
    {},
    tag.a(
        {
            textContent: "Clear Completed"
        },
        {
            onclick: storage["clear-completed"](completeAllTasks)
        }
    )
)

const todo_filters =
    tag.ul(
        {
            class: "filters",
        },
        {},
        {},
        tag.li(
            {},
            {},
            {},
            tag.a(
                {
                    href: "#/",
                    class: "selected",
                    textContent: "All"
                }
            )
        ),
        tag.li(
            {},
            {},
            {},
            tag.a(
                {
                    href: "#/active",
                    textContent: "Active"
                }
            )
        ),
        tag.li(
            {},
            {},
            {},
            tag.a(
                {
                    href: "#/completed",
                    textContent: "Completed"
                }
            )
        )
    )


export const footer_section =
    tag.footer(
        {
            class: "footer",
        },
        {},
        {},
        todo_counter,
        todo_filters,
        todo_clear_completed,
    )