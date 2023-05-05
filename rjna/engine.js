// Define a base class for components
class RJComponent {
    constructor(props) {
      this.props = props;
    }
  }
  
  // Create an element representation for the rendering engine
  function createElement(type, props = {}, ...children) {
    return {
      type,
      props: { ...props, children },
    };
  }
  
  // Render the element representation to the DOM
  function render(element, container) {
    if (typeof element === 'string') {
      container.appendChild(document.createTextNode(element));
      return;
    }
  
    const domElement = document.createElement(element.type);
  
    for (const [key, value] of Object.entries(element.props)) {
      if (key !== 'children') {
        domElement.setAttribute(key, value);
      }
    }
    if (element.props.children) {
    for (const child of element.props.children) {
      render(child, domElement);
    }
    }
  
    container.appendChild(domElement);
  }
  
  // Define a helper function for creating DOM elements using tagged template literals
  function rj(strings, ...values) {
    // Process the template literal and create a DOM element
    const processTemplate = (strings, values) => {
      const template = strings
        .map((string, i) => `${string}${values[i] || ''}`)
        .join('')
        .trim();
  
      const parser = new DOMParser();
      const doc = parser.parseFromString(template, 'text/html');
      return doc.body.firstChild;
    };
  
    const domElement = processTemplate(strings, values);
  
    // Convert the DOM element to a virtual node representation
    const convertToVirtualNode = (element) => {
      const type = element.nodeName.toLowerCase();
      const props = {};
      for (const { name, value } of element.attributes) {
        props[name] = value;
      }
  
      const children = [];
      for (const child of element.childNodes) {
        if (child.nodeType === Node.TEXT_NODE) {
          children.push(child.textContent);
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          children.push(convertToVirtualNode(child));
        }
      }
  
      return {
        type,
        props: {
          ...props,
          children,
        },
      };
    };
  
    return convertToVirtualNode(domElement);
  }
  
  function insert(callback){
    callback()
  }
  
  const RJ = {
    Component: RJComponent,
    createElement,
    render,
    rj,
  };
  
  export default RJ;
  