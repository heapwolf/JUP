
![Alt text](https://github.com/hij1nx/JUP/raw/master/JUP.png)

## What
Large strings of markup inside your javascript look like **shit**. JUP is a fast JSON to Markupup Language engine that fixes this problem.

## How

```javascript
    ["div", { "class": "foo" }, "some text", ["br"]]
```

JUP is simple, you provide an array. Arrays can be nested. The first arg is a string which is the tag name of the element to get rendered. An array can contain an object literal, this will represent the attributes of the element to get rendered. You can also add content, content should be of type string.

## Examples

```javascript
    var html = JUP.html([
      ["div",
        ["span", { "class": "heading" }, "fooooooo"],
        ["br"],
        ["span", { "class": "heading" }, "fooooooo"],
        ["br"],
        ["span"]
      ],
      ["br"]
    ]);
```

Using one of the data structures described is easy, pass it to the `html` method of JUP and it will render out the html.

```javascript
    var data1 = [
      {
        name: "hij1nx",
        url: "github.com/hij1nx",
        cities: [
          "New York, NY",
          "San Francisco, CA"
        ]
      },
      {
        name: "Marak Squires",
        url: "github.com/marak",
        cities: [
          "Brooklyn, NY",
          "New York, NY"
        ]
      }
    ];

    var html3 = JUP.html(data1,
      ["div", { "{{name}}": "{{name}}" },
        JUP.html(data1, ["span", "{{name}}", ["br"]])
      ]
    );
```

JUP implements a mustache-like supplant feature. `{{tokens}}` get filled in each time you use a structure. This makes merging data into a structure is easy, just make it the first parameter of the html function. No special keys or cryptic symbols like "cls" for class. Here are some more examples.

```javascript
    ["div"] // Renders: <div></div>

    ["div", { "class": "foo" }] // Renders: <div class="foo"></div>

    ["div", { "class": "foo" }, "content"] // Renders: <div class="foo">content</div>

    ["div", { "class": "{{someclass}}" }, ["div"], "content"] // Renders: <div class="foo"><div></div>content</div>

    ["{{namespace}}:{{tag}}", { "{{somekey}}": "foo" }, "content", ["div"]] // Renders: <ns:tag bar="foo">content<div></div></div>
```
