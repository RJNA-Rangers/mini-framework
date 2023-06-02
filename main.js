import RJNA from "./rjna/engine.js";
import { todo_header } from "./html_components/todo_header.js";
import { main_section } from "./html_components/main_section.js";
import { footer_section } from "./html_components/footer_section.js";
import { footerInfo } from "./html_components/footer_info.js";

export function createTodo() {
    return RJNA.tag.section({
        "class": "todoapp",
    }, {}, {}, todo_header,
        main_section(orbital.todo),
        footer_section(orbital.todo),
    )
}
window.onload = () => {
    console.log({ orbital })
    orbital.obj = createTodo()
    orbital.rootEl = RJNA.createNode(createTodo())
    document.body.appendChild(orbital.rootEl);
    document.body.appendChild(RJNA.createNode(footerInfo))

}

orbital.todo = JSON.parse(localStorage.getItem('todo_list')) || [];

window.onbeforeunload = () => {
    localStorage.setItem('todo_list', JSON.stringify(orbital.todo))
}

