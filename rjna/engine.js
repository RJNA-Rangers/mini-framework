class RJComponent {
    constructor(props) {
      this.props = props;
    }
  }
  
  function createElement(type, props = {}, ...children) {
    return {
      type,
      props: { ...props, children },
    };
  }
  
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
  
    for (const child of element.props.children) {
      render(child, domElement);
    }
  
    container.appendChild(domElement);
  }
  
  const RJ = {
    Component: RJComponent,
    createElement,
    render,
  };
  
  export default RJ;
  