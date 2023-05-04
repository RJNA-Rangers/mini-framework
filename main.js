import { todo_header } from "./html_components/todo_header.js";
import { main_section } from "./html_components/main_section.js";
import { footer_section } from "./html_components/footer_section.js";
import { storage } from "./storage/store.js";
const section =
{
    "tag": "section",
    "attrs": {
        "class": "todoapp",
    },
    "children": [
        todo_header,
        main_section,
        footer_section

    ]
}

export function createNode(obj) {
    const result = document.createElement(obj.tag);

    if (obj.children) {
        for (const child of obj.children) {
            result.appendChild(createNode(child));
        }
    }

    for (const [key, value] of Object.entries(obj.attrs)) {
        if (key == "textContent") {
            result.appendChild(text(value))
        } else {
            result.setAttribute(key, value);
        }
    }
    if (obj.property) {
        for (const [key, value] of Object.entries(obj.property)) {
            result[key] = value
        }
    }
    return result;
}

function text(input) {
    return document.createTextNode(input)
}

window.onload = () => {
    storage.store
    console.log(document.body.appendChild(createNode(section)))
}

