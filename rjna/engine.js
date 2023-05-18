
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
            result.setAttribute(key, value);
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

// Define a helper function for creating DOM elements using tagged template literals
function DomToObj(element) {

    const tag = element.nodeName.toLowerCase();
    const attrs = {};
    const property = {};
    const booleanProperties = [
        'disabled',
        'checked',
        'readonly',
        'required',
        'multiple',
        'autoplay',
        'hidden',
        'selected',
        'autofocus',
        'spellcheck',
        'draggable',
        'contenteditable',
        'download',
        'translate'
    ];

    for (const { name, value } of element.attributes) {
        if (booleanProperties.includes(name)) {
            property[name] = value !== null
        } else {
            attrs[name] = value;
        }
    }

    for (const key in element) {
        const eventName = key; // Remove 'on' prefix
        if (key.startsWith('on') && typeof element[key] === 'function') {
            property[eventName] = element[key];
        } else if (booleanProperties.includes(key)) {
            property[eventName] = element[key]
        }
    }

    const children = [];
    for (const child of element.childNodes) {
        if (child.nodeType === Node.TEXT_NODE) {
            children.push(child.textContent);
        } else if (child.nodeType === Node.ELEMENT_NODE) {
            children.push(DomToObj(child));
        }
    }

    return {
        tag,
        attrs,
        property,
        children,
    };
}


const RJNA = {
    createElement,
    createNode,
    appendElement,
    DomToObj
};

export default RJNA