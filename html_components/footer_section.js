import { tag, tagWithState } from "../rjna/elements.js";
import { clearCompleted, getFromLocalStorage } from "../storage/functions.js";
const state = { count: getFromLocalStorage().length };
const [todo_counter, counterState] = tagWithState.span(
  {
    class: "todo-count",
  },
  {},
  {},
  tag.strong({ textContent: `${state.count}` }),
  " items left ",
);

const todo_clear_completed = tag.button(
  {
    class: "clear-completed",
  },
  {},
  {},
  tag.a(
    {
      textContent: "Clear Completed",
    },
    {
      onclick: (evt) => clearCompleted(evt),
    }
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
      textContent: "All",
    })
  ),
  tag.li(
    {},
    {},
    {},
    tag.a({
      href: "#/active",
      textContent: "Active",
    },
    )
  ),
  tag.li(
    {},
    {},
    {},
    tag.a({
      href: "#/completed",
      textContent: "Completed",
    })
  )
);
let display = "display: none;";
if (state.count > 0) {
  display = "";
}
export const [footer_section, footerState] = tagWithState.footer(
  {
    class: "footer",
    style: `${display}`,
  },
  {},
  {},
  todo_counter,
  todo_filters,
  todo_clear_completed
);

export const updateCount = () => {
  state.count = getFromLocalStorage().length;
  let newCounter = todo_counter
  newCounter.children[0].attrs.textContent = `${state.count}`
  console.log(newCounter)
  counterState.render(newCounter, document.querySelector(".todo-count").firstChild)

  if (state.count > 0) {
    footer_section.attrs.style = "";
    footerState.render(footer_section, document.querySelector(".footer"));
  } else {
    footer_section.attrs.style = "display: none;";
    footerState.render(footer_section, document.querySelector(".footer"));
  }
};