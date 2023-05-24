
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

function getObjByAttrsAndPropsVal(obj, value, parent = null, key = null) {
    const result = [];
    function searchInObject(obj, parent) {
        for (const prop in obj) {
            const currentValue = obj[prop];
            if (typeof currentValue === 'object') {
                searchInObject(currentValue, obj, prop);
            } else if (currentValue === value) {
                result.push(parent);
            }
        }
    }
    searchInObject(obj, null, null);
    return [result, JSON.parse(JSON.stringify(result))];
}

function getObjByTag(obj, value, parent = null, key = null) {
    const result = [];
    function searchInObject(obj, parent, key) {
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


function replaceParentNode(obj, parentNode, modifiedParentNode) {
    function replaceObject(obj, parentNode, modifiedParentNode) {
        if (obj === parentNode) {
            Object.assign(obj, modifiedParentNode);
        } else {
            if (obj.children) {
                for (let i = 0; i < obj.children.length; i++) {
                    replaceObject(obj.children[i], parentNode, modifiedParentNode);
                }
            }
        }
    }

    replaceObject(obj, parentNode, modifiedParentNode);

    return obj
}


const RJNA = {
    createElement,
    createNode,
    appendElement,
    getObjByAttrsAndPropsVal,
    replaceParentNode,
    getObjByTag
};

export default RJNA