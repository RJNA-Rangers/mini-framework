import { tag, tagWithState } from "../rjna/elements.js";
import { createNode } from "../rjna/engine.js";
import { clearCompleted, getFromLocalStorage } from "../storage/functions.js";
const todos = orbital.todo;
const state = { count: todos.length - todos.filter(todo=>todo.completed).length};
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
    {onclick:()=>{
      // let hash=evt.target.hash
      // console.log({hash})
      let todoListObj= getFromLocalStorage()
      let activeTodoObj=todoListObj.filter(todo=>todo.attrs.class!="completed")

      console.log({activeTodoObj})
      // change onclick function for each todo
      // create an array of doms with new onclick
      // replace ul children with the new dom Array
      let newActiveTodoObj=activeTodoObj.map(todo=>{
        console.log(todo)
        todo.children[0].children[0]["onclick"]=(evt)=>{
          let [node,_]=nodeIndex()
          node.remove()
        }
        return createNode(todo)
      })
      document.querySelector(".todo-list").replaceChildren(newActiveTodoObj)
    }},
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
let display ="" ;
if (todos.length <= 0) {
  display ="display: none;"
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
  state.count= getFromLocalStorage().length - document.querySelectorAll('.completed').length || 0;
  let newCounter = todo_counter
  newCounter.children[0].attrs.textContent = `${state.count}`
  console.log(newCounter)
  counterState.render(newCounter, document.querySelector(".todo-count").firstChild)
  
  if (getFromLocalStorage().length > 0) {
    document.querySelector('.main').style.display = "block";
    footer_section.attrs.style = "";
    footerState.render(footer_section, document.querySelector(".footer"));
  } else {
    document.querySelector('.main').style.display = "none";
    footer_section.attrs.style = "display: none;";
    footerState.render(footer_section, document.querySelector(".footer"));
  }
};