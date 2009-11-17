// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2009 Sprout Systems, Inc. and contributors.
//            Portions ©2008-2009 Apple Inc. All rights reserved.
// License:   Licened under MIT license (see license.js)
// ==========================================================================

SC.DragDelegate = {
  /**
    Used to detect the mixin by SC.DragView
  */
  isDragDelegate: YES,
  
  updateGhostViewForDrag(drag) {
    
  },
  
  createGhostView(drag) {
    var that  = drag,
        frame = drag.dragView.get('frame'),
        view;
        
    view = drag.ghostView = SC.Pane.create({
      classNames:['sc-ghost-view'],
      layout: { top: frame.y, left: frame.x, width: frame.width, height: frame.height },
      owner: drag,
      didCreateLayer: function() {
        if (that.dragView) {
          var layer = that.dragView.get('layer') ;
          if (layer) this.get('layer').appendChild(layer.cloneNode(true)) ;
        }
      }
    });
    
    view.append() ;  // add to window
  }
  
}