# mini-framework


## Overview RJNA

RJNA is a mini-framework that provides a set of functions for creating and manipulating a Virtual DOM (VDOM) representation of an HTML structure. The framework emphasizes the use of an object named orbital, which must have the keys obj and rootEl.

The obj key stores the nested object representing the HTML structure, while the rootEl key holds the corresponding real DOM node created from the VDOM. These keys are essential for maintaining the connection between the VDOM and the real DOM.

Orbital also serves as a global variable that not only stores and manages state changes but also acts as a central hub for coordinating and updating the application's user interface, resulting in a smooth and responsive application experience.

## Orbital Structure
To use RJNA, the orbital object must be structured as follows:
```javascript
let orbital = {
    customKey:customValue
    rootEl:undefined,
    obj:undefined
}
```

The obj and rootEl key should initially be set to undefined.

## Function: RJNA.tag[HTMLElement]()

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

## Function: RJNA.replaceParentNode
The replaceParentNode() function is used to replace a specific node within a nested object structure (following the format returned by RJNA.tag) with a modified node and apply those changes to the real DOM.

### Syntax
```javascript
replaceParentNode(obj, node, modifiedNode)
```

### Parameters
- obj: The original nested object representing the HTML structure.
- node: The node within the obj that needs to be replaced.
- modifiedNode: The modified node that will replace the node.

### Example:
```javascript
const obj = {
    tag: 'div',
    children: [
        {
            tag: 'h1',
            children: ['Hello, World!']
        },
        {
            tag: 'p',
            children: ['Lorem ipsum dolor sit amet']
        }
    ]
};
console.log(obj)
console.log(orbital.rootEl)
orbital.rootEl=RJNA.createNode(obj)
const [oldNode, newNode] = RJNA.getObjByTag("p");
newNode.children[0]="Modified content"

replaceParentNode(obj, oldNode, newNode);
console.log(orbital.rootEl)
console.log(obj);
```
Before:
```javascript
{
    tag: 'div',
    children: [
        {
            tag: 'h1',
            children: ['Hello, World!']
        },
        {
            tag: 'p',
            children: ['Lorem ipsum dolor sit amet']
        }
    ]
}
```
```php
<div class="container">
    <h1>Hello, World!</h1>
    <p>Lorem ipsum dolor sit amet</p>
</div>
```
After:
```javascript
{
    tag: 'div',
    children: [
        {
            tag: 'h1',
            children: ['Hello, World!']
        },
        {
            tag: 'p',
            children: ['Modified content']
        }
    ]
}
```
```php
<div class="container">
    <h1>Hello, World!</h1>
    <p>Modified Content</p>
</div>
```

## Function: RJNA.update(obj)
The update() function is used to update the current VDOM with modified VDOM when there is a change in state and apply those changes to the real DOM.

### Syntax
```javascript
update(obj)
```

### Parameters
- obj: The modified nested object representing the HTML structure.

### Example:
```javascript
let count=1
const obj =(count)=> {
    tag: 'div',
    children: [
        {
            tag: 'h1',
            children: `${count}`
        },
        {
            tag: 'p',
            children: 'Lorem ipsum dolor sit amet'
        }
    ]
};
orbital.obj=obj(count)
orbital.rootEl=RJNA.createNode(obj(count))
console.log(oribtal.obj);
count++
RJNA.update(obj(count))
console.log(orbital.obj)
```
Before:
```javascript
{
    tag: 'div',
    children: [
        {
            tag: 'h1',
            children: "1"
        },
        {
            tag: 'p',
            children: 'Lorem ipsum dolor sit amet'
        }
    ]
}
```
```php
<div class="container">
    <h1>1</h1>
    <p>Lorem ipsum dolor sit amet</p>
</div>
```
After:
```javascript
{
    tag: 'div',
    children: [
        {
            tag: 'h1',
            children: "2"
        },
        {
            tag: 'p',
            children: 'Lorem ipsum dolor sit amet'
        }
    ]
}
```
```php
<div class="container">
    <h1>2</h1>
    <p>Modified Content</p>
</div>
```


## Authors:
- Remi
- Jason
- Nik
- Abdul Raheem Khan