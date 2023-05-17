import { tag } from "../rjna/elements.js"
export const footerInfo = tag.footer(
    { class: "info" },
    {},
    {},
    tag.p(
        {},
        {},
        {},
        "Double-Click to edit a todo"
    ),
    tag.p(
        {},
        {},
        {},
        "Created by ",
        tag.a(
            {
                href: "#",
            },
            {},
            {},
            " Remington Smith, "
        ),
        tag.a(
            {
                href: "#",
            },
            {},
            {},
            " Jason Asante, "
        ),
        tag.a({
            href: "#",
        },
        {},
        {},
        " Nikolo Don, "),
        tag.a({
            href: "#",
        },
        {},
        {},
        " Abd Al-Raheem Khan"),
    ),
    tag.p(
        {},
        {},
        {},
        "Part of ",
        tag.a(
            {
                href: "http://todomvc.com",
            },
            {},
            {},
            "TodoMVC"
        )
    )
)