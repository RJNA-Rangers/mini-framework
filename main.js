import {tag} from "./rjna/elements.js"
import RJNA from "./rjna/engine.js";
import { todo_header } from "./html_components/todo_header.js";
import { main_section } from "./html_components/main_section.js";
import { footer_section } from "./html_components/footer_section.js";
import { storage } from "./storage/store.js";
import { createLocalStorage } from "./storage/functions.js";

const sectionObj = tag.section({
    "class": "todoapp",
}, {}, {}, todo_header,
    main_section,
    footer_section)

window.onload = () => {
    storage.store(createLocalStorage)
    console.log(document.body.appendChild(RJNA.createNode(sectionObj)))
}

