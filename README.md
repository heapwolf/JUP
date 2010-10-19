
![Alt text](http://29.media.tumblr.com/tumblr_l2xo55ndbA1qbo0zio1_r1_400.png)

** JUP Style JSON is now a STANDARD. **

The spec can be found at http://jsonml.org/ which is managed by Stephen

** JUP: Javascript IN, markup OUT. **

JUP processes a format now called jsonML which attempts to be the most concise mapping of JSON to MARKUP.
The purpose of this is to promote the Separation of Concerns principle, and keep markup out of javascript. 
JUP generates markup elements which are declared using nested arrays, for instance:

    ["div", { "class": "foo" }, "some text", ["br"]]

Args can come in any order as long as the first is a tag name. Any arbitrary string can become an element, no registering templates you can simply assign the jup-array to a variable and reuse it. If an object literal is provided in your jup-array, it's directly mapped to attributes of the element. Also, since all values in the JUP structure are strings, they can be stubbed out with mustache style {{tokens}}, they'll get filled in each time you use your jup-array, for instance: 

    ["{{tag}}", { "class": "foo" }, "some {{value}}", ["br"]]

This allows jup-arrays be data driven. No special keys or cryptic symbols like "cls" for class. Works great for SSJS and CSJS. JUP weighs in currently with most functionality done at about less than 100 lines of code, its really simple.

    ["div"] // Renders: <div></div>

    ["div", { "class": "foo" }] // Renders: <div class="foo"></div>

    ["div", { "class": "foo" }, "content"] // Renders: <div class="foo">content</div>

    ["div", { "class": "{{someclass}}" }, ["div"], "content"] // Renders: <div class="foo"><div></div>content</div>

    ["{{namespace}}:{{tag}}", { "{{somekey}}": "foo" }, "content", ["div"]] // Renders: <ns:tag bar="foo">content<div></div></div>

** Exiting the dark ages of templating. **

Remember "Classic ASP" or "Java Beans"? they never really understood the concept of the DOM. They chose to ignore it and just stub in some placeholders like <%=myVariable%> for server generated content then just rewrite the file.

These days, not much has changed, there are lots of templating engines. I think choosing a templating engine with JS these days is like choosing between a fast car and a fast car. IMHO, the most important thing to look at is the concept, not the performance. Sure you could go to JSPerf and test how many milliseconds of difference there is between their compile times. But with the advancements of JS implementations, compile time is becoming irrelevant. Also, if it takes too long to compile, there is probably too much templating happening and not enough semantic HTML, too much logic, maybe even some over-abstraction. We need to think less about ~milliseconds and more about the big picture.

Enter the "Separation Of Concerns" principal. As soon as you take something thats non-standard like ${x} or <%=x%> and put it in the markup, you have mixed metaphors, you've muddied the water.

It doesn't matter what rock-star developer created it or how optimized it is, if it's sprinkled into the markup, its going to become problematic. Try handing your new brand of markup back to the potentially confused designer and say, "re-hash this with your whiz-bang-brand-x-awesome-IDE and get it back to me by noon". Most likely your if-else logic and variables are hosed. The idea is that presentation and logic live separately and safely. 

Enter Node.JS and server side JavaScript. One of my favorite projects to use with node has to be JSDOM. With a few simple lines of javascript and a single require, I can use jQuery to manipulate an HTML file on the server side before it gets served up! Since I can access #myDiv with out needing a ${placeholder} then I don't ever need to trash the markup.

