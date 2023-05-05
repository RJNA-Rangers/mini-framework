function createElement(tag, attributes = {}, eventHandlers = {}, properties = {}, ...children) {
    return {
        tag,
        "attrs": { ...attributes },
        "property": { ...eventHandlers, ...properties },
        children
    }
}

 function createNode(obj) {
    const result = document.createElement(obj.tag);

    if (obj.children) {
        for (const child of obj.children) {
            result.appendChild(createNode(child));
        }
    }

    for (const [key, value] of Object.entries(obj.attrs)) {
        if (key == "textContent") {
            result.appendChild(text(value))
        } else {
            result.setAttribute(key, value);
        }
    }
    if (obj.property) {
        for (const [key, value] of Object.entries(obj.property)) {
            result[key] = value
        }
    }

    return result;
}

function text(input) {
    return document.createTextNode(input)
}

function render(child,parent){
    parent.appendChild(child)
}

const RJNA = {
    createElement,
    createNode,
    render
  };
  
  export default RJNA