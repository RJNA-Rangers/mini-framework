
function createElement(tag, attributes = {}, eventHandlers = {}, properties = {}, ...children) {
    return {
        tag,
        "attrs": { ...attributes },
        "property": { ...eventHandlers, ...properties },
        children,
    }
}

export function createNode(obj) {
    const result = document.createElement(obj.tag);
    if (obj.attrs) {
        for (const [key, value] of Object.entries(obj.attrs)) {
            if (key == "textContent") {
                result.appendChild(text(value))
            } else {
                result.setAttribute(key, value);
            }
        }
    }

    if (obj.children) {
        for (const child of obj.children) {
            if (typeof child == "string") {
                result.appendChild(text(child))
            } else {

                result.appendChild(createNode(child));
            }
        }
    }

    if (obj.property) {
        for (const [key, value] of Object.entries(obj.property)) {
            result[key] = value
        }
    }

    return result;
}

export function text(input) {
    return document.createTextNode(input)
}

function appendElement(child, parent) {
    parent.appendChild(child)
}

const RJNA = {
    createElement,
    createNode,
    appendElement
};

export default RJNA