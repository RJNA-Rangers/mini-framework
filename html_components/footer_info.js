import { tag } from "../rjna/elements.js"
export const footerInfo = tag.footer(
    { class: "info" },
    {},
    {},
    tag.p(
        { textContent: "Double-Click to edit a todo" }
    ),
    tag.p(
        { textContent: "Created by " },
        {},
        {},
        tag.a(
            {
                href: "#",
                textContent: " Remington Smith "
            }
        ),
        tag.a(
            {
                href: "#",
                textContent: " Jason Asante "
            }
        ),
        tag.a({
            href: "#",
            textContent: " Nik Don "
        }),
        tag.a({
            href: "#",
            textContent: " Abd Al-Raheem Khan "
        }),
    ),
    tag.p(
        { textContent: "Part of " },
        {},
        {},
        tag.a(
            {
                href: "http://todomvc.com",
                textContent: "TodoMVC"
            }
        )
    )
)