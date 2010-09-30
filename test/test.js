var vows = require('vows'),
    assert = require('assert');

var sys = require('sys');

var jup = require('../lib/jup').JUP;

vows.describe('jup.js').addBatch({
  "JUP.data()": {
    "Converting strings to the correct format for templating": {
         topic: jup.data("name"),
        "createsthe correct format":function( topic ){
          if( topic == "{{name}}"){
            assert.ok( true );
          }
          else{
            assert.ok( false, topic + " is not formated properly");
          }
        }
      }
  },
  "JUP.html()": {
    "Simple Tags": {
       topic: jup,
      "creates a tag when presented with it's string representation":function( topic ){
        if( topic.html(["p"]) == "<p></p>"){
          assert.ok( true );
        }
        else{
          assert.ok( false, topic + " is not the correct tag");
        }
      },
       "creates a closed br tag when presented with it's string representation":function( topic ){
          if( topic.html(["br"]) == "<br/>"){
            assert.ok( true );
          }
          else{
            assert.ok( false, topic + " is not the correct tag");
          }
        }
    },
    "Simple Tag with data": {
       topic: jup,
      "creates a tag with content when presented with it's string representation and data":function( topic ){
        if( topic.html(["p", 'text']) == "<p>text</p>"){
          assert.ok( true );
        }
        else{
          assert.ok( false, topic + " is not the correct tag");
        }
      },
      "creates a tag with a class":function( topic ){
        result = topic.html(["p", {'class': 'klass'}, 'text']);
        if( result == '<p class="klass">text</p>'){
          assert.ok( true );
        }
        else{
          assert.ok( false, result + " is not the correct tag");
        }
      },
      "creates a tag with a data attribute":function( topic ){
        result = topic.html(["p", {'data-poster': 'poster'}, 'text']);
        if( result == '<p data-poster="poster">text</p>'){
          assert.ok( true );
        }
        else{
          assert.ok( false, result + " is not the correct tag");
        }
      }
    },
    "Complex Tags with data": {
       topic: jup,
      "creates a nested div object":function( topic ){
        result = topic.html(
          [
            ["div",
              ["span", { "class": "heading" }, "fooooooo"],
              ["br"],
              ["span", { "class": "heading" }, "fooooooo"],
              ["br"],
              ["span"]
            ],
            ["br"]
          ]);
        if( result == '<div><span class="heading">fooooooo</span><br/><span class="heading">fooooooo</span><br/><span></span></div><br/>'){
          assert.ok( true );
        }
        else{
          assert.ok( false, result + " is not the correct tag");
        }
      },
      "creates a nested div object from both string and an embeded javascript function":function( topic ){
        result = topic.html(
          [
          	["div", "a div"],
  					["div", "another div"],
  					["div", { "class": "normal" }, "div with attributes"],
  					["div", 
  						["div", "a nested div"]
  					],
  					["div", "some content ",
  						["a", { "href": "#" }, "with a link"]
  					],

  					(function() {

  						var tags = [];
  						for(var i=1; i < 11; i++) {
  							tags.push(["span", "test #" + i + " "]);
  						}
  						return tags;

  					})(),

  					["br", { "class": "tall" }]
  				]
         );
        if( result == '<div>a div</div><div>another div</div><div class="normal">div with attributes</div><div><div>a nested div</div></div><div>some content <a href="#">with a link</a></div><span>test #1 </span><span>test #2 </span><span>test #3 </span><span>test #4 </span><span>test #5 </span><span>test #6 </span><span>test #7 </span><span>test #8 </span><span>test #9 </span><span>test #10 </span><br class="tall"></br>'){
          assert.ok( true );
        }
        else{
          assert.ok( false, result + " is not the correct tag");
        }
      }
    },
    "Using data objects in JUP.html": {
       topic: [
                [
       				    {
           					name: "Fern Micro",
           					url: "github.com/fernmicro",
           					cities: [
           						"New Orleans, LA",
           						"San Francisco, CA"
           					]
           				},
           				{
           					name: "Bucky Felini",
           					url: "github.com/bucky",
           					cities: [
           						"Philly, PA",
           						"NYC, NY"
           					]
           				}
       			    ],
           			[
           			  ["div", { "class": "record" },
          					["span", { "class": "heading" }, jup.data("name")],
          					["br"],
          					["span", { "class": "website" }, "http://{{url}}"],
          					["br"],
          					["span"]
          				],
          				["br"]
          			]
           		],
       "creates a nested html using the passed in data in the format data, html-JSON":function( topic ){
         result = jup.html(topic[0], topic[1]);
         if( result == '<div class="record"><span class="heading">Fern Micro</span><br/><span class="website">http://github.com/fernmicro</span><br/><span></span></div><br/><div class="record"><span class="heading">Bucky Felini</span><br/><span class="website">http://github.com/bucky</span><br/><span></span></div><br/>'){
           assert.ok( true );
         }
         else{
           assert.ok( false, result + " is not the correct tag");
         }
      },
      "creates a nested html using the passed in data in the format { data: data, structure: JSON-html}":function( topic ){
         result = jup.html({data: topic[0], structure: topic[1]});
         if( result == '<div class="record"><span class="heading">Fern Micro</span><br/><span class="website">http://github.com/fernmicro</span><br/><span></span></div><br/><div class="record"><span class="heading">Bucky Felini</span><br/><span class="website">http://github.com/bucky</span><br/><span></span></div><br/>'){
           assert.ok( true );
         }
         else{
           assert.ok( false, result + " is not the correct tag");
         }
      }
    }
  },
}).run();

