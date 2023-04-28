// main title and input
export const todo_header=        {
    "tag": "header",
    "attrs": {
        "class": "header",
    },
    "children": [
        {
            "tag": "h1",
            "attrs": {
                "textContent": "todos"
            },

        },
        {
            "tag": "input",
            "attrs": {
                "class": "new-todo",
                "placeholder": "What needs to be done?",
                "autofocus": "true",
            },
        },
    ]
}