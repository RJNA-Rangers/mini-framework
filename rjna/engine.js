import { getSectionObj, changeSectionObj, changeRootEl, createTodo, rootEl } from "../main.js";
import diff from "./diff.js";

// creates VDOM
function createElement(tag, attributes = {}, eventHandlers = {}, properties = {}, ...children) {
    return {
        tag,
        "attrs": { ...attributes },
        "property": { ...eventHandlers, ...properties },
        children,
    }
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
    function searchInObject(obj, parent) {
        for (const prop in obj) {
            const currentValue = obj[prop];
            if (typeof currentValue === 'object') {
                searchInObject(currentValue, obj);
            } else if (currentValue === value) {
                if (prop != "tag")
                result.push(parent);
            }
        }
    }
    searchInObject(obj, null, null);
    return [result, JSON.parse(JSON.stringify(result))];
}


//renders any immediate changes that should be made upon calling getObjByAttrsAndPropsVal
//if no renders need to be made upon it's initial call use getObjByAttrsAndPropsVal
function render(obj, value, propertyName, newValue, children) {
    const result = [];
    let propOrAttr = '';
    function searchInObject(object, parent) {
        for (const prop in object) {
            const currentValue = object[prop];
            if (typeof currentValue === 'object') {
                propOrAttr = prop.toString();
                searchInObject(currentValue, object);
            } else if (currentValue === value) {
                if (prop != "tag")
                result.push(parent);
                //update parent's object properties or attributes with new values if they exist
                let newParent = JSON.parse(JSON.stringify(parent));
                let newObj = JSON.parse(JSON.stringify(object));
                if(newValue !== undefined && propertyName !==undefined)
                if (Array.isArray(children)){
                    children.forEach(child => newParent.children.push(child))
                }
                //if the value needs to concat on a previous value...
                if (typeof newValue == 'string' && newValue.slice(0,2) == "+="){
                    newObj[propertyName] += newValue.slice(2);
                }else if (typeof newValue == 'string' && newValue.slice(0,2) == "-="){
                    newObj[propertyName] -= newValue.slice(2);
                }else{
                    newObj[propertyName] = newValue;
                }
                newParent[propOrAttr] = newObj;
                replaceParentNode(obj, parent, newParent);
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
    changeRootEl(patch(rootEl))
    changeSectionObj(obj)
}

// updates specified obj in accordance to state changes and apply
// those changes to the real DOM.
function update() {
    const newApp = createTodo()
    const patch = diff(getSectionObj(), newApp)
    changeRootEl(patch(rootEl))
    changeSectionObj(newApp)
}


const RJNA = {
    tag,
    createElement,
    createNode,
    getObjByAttrsAndPropsVal,
    replaceParentNode,
    getObjByTag,
    update,
    render
};

export default RJNA