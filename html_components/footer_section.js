import { storage } from "../storage/store.js"

 const todo_counter={
    "tag": "span",
    "attrs": {
        "class": "todo-count",
        "textContent": " items left ",
    },
    "children": [
        {
            "tag": "strong",
            "attrs": {
                "textContent": "0",
                // in the state management to see how many to-do 
                // list
            }
        }
    ]
}

const todo_clear_completed={
    "tag": "button",
    "attrs": {
        "class":"clear-completed",
        // "style":""
    },
    "children": [
        {
            "tag": "a",
            "attrs": {
                "textContent": "Clear Completed"
            },
            "property":{
                "onclick":storage["clear-completed"]
            }
        }

    ]

}

const footer_section_buttons=[{
    "tag": "li",
    "attrs": {},
    "children": [
        {
            "tag": "a",
            "attrs": {
                "href": "#/",
                "class": "selected",
                "textContent": "All"
            }
        }

    ]
},
{
    "tag": "li",
    "attrs": {},
    "children": [
        {
            "tag": "a",
            "attrs": {
                "href": "#/active",
                "textContent": "Active"
            }
        }

    ]
},
{
    "tag": "li",
    "attrs": {},
    "children": [
        {
            "tag": "a",
            "attrs": {
                "href": "#/completed",
                "textContent": "Completed"
            }
        }

    ]
}]
const todo_filters={
    "tag": "ul",
    "attrs": {
        "class": "filters",
    },
    "children": footer_section_buttons
}

export const footer_section={
    "tag": "footer",
    "attrs": {
        "class": "footer",
        //    "style":""
    },
    "children": [
        todo_counter,
        todo_filters,
        todo_clear_completed,
    ]
}