import RJNA from "../rjna/engine.js"
import { main_section } from "./main_section.js";
import { todo_header } from "./todo_header.js";
// import { getSectionObj, changeRootEl, changeSectionObj, rootEl } from "../main.js";
import diff from "../rjna/diff.js";

// footer section
const todo_clear_completed = (count) => RJNA.tag.button(
  {
    class: "clear-completed",
    style: count.filter(todo => todo.completed).length ? "display: block;" : "display: none;"
  },
  {},
  {},
  RJNA.tag.a(
    {
    },
    {
      onclick: () => {
        orbital.todo = orbital.todo.filter(todo => !todo.completed);
        const newApp = RJNA.tag.section({
          "class": "todoapp",
        },
          {},
          {},
          todo_header,
          main_section(orbital.todo),
          footer_section(orbital.todo),
        )
        const patch = diff(orbital.obj, newApp)
        orbital.rootEl = patch(orbital.rootEl)
        orbital.obj = newApp
      },
    },
    {},
    "Clear Completed"
  )
);

const todo_filters = RJNA.tag.ul(
  {
    class: "filters",
  },
  {},
  {},
  RJNA.tag.li(
    {},
    {},
    {},
    RJNA.tag.a({
      href: "#/",
      class: window.location.href.split("/")[window.location.href.split("").length - 1] == "#" ? "selected" : window.location.href.split("/")[window.location.href.split("/").length - 1] == "" ? "selected" : "",
    },
      {
        onclick: () => {
          // re page as orbital.todo will nly contain
          // !todo.completed
          const newApp = RJNA.tag.section({
            "class": "todoapp",
          },
            {},
            {},
            todo_header,
            main_section(orbital.todo),
            footer_section(orbital.todo),
          )
          const patch = diff(orbital.obj, newApp)
          orbital.rootEl = patch(orbital.rootEl)
          orbital.obj = newApp

          // get ul children from section obj(li's)
          // input checked (on click function), will re render page as todo is chasnged
        }
      },
      {},
      "All")
  ),
  RJNA.tag.li(
    {},
    {},
    {},
    RJNA.tag.a({
      href: "#/active",
      class: window.location.href.split("/")[window.location.href.split("/").length - 1] == "active" ? "selected" : ""
    },
      {
        onclick: (evt) => {
          // re page as orbital.todo will nly contain
          // !todo.completed
          const oldSection = JSON.parse(JSON.stringify(orbital.obj))
          const [oldSelectedVDom, currentSelectedVDom] = RJNA.getObjByAttrsAndPropsVal(orbital.obj, "selected");
          console.log(oldSelectedVDom)
          // currentSelectedVDom.attrs["class"]=currentSelectedVDom.attrs["class"].replace("selected", " ")
          // const [[oldActiveVDom], [currentActiveVDom]] = RJNA.getObjByAttrsAndPropsVal(orbital.obj, "#/active");
          // currentActiveVDom.attrs["class"]="selected"
          // console.log(orbital)
          // orbital.todo.forEach(todo => {
          //   const [[oldLiVDom], [currentLiVDom]] = RJNA.getObjByAttrsAndPropsVal(orbital.obj, todo.id);
          //   // console.log(oldLiVDom)

          // });
          // const newApp = RJNA.replaceParentNode(orbital.obj, oldVDom, currentVDom)

          const [oldLiVDom, currentLiVDom] = RJNA.getObjByTag(orbital.obj, "li");
          // get all toggle class lis
          // "change the onclick function"


          console.log(oldLiVDom)
          let todo = orbital.todo.filter(todo => !todo.completed);
          const newApp = RJNA.tag.section({
            "class": "todoapp",
          },
            {},
            {},
            todo_header,
            main_section(todo),
            footer_section(todo),
          )
          // inside new newApp, get selected RJNA.tag and 
          const patch = diff(orbital.obj, newApp)
          orbital.rootEl = patch(orbital.rootEl)
          orbital.obj = newApp
          // get ul children from section obj(li's)
          // input checked (on click function), will re render page as todo is chasnged
        }
      },
      {},
      "Active"
    )
  ),
  RJNA.tag.li(
    {},
    {},
    {},
    RJNA.tag.a({
      href: "#/completed",
      class: window.location.href.split("/")[window.location.href.split("/").length - 1] == "completed" ? "selected" : ""
    },
      {
        onclick: () => {
          // re page as orbital.todo will nly contain
          // todo.completed
          let todo = orbital.todo.filter(todo => todo.completed);
          const newApp = RJNA.tag.section({
            "class": "todoapp",
          },
            {},
            {},
            todo_header,
            main_section(todo),
            footer_section(todo),
          )
          const patch = diff(orbital.obj, newApp)
          orbital.rootEl = patch(orbital.rootEl)
          orbital.obj = newApp
          // get ul children from section obj(li's)
          // input checked (on click function), will re render page as todo is chasnged
        }
      },
      {},
      "Completed")
  )
);

export const footer_section = (count) => RJNA.tag.footer(
  {
    class: "footer",
    style: count.length ? "display: block;" : "display: none;",
  },
  {},
  {},
  RJNA.tag.span(
    {
      class: "todo-count",
    },
    {},
    {},
    RJNA.tag.strong({}, {}, {}, (count.length - count.filter(todo => todo.completed).length).toString()),
    " items left ",
  ),
  todo_filters,
  todo_clear_completed(count)
);