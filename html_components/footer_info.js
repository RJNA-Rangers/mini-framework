import RJNA from "../rjna/engine.js"

// footer information section
export const footerInfo = RJNA.tag.footer(
    { class: "info" },
    {},
    {},
    RJNA.tag.p(
        {},
        {},
        {},
        "Double-Click to edit a todo"
    ),
    RJNA.tag.p(
        {},
        {},
        {},
        "Created by ",
        RJNA.tag.a(
            {
                href: "https://github.com/rsmith-github",
            },
            {},
            {},
            " Remington Smith, "
        ),
        RJNA.tag.a(
            {
                href: "https://github.com/Jasonasante",
            },
            {},
            {},
            " Jason Asante, "
        ),
        RJNA.tag.a({
            href: "https://github.com/AbdKhan1",
        },
            {},
            {},
            " Abd Al-Raheem Khan"),
    ),
    RJNA.tag.p(
        {},
        {},
        {},
        "Part of ",
        RJNA.tag.a(
            {
                href: "http://todomvc.com",
            },
            {},
            {},
            "TodoMVC"
        )
    )
)
