import RJNA from "../rjna/engine.js";
import { main_section } from "./main_section.js";
import { todo_header } from "./todo_header.js";
// import { getSectionObj, changeRootEl, changeSectionObj, rootEl } from "../main.js";
import diff from "../rjna/diff.js";
import { createTodo } from "../main.js";

// footer section
const todo_clear_completed = (count) =>
  RJNA.tag.button(
    {
      class: "clear-completed",
      style: orbital.todo.filter((todo) => todo.completed).length
        ? "display: block;"
        : "display: none;",
    },
    {},
    {},
    RJNA.tag.a(
      {},
      {
        onclick: () => {
          orbital.todo = orbital.todo.filter((todo) => !todo.completed);
          RJNA.update(createTodo(orbital.todo));
          switch (window.location.href.split("/").at(-1)) {
            case "active":
              router.routes["active"]();
              break;
            case "completed":
              router.routes["completed"]();
              break;
            case "":
              router.routes[""]();
              break;
          }
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
    RJNA.tag.a(
      {
        href: "#/",
        class:
          window.location.href.split("/")[
            window.location.href.split("").length - 1
          ] == "#"
            ? "selected"
            : window.location.href.split("/")[
                window.location.href.split("/").length - 1
              ] == ""
            ? "selected"
            : "",
      },
      {
        onclick: () => router.routes[""](),
      },
      {},
      "All"
    )
  ),
  RJNA.tag.li(
    {},
    {},
    {},
    RJNA.tag.a(
      {
        href: "#/active",
        class:
          window.location.href.split("/")[
            window.location.href.split("/").length - 1
          ] == "active"
            ? "selected"
            : "",
      },
      {
        onclick: () => router.routes["active"](),
      },
      {},
      "Active"
    )
  ),
  RJNA.tag.li(
    {},
    {},
    {},
    RJNA.tag.a(
      {
        href: "#/completed",
        class:
          window.location.href.split("/")[
            window.location.href.split("/").length - 1
          ] == "completed"
            ? "selected"
            : "",
      },
      {
        onclick: () => router.routes["completed"](),
      },
      {},
      "Completed"
    )
  )
);

export const footer_section = (count) =>
  RJNA.tag.footer(
    {
      class: "footer",
      style: orbital.todo.length ? "display: block;" : "display: none;",
    },
    {},
    {},
    RJNA.tag.span(
      {
        class: "todo-count",
      },
      {},
      {},
      RJNA.tag.strong(
        {},
        {},
        {},
        orbital.todo.filter((todo) => !todo.completed).length.toString()
      ),
      " items left "
    ),
    todo_filters,
    todo_clear_completed(count)
  );
