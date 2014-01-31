# svg.draggable.js

A plugin for the [svgjs.com](http://svgjs.com) library to make th elements draggable/droppable.

Svg.draggable.js is licensed under the terms of the MIT License.

## Usage
Include this plugin after including the svg.js library in your html document.

To make an element draggable

```javascript
var draw = SVG('canvas').size(400, 400)
var rect = draw.rect(100, 100)

rect.draggable()
```

Yes indeed, that's it! Now the `rect` is draggable.

To make an element dropable

```javascript
var draw = SVG('canvas').size(400, 400)
var rect = draw.rect(100, 100)

rect.draggable().dropable()
```

Now the `rect` is draggable and dropable.

To make an element a drop target

```javascript
var draw = SVG('canvas').size(400, 400)
var rect = draw.rect(100, 100)
var bigrect = draw.rect(200, 200).move(200,200)

rect.droptarget()
```

Now the `bigrect` is a drop target.


## Callbacks
There are eight different callbacks available, `beforedrag`, `dragstart`, `dragmove`, `dragend`, `dragover`, `dragenter`, `dragleave` and `drop`. 

Four of the callbacks, `beforedrag`, `dragstart`, `dragmove` and `dragend` are available on the draggable element. This is how you assign them:

```javascript
rect.dragstart = function() {
  ...do your thing...
}
```

The `beforedrag` callback will pass the event in the first argument:

```javascript
rect.beforestart = function(event) {
  ...do your thing...
}
```

The `dragstart` callback will pass the delta values as an object in the first argument and the event as the second:

```javascript
rect.dragstart = function(delta, event) {
  console.log(delta.x, delta.y)
}
```

The `dragmove` and `dragend` callbacks will pass the delta values as an object in the first argument, the event as the second and the target element as the third. The target element is a drop target element that is under the element being dragged:

```javascript
rect.dragmove = function(delta, event, target) {
  console.log(delta.x, delta.y)
}
```


The other four callbacks, `dragover`, `dragenter`, `dragleave` and `drop`, are invoked on the droptarget elements. Two parameters are passed to the callbacks - the event and the element being dragged. Dropable elements generate these callbacks when dragged over a droptarget element.

```javascript
rect.dragenter = function(event, element) {
  ...do your thing...
}
```


## Constraint
The drag functionality can be limited within a given box. You can pass the the constraint values as an object:

```javascript
rect.draggable({
  minX: 10
, minY: 15
, maxX: 200
, maxY: 100
})
```


## Remove
The draggable functionality can be removed with the `fixed()` method:

```javascript
rect.fixed()
```


## Viewbox
This plugin is viewBox aware but there is only one thing that you need to keep in mind. If you work with a viewBox on the parent element you need to set the width and height attributes to have the same aspect ratio. So let's say you are using `viewbox='0 0 150 100'` you have to make sure the aspect ratio of `width` and `height` is the same:

```javascript
var draw = SVG('paper').attr('viewBox', '0 0 150 100').size(600, 400)
```


## Dependencies
This module requires svg.js v0.11.
