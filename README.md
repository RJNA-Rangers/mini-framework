# mini-framework


## Overview RJNA
obj orientated
once you have html stuff, store in a big obj

## Function: RJNA.tag[HTMLElement]()

```javascript
RJNA.tag[HTMLElement](attributes = {}, eventHandlers = {}, properties = {}, ...children)
returns {
        tag: HTMLElement,
        attrs: { ...attributes },
        property: { ...eventHandlers, ...properties },
        children,
    }
```

The RJNA.tag[HTMLElement] function is used to create a Virtual DOM (VDOM) representation of an HTML element.

## Syntax
```javascript
RJNA.tag[HTMLElement](attributes = {}, eventHandlers = {}, properties = {}, ...children)
```
or
```javascript
RJNA.tag.HTMLElement(attributes = {}, eventHandlers = {}, properties = {}, ...children)
```
where HTMLELement is the HTML tag the intended user desires.
Where states are involved, please refer to the example with states.

## Parameters
- attributes (optional): An object representing the attributes of the HTML element. The keys represent the attribute names, and the values represent the attribute values.
- eventHandlers (optional): An object representing the event handlers attached to the HTML element. The keys represent the event names, and the values represent the event handler functions.
- properties (optional): An object representing the properties of the HTML element. The keys represent the property names, and the values represent the property values.
- ...children (optional): Zero or more child elements of the HTML element.

## Return Value
The function returns an object representing the Virtual DOM (VDOM) for the specified HTML element.

tag: The HTML element represented by the Virtual DOM.
attrs: An object containing the attributes of the HTML element.
property: An object containing the event handlers and properties of the HTML element.
children: An array containing the child elements of the HTML element.

### Example without State:
```javascript
const vdom = RJNA.tag.div({ class: 'container' }, {}, {}, RJNA.tag.h1({}, {}, {}, 'Hello, World!'));

console.log(vdom);
```
```css
{
    tag: 'div',
    attrs: { class: 'container' },
    property: {},
    children: [
        {
            tag: 'h1',
            attrs: {},
            property: {},
            children: ['Hello, World!']
        }
    ]
}

```

### Example with State:
```javascript
const count=1
const vdom = (args)=> RJNA.tag.div({ class: `${args}` }, {}, {}, RJNA.tag.h1({class: args.length ?'empty':'full' }, {}, {}, 'Hello, World!'));
console.log(vdom(count));
```
```css
{
    tag: 'div',
    attrs: { class: '1' },
    property: {},
    children: [
        {
            tag: 'h1',
            attrs: {class:'full'},
            property: {},
            children: ['Hello, World!']
        }
    ]
}

```

## Function: RJNA.CreateNode()
``` javascript
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
```
The RJNA.createNode() function is used to create a real DOM node based on a Virtual DOM (VDOM) object returned by RJNA.tag.

### Syntax
```javascript
RJNA.createNode(obj)
```

### Parameters
- obj: The Virtual DOM (VDOM) object representing an HTML element. The object should have the following properties:
    - tag: The HTML element tag name.
    - attrs (optional): An object representing the attributes of the HTML element.
    - property (optional): An object representing the properties of the HTML element.
    - children (optional): An array of child elements or strings representing text content.

### Return Value
The function returns a real DOM node created based on the provided VDOM object.

### Example:
```javascript
const vdom = RJNA.createNode({ class: 'container' }, {}, {}, RJNA.tag.h1({}, {}, {}, 'Hello, World!'));
console.log(vdom);
```
```php
<div class="container">
    <h1>Hello, World!</h1>
</div>
```

## Function: RJNA.getObjByAttrsAndPropVal()
```javascript
function getObjByAttrsAndPropsVal(obj, value) {
    const result = [];
    function searchInObject(obj, parent) {
        for (const prop in obj) {
            const currentValue = obj[prop];
            if (typeof currentValue === 'object') {
                searchInObject(currentValue, obj, prop);
            } else if (currentValue === value) {
                if (prop != "tag")
                    result.push(parent);
            }
        }
    }
    searchInObject(obj, null, null);
    return [result, JSON.parse(JSON.stringify(result))];
}
```
The getObjByAttrsAndPropsVal() function is used to search for objects within a nested object structure that contain a specific value in their attributes or properties.

### Syntax
```javascript
getObjByAttrsAndPropsVal(obj, value)
```

### Parameters
- obj: The object to search within should follow the format returned by RJNA.tag or have a similar structure.
- value: The value to search for within the attributes or properties of the objects.

### Returned Value
- The first element is an array (result) that contains the objects that have the specified value in their attributes or properties.
- The second element is a deep copy of the result array.
!! THis will be important for RJNA.replaceParentNode()

### Example:
```javascript
const vdom = {
    tag: 'div',
    attrs: { class: 'container' },
    property: {},
    children: [
        {
            tag: 'h1',
            attrs: {},
            property: {},
            children: ['Hello, World!']
        },
        {
            tag: 'p',
            attrs: { id: 'paragraph' },
            property: {},
            children: ['Lorem ipsum']
        }
    ]
};

const [result, deepCopy] = getObjByAttrsAndPropsVal(vdom, 'container');
console.log(result);
console.log(deepCopy);
```
```yaml
[
    {
        tag: 'div',
        attrs: { class: 'container' },
        property: {},
        children: [
            {
                tag: 'h1',
                attrs: {},
                property: {},
                children: ['Hello, World!']
            },
            {
                tag: 'p',
                attrs: { id: 'paragraph' },
                property: {},
                children: ['Lorem ipsum']
            }
        ]
    }
]
[
     {
        tag: 'div',
        attrs: { class: 'container' },
        property: {},
        children: [
            {
                tag: 'h1',
                attrs: {},
                property: {},
                children: ['Hello, World!']
            },
            {
                tag: 'p',
                attrs: { id: 'paragraph' },
                property: {},
                children: ['Lorem ipsum']
            }
        ]
    }
]
```


## RJNA.getObjByTag()
```javascript
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
```
The getObjByTag function is used to search for objects within a nested object structure that contain a specific value in their tag.

### Syntax
```javascript
getObjByTag(obj, value)
```

### Parameters
- obj: The object to search within should follow the format returned by RJNA.tag or have a similar structure.
- value: The value to search for within the tag of the objects.

### Returned Value
- The first element is an array (result) that contains the objects that have the specified value in their tag.
- The second element is a deep copy of the result array.
!! THis will be important for RJNA.replaceParentNode()

### Example:
```javascript
const vdom = {
    tag: 'div',
    attrs: { class: 'container' },
    property: {},
    children: [
        {
            tag: 'h1',
            attrs: {},
            property: {},
            children: ['Hello, World!']
        },
        {
            tag: 'p',
            attrs: { id: 'paragraph' },
            property: {},
            children: ['Lorem ipsum']
        }
    ]
};

const [result, deepCopy] = getObjByTag(vdom, 'p');
console.log(result);
console.log(deepCopy);
```
```yaml
[
    {
        tag: 'p',
        attrs: { id: 'paragraph' },
        property: {},
        children: ['Lorem ipsum']
    }
]
[
    {
        tag: 'p',
        attrs: { id: 'paragraph' },
        property: {},
        children: ['Lorem ipsum']
    }
]
```

## RJNA.replaceParentNode

## RJNA.update


## Authors:
- Remi
- Jason
- Nik
- Abdul Raheem Khan