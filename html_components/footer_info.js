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
                href: "https://github.com/rsmith-github",
            },
            {},
            {},
            " Remington Smith, "
        ),
        tag.a(
            {
                href: "https://github.com/Jasonasante",
            },
            {},
            {},
            " Jason Asante, "
        ),
        tag.a({
            href: "https://github.com/nik-don",
        },
            {},
            {},
            " Nikolo Don, "),
        tag.a({
            href: "https://github.com/AbdKhan1",
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