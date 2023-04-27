const section =
{
    "tag":"section",
    "attrs":{
        "class":"todoapp",
    },
    "children":[
        {
            "tag":"header",
            "attrs":{
                "class":"header",
            },
            "children": [
                {
                    "tag": "h1",
                    "attrs":{
                        "textContent":"todos"
                    },

                },
                {
                    "tag":"input",
                    "attrs":{
                        "class": "new-todo",
                        "placeholder":"What needs to be done?",
                        "autofocus":"true",
                    },
                },
            ]
        },
    ]
}

function createNode(obj) {
    const result = document.createElement(obj.tag);
  
    for (const [key, value] of Object.entries(obj.attrs)) {
        if(key=="textContent"){
          result.appendChild(text(value))
        }
      result.setAttribute(key, value);
    }
  
    if (obj.children) {
      for (const child of obj.children) {
        result.appendChild(createNode(child));
      }
    }

    return result;
}

function text(input){
    return document.createTextNode(input)
}

window.onload =()=>{
    console.log(document.body.appendChild(createNode(section)))
}

  