import { createNode, text } from "./engine.js"

const zip = (a, b) => {
    const zipped = []
    for (let i = 0; i < Math.min(a.length, b.length); i++) {
        zipped.push([a[i], b[i]])
    }
    return zipped
}


const diffAttrs = (oldAttrs, newAttrs) => {
    const patches = []
    // set new attributes
    for (const [k, v] of Object.entries(newAttrs)) {
        patches.push(node => {
            node.setAttribute(k, v)
            return node
        })
    }
    // remove new atrributes
    for (const [k] of Object.entries(oldAttrs)) {
        if (!(k in newAttrs)) {
            patches.push(node => {
                node.removeAttribute(k)
                return node
            })
        }
    }
    return node => {
        for (const patch of patches) {
            patch(node)
        }
    }
}

const diffChildren = (oldVChildren, newVChildren) => {
    const childPatches = []
    for (const [oldVChild, newVChild] of zip(oldVChildren, newVChildren)) {
        if (typeof oldVChild === "string" && typeof newVChild === "string") {
            if (oldVChild !== newVChild) {
                childPatches.push((node) => {
                    node.parentNode.replaceChild(text(newVChild), node);
                    return node;
                });
            }
        } else {
            childPatches.push(diff(oldVChild, newVChild));
        }
    }
    const additionalPatches = []
    for (const addVChild of newVChildren.splice(oldVChildren.length)) {
        if (typeof addVChild == "string") {
            node.textContent = v
            return node
        }
        additionalPatches.push(node => {
            node.appendChild(createNode(addVChild))
            return node
        })

    }

    const removalPatches = [];
    for (const removeVChild of oldVChildren.slice(newVChildren.length)) {
        removalPatches.push(node => {
            node.removeChild(node.lastChild);
            return node;
        });
    }
    

    return parent => {
        for (const [patch, child] of zip(childPatches, parent.childNodes)) {
            patch(child)
        }
        for (const patch of additionalPatches) {
            patch(parent)
        }

        for (const patch of removalPatches) {
            patch(parent)
        }
       
        return parent
    }
}

const diff = (oldVD, newVD) => {
    if (newVD === undefined) {
        return node => {
            node.remove()
            return undefined
        }
    }


    if (typeof oldVD === "string" ||
        typeof newVD === "string") {
        if (oldVD === newVD) {
            return node => {
                const newNode = createNode(newVD)
                node.replaceWith()
                return newNode
            }
        } else {
            return node => undefined
        }
    }

    if (oldVD.tag !== newVD.tag) {
        return node => {
            const newNode = createNode(newVD)
            node.replaceWith()
            return newNode
        }
    }

    const patchAttrs = diffAttrs(oldVD.attrs, newVD.attrs);
    const patchChildren = diffChildren(oldVD.children, newVD.children);

    return node => {
        patchAttrs(node);
        patchChildren(node)
        return node
    }
}

export default diff