// import { getSectionObj, changeSectionObj, changeRootEl, createTodo, rootEl } from "../main.js";
import { createTodo } from "../main.js"
import diff from "./diff.js";

// creates VDOM
function createElement(tag, attributes = {}, eventHandlers = {}, properties = {}, ...children) {
    const element = {
        tag,
        attrs: { ...attributes },
        property: { ...eventHandlers, ...properties },
        children,
    };

    // Custom methods
    // change tag
    element.setTag = function (newTag) {
        const oldVDOM = JSON.parse(JSON.stringify(element))
        element.tag = newTag;
        replaceParentNode(orbital.obj, oldVDOM, element)
        return Element
    };

    // attributes

    // add/change attributes
    element.setAttr = function (key, val) {
        const oldVDOM = JSON.parse(JSON.stringify(element))
        if (element.attrs.hasOwnProperty(key)) {
            element.attrs[key] += " " + val

        } else {
            element.attrs[key] = val;
        }
        replaceParentNode(orbital.obj, oldVDOM, element)
        return element
    };

    // properties

    // add/change properties
    element.setProp = function (key, val) {
        const oldVDOM = JSON.parse(JSON.stringify(element))
        element.property[key] = val;
        replaceParentNode(orbital.obj, oldVDOM, element)
        return element
    };

    // children

    // add child
    element.setChild = function (...obj) {
        const newVDOM = JSON.parse(JSON.stringify(element)); // Create a deep copy of element
        const newChildren = [...element.children, ...obj]
        newVDOM.children = newChildren
        replaceParentNode(orbital.obj, element, newVDOM);
        console.log(orbital.obj, "ororororor")
        return element
    };

    // remove VDOM

    return element;
}

// all html tags
const htmlTags = [
    "a", "abbr", "address", "area", "article", "aside", "audio",
    "b", "base", "bdi", "bdo", "blockquote", "body", "br", "button",
    "canvas", "caption", "cite", "code", "col", "colgroup", "data",
    "datalist", "dd", "del", "details", "dfn", "dialog", "div", "dl",
    "dt", "em", "embed", "fieldset", "figcaption", "figure", "footer",
    "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hr",
    "html", "i", "iframe", "img", "input", "ins", "kbd", "label", "legend",
    "li", "link", "main", "map", "mark", "meta", "meter", "nav", "noscript",
    "object", "ol", "optgroup", "option", "output", "p", "param", "picture",
    "pre", "progress", "q", "rb", "rp", "rt", "rtc", "ruby", "s", "samp",
    "script", "section", "select", "slot", "small", "source", "span", "strong",
    "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea",
    "tfoot", "th", "thead", "time", "title", "tr", "track", "u", "ul", "var", "video",
    "wbr"
];

// creates createElement function for each html tag
const tag = {}
htmlTags.forEach((tagName) => {
    tag[tagName] = (attributes = {}, eventHandlers = {}, properties = {}, ...children) => RJNA.createElement(tagName, attributes, eventHandlers, properties, ...children)
})

// creates and returns real DOM from createElement obj.
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

// creates text text node for input
export function text(input) {
    return document.createTextNode(input)
}

// deep searches through the all keys, with the exception of tag, 
// of the input object and returns two identical arrays [untouch, toModify]
// of the parent objs that match the input value
function getObjByAttrsAndPropsVal(obj, value) {
    const result = [];
    console.log(obj)
    function searchInObject(obj, parent) {
        for (const prop in obj) {
            console.log({ prop }, obj[prop])
            const currentValue = obj[prop];
            if (typeof currentValue === 'object') {
                searchInObject(currentValue, obj, prop);

            } else if (typeof currentValue === 'string') {
                if (currentValue.split(" ").includes(value)) {
                    if (prop != "tag")
                        result.push(parent);

                }
            } else if (currentValue === value) {
                if (prop != "tag")
                    result.push(parent);
            }
        }
    }
    searchInObject(obj, null, null);
    return [result, JSON.parse(JSON.stringify(result))];
}

// deep searches through the tag key of the input object and returns 
// two identical arrays [untouch, toModify] of objs that match the
// input value
function getObjByTag(obj, value) {
    const result = [];
    function searchInObject(obj) {
        for (const prop in obj) {
            const currentValue = obj[prop];
            if (typeof currentValue === 'object') {
                searchInObject(currentValue, obj, prop);
            } else if (currentValue === value) {
                if (prop === "tag") {
                    result.push(obj);
                }
            }
        }
    }

    searchInObject(obj, null, null);
    return [result, JSON.parse(JSON.stringify(result))];
}

// replaces the old node obj with modified/new node object and 
// applies those changes to real node whilst updating the specified
// object.
function replaceParentNode(obj, node, modifiedNode) {
    let oldSection = JSON.parse(JSON.stringify(obj))
    function replaceObject(obj, node, modifiedNode) {
        if (obj === node) {
            Object.assign(obj, modifiedNode);
        } else {
            if (obj.children) {
                for (let i = 0; i < obj.children.length; i++) {
                    replaceObject(obj.children[i], node, modifiedNode);
                }
            }
        }
    }
    replaceObject(obj, node, modifiedNode);
    const patch = diff(oldSection, obj)
    orbital.rootEl = patch(orbital.rootEl)
    orbital.obj = obj
}

// updates specified obj in accordance to state changes and apply
// those changes to the real DOM.
function update(newApp) {
    const patch = diff(orbital.obj, newApp)
    orbital.rootEl = patch(orbital.rootEl)
    orbital.obj = newApp
}

const RJNA = {
    tag,
    createElement,
    createNode,
    getObjByAttrsAndPropsVal,
    replaceParentNode,
    getObjByTag,
    update
};

export default RJNA