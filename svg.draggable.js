// svg.draggable.js 0.12 - Copyright (c) 2013 Wout Fierens - Licensed under the MIT license

SVG.extend(SVG.Element, {
  // Make element selectable
  selectable: function() {
    this.isselectable = true
    return this  
  },
  // Make element draggable
  draggable: function(constraint) {
    var start, drag, end
      , element = this
      , parent  = this.parent._parent(SVG.Nested) || this._parent(SVG.Doc)
    
    /* remove draggable if already present */
    if (typeof this.fixed == 'function')
      this.fixed()
    
    /* ensure constraint object */
    constraint = constraint || {}

    select = function(event) {
      if (event.button === 2 || event.ctrlKey) 
        return

      if (this.isselectable) {
        if (element.select)
          element.select(event)

        // unselect the currently selected element. how ?
      }
      start(event)
    }
    
    /* start dragging */
    start = function(event) {
      event = event || window.event
      
      var box
      
      if (event.button === 2 || event.ctrlKey) {
        //don't drag with the right mouse button
        return;
      }

      /* invoke any callbacks */
      if (element.beforedrag)
        element.beforedrag(event)
      
      /* get element bounding box */
      box = element.bbox()
      
      if (element instanceof SVG.G) {
        box.x = element.trans.x
        box.y = element.trans.y
        
      } else if (element instanceof SVG.Nested) {
        box = {
          x:      element.x()
        , y:      element.y()
        , width:  element.attr('width')
        , height: element.attr('height')
        }
      }
      
      /* store event */
      element.startEvent = event
      element.lastdroptarget = null
      
      /* store start position */
      element.startPosition = {
        x:        box.x
      , y:        box.y
      , width:    box.width
      , height:   box.height
      , zoom:     parent.viewbox().zoom
      , rotation: element.transform('rotation') * Math.PI / 180
      }
      
      /* add while and end events to window */
      SVG.on(window, 'mousemove', drag)
      SVG.on(window, 'mouseup',   end)
      
      /* invoke any callbacks */
      if (element.dragstart)
        element.dragstart({ x: 0, y: 0, zoom: element.startPosition.zoom }, event)
      
      /* prevent selection dragging */
      event.preventDefault ? event.preventDefault() : event.returnValue = false
      /* prevent dragging the elements under the current one*/
      event.stopPropagation();
    }
    
    /* find the drop target, if any */
    findtarget = function(x, y, element) {
      var targets = [];
      if (element.isdropable) {
        parent.each(function() {
          if (this.isdroptarget) {
            var rbox = this.rbox();
            var bbox = this.bbox();
            if (this !== element && this.inside(x, y ) ) {
              targets.push(this);
            }
          }
        },true)
      }
      return targets.pop();
    }

    /* while dragging */
    drag = function(event) {
      event = event || window.event
      
      if (element.startEvent) {
        /* calculate move position */
        var x, y
          , rotation  = element.startPosition.rotation
          , width     = element.startPosition.width
          , height    = element.startPosition.height
          , delta     = {
              x:    event.pageX - element.startEvent.pageX,
              y:    event.pageY - element.startEvent.pageY,
              zoom: element.startPosition.zoom
            }
          , target
        
        /* calculate new position [with rotation correction] */
        x = element.startPosition.x + (delta.x * Math.cos(rotation) + delta.y * Math.sin(rotation))  / element.startPosition.zoom
        y = element.startPosition.y + (delta.y * Math.cos(rotation) + delta.x * Math.sin(-rotation)) / element.startPosition.zoom
        
        /* recalculate any offset */
        if (element._offset) {
          x -= element._offset.x
          y -= element._offset.y
        }
        
        /* keep element within constrained box */
        if (constraint.minX != null && x < constraint.minX)
          x = constraint.minX
        else if (constraint.maxX != null && x > constraint.maxX - width)
          x = constraint.maxX - width
        
        if (constraint.minY != null && y < constraint.minY)
          y = constraint.minY
        else if (constraint.maxY != null && y > constraint.maxY - height)
          y = constraint.maxY - height
        
        if (0 /*need to fire start drag events*/) {
          // fire start drag events
          // disable need to fire start drag events
        }
        /* move the element to its new position */
        element.move(x, y)

        /* invoke dragover callbacks */
        target = findtarget(event.clientX - parent.parent.offsetLeft, event.clientY - parent.parent.offsetTop, element)

                /* invoke any callbacks */
        if (element.dragmove)
          element.dragmove(delta, event, target)
        
        if (element.lastdroptarget != target) {
          if (element.lastdroptarget && element.lastdroptarget.dragleave)
            element.lastdroptarget.dragleave(event, element);
            
          if (target && target.dragenter)
            target.dragenter(event, element)
            
          element.lastdroptarget = target
        }

        if (target && target.dragover)
          target.dragover(event, element)
      }
    }
    
    /* when dragging ends */
    end = function(event) {
      event = event || window.event
      
      /* calculate move position */
      var delta = {
        x:    event.pageX - element.startEvent.pageX,
        y:    event.pageY - element.startEvent.pageY,
        zoom: element.startPosition.zoom
      }
      
      /* reset store */
      element.startEvent    = null
      element.startPosition = null

      /* remove while and end events to window */
      SVG.off(window, 'mousemove', drag)
      SVG.off(window, 'mouseup',   end)

      if (element.lastdroptarget && element.lastdroptarget.drop) {
        element.lastdroptarget.drop(element);
      }
      
      /* invoke any callbacks */
      if (element.dragend)
        element.dragend(delta, event, element.lastdroptarget)
    }
    
    /* bind mousedown event */
    element.on('mousedown', start)
    
    /* disable draggable */
    element.fixed = function() {
      element.off('mousedown', start)
      
      SVG.off(window, 'mousemove', drag)
      SVG.off(window, 'mouseup',   end)
      
      start = drag = end = null
      
      return element
    }
    
    return this
  },
  // Make the element dropable
  dropable: function() {
    this.isdropable = true
    return this
  },
  // Make the element a drop target
  droptarget: function() {
    this.isdroptarget = true
    return this
  }
})
