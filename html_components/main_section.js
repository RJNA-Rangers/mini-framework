// main section
export const main_section={
    "tag": "section",
    "attrs": {
        "class": "main",
        // "style":"",
    },
    "children": [
        {
            "tag": "input",
            "attrs": {
                "type": "checkbox",
                "class": "toggle-all",
                "id": "toggle-all",
            },
        },
        {
            "tag": "label",
            "attrs": {
                "for": "toggle-all",
                "textContent": "Mark all as complete"
            },
        },
        {
            "tag": "ul",
            "attrs": {
                "class": "todo-list",
            },
        },
    ]
}