import {tag, tagWithState} from "../rjna/elements.js"
import { completeAllTasks } from "../storage/functions.js"
import { storage } from "../storage/store.js"


const [todo_counter, state] = tagWithState.span(
    {
        class: "todo-count",
        textContent: " items left ",
    },
    {},
    {},
);
state.setState({count:5})
todo_counter.children = [
    tag.strong({textContent: `${state.getState().count}`}),
    
];
// render,
// setState,
// getState,
// subscribe,
// unsubscribe,
            

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