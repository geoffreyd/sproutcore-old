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
  
  updateGhostViewForDrag: function(drag) {
    
  },
  
  createGhostView: function(drag) {
    return null;
  }
  
}