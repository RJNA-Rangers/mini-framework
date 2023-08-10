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

## Custom Methods 
Custom Methods

The created element object has the following custom methods available for manipulating the element:

- setTag(newTag): Changes the tag name of the element. It accepts a new tag name as a parameter and replaces the current tag name of the element. Returns the modified element object.
    
- setAttr(key, val): Adds or changes an attribute of the element. It accepts the attribute key and value as parameters and updates the corresponding attribute of the element. If the attribute already exists, the new value is appended to the existing value. Returns the modified element object.
    
- removeAttr(key, val, replaceVal): Removes an attribute from the element. It accepts the attribute key as a parameter and removes the attribute from the element. If the optional val parameter is provided, it replaces the specified value within the attribute with the replaceVal. Returns the modified element object.
   
- setProp(key, val): Adds or changes a property of the element. It accepts the property key and value as parameters and updates the corresponding property of the element. Returns the modified element object.

- removeProp(key, val): Removes or changes a property of the element. It accepts the property key as a parameter and removes the property from the element. If the optional val parameter is provided, it replaces the specified value within the property. Returns the modified element object.
    
- setChild(...obj): Adds one or more child elements or text nodes to the element. It accepts multiple parameters, which are treated as separate child nodes appended to the element. Returns the modified element object.

- removeChildren(index, deleteCount): Removes a range of children from the element. It accepts the starting index and the number of children to be removed. Returns the modified element object.

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
let count=1
const vdom = (args)=> RJNA.tag.div({ class: `${args}` }, {}, {}, RJNA.tag.h1({class: args.length ?'empty':'full' }, {}, {}, 'Hello, World!'));
console.log(vdom(count));
count++
vdom(count)
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

{
    tag: 'div',
    attrs: { class: '2' },
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
### Example with custom methods: 
```javascript
const vdom = (args)=> {
    let div = RJNA.tag.div({ class: `${args}` }, {}, {}, RJNA.tag.h1({class: args.length ?'empty':'full' }, {}, {}, 'Hello, World!'))
    console.log(div);
    div.setAttr("class", "main-div")
    div.setProp("onclick", (evt)=>{console.log('div clicked.')})
    div.setChild(RJNA.tag.h1({},{},{},"I am the child of the div!"))
    console.log(div);
    div.removeChildren(div.children.length-1, 1);
    div.removeAttr("class", "1 main-div", "main-div");
    console.log(div);
    div.removeProp("onclick", "");
}
```
```css
{
    tag: 'div',
    attrs: { class: 'full' },
    property: {},
    children: ['Hello, World!']
}

{
    tag: 'div',
    attrs: { class: 'full main-div' },
    property: {"onclick": (evt)=>{console.log('div clicked')}},
    children: 
    [
        'Hello, World!', 
        {
            tag: 'h1',
            attrs: {},
            property: {},
            children: ['I am the child of the div!']
        }
    ]
}

{
    tag: 'div',
    attrs: { class: 'full' },
    property:  {"onclick": (evt)=>{console.log('div clicked')}},
    children: ['Hello, World!']
}

{
    tag: 'div',
    attrs: { class: 'full' },
    property:  {"onclick": ""},
    children: ['Hello, World!']
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

The getObjByAttrsAndPropsVal function is a recursive utility function that searches for objects within a given object hierarchy based on attribute and property values. It traverses through the object's properties and their nested objects to find matches. This function is useful for querying and retrieving specific objects based on their attribute or property values.

### Syntax
```javascript
getObjByAttrsAndPropsVal(obj, value)
```

### Parameters
- obj: The object to search within should follow the format returned by RJNA.tag or have a similar structure.
- value: The value to search for within the attributes or properties of the objects.

### Returned Value
- If the array has only one element, then it returns the object that matches the search criteria. Otherwise, it returns an array of objects that match the search criteria. Each object represents a match found in the provided obj. If no matches are found, an empty array is returned.

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
const result = getObjByAttrsAndPropsVal(vdom, 'paragraph');
console.log(result);
```
```yaml
    {
        {
            tag: 'p',
            attrs: { id: 'paragraph' },
            property: {},
            children: ['Lorem ipsum']
        }
    }
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

const [result] = getObjByTag(vdom, 'p');
console.log(result);
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
- Abdul Raheem Khan
