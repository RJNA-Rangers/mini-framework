import { tag } from "../rjna/elements.js";
import { createNode } from "../rjna/engine.js";
import { getFromLocalStorage } from "../storage/functions.js";
import { main_section } from "./main_section.js";
import { todo_header } from "./todo_header.js";
import { getSectionObj, changeRootEl, changeSectionObj, rootEl } from "../main.js";
import diff from "../rjna/diff.js";

const todo_clear_completed = (count) => tag.button(
  {
    class: "clear-completed",
    style: count.filter(todo => todo.completed).length ? "display: block;" : "display: none;"
  },
  {},
  {},
  tag.a(
    {
    },
    {
      onclick: () => {
        orbital.todo = orbital.todo.filter(todo => !todo.completed);
        const newApp = tag.section({
          "class": "todoapp",
        },
          {},
          {},
          todo_header,
          main_section(orbital.todo),
          footer_section(orbital.todo),
        )
        const patch = diff(getSectionObj(), newApp)
        changeRootEl(patch(rootEl))
        changeSectionObj(newApp)
      },
    },
    {},
    "Clear Completed"
  )
);

const todo_filters = tag.ul(
  {
    class: "filters",
  },
  {},
  {},
  tag.li(
    {},
    {},
    {},
    tag.a({
      href: "#/",
      class: "selected",
    },
      {},
      {},
      "All")
  ),
  tag.li(
    {},
    {},
    {},
    tag.a({
      href: "#/active",
    },
      {
        onclick: () => {
          // let hash=evt.target.hash
          // console.log({hash})
          let todoListObj = getFromLocalStorage()
          let activeTodoObj = todoListObj.filter(todo => todo.attrs.class != "completed")

          console.log({ activeTodoObj })
          // change onclick function for each todo
          // create an array of doms with new onclick
          // replace ul children with the new dom Array
          let newActiveTodoObj = activeTodoObj.map(todo => {
            console.log(todo)
            todo.children[0].children[0]["onclick"] = (evt) => {
              let [node, _] = nodeIndex()
              node.remove()
            }
            return createNode(todo)
          })
          document.querySelector(".todo-list").replaceChildren(...newActiveTodoObj)
        }
      },
      {},
      "Active"
    )
  ),
  tag.li(
    {},
    {},
    {},
    tag.a({
      href: "#/completed",
    },
      {},
      {},
      "Completed")
  )
);

export const footer_section = (count) => tag.footer(
  {
    class: "footer",
    style: count.length ? "display: block;" : "display: none;",
  },
  {},
  {},
  tag.span(
    {
      class: "todo-count",
    },
    {},
    {},
    tag.strong({}, {}, {}, (count.length - count.filter(todo => todo.completed).length).toString()),
    " items left ",
  ),
  todo_filters,
  todo_clear_completed(count)
);