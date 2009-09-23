// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2009 Sprout Systems, Inc. and contributors.
//            Portions ©2008-2009 Apple Inc. All rights reserved.
// License:   Licened under MIT license (see license.js)
// ==========================================================================

/** @class

  A toolbar view can be anchored at the top or bottom of the window to contain
  your main toolbar buttons.  The default implementation assumes you may have
  a leftView, rightView, and centerView, each with a 'width' property, 
  which will then be properly laid out.
  
  You can also override the layout property yourself or simply set the 
  anchorLocation to SC.ANCHOR_TOP or SC.ANCHOR_BOTTOM.  This will configure
  the layout of your toolbar automatically when it is created.
  
  SC.ToolbarView.design({
    anchorLocation: SC.ANCHOR_BOTTOM,
    
    leftView: SC.View.design({
      width: 250, // This is the only layout you need.
      childViews: "add edit".w(),
      add: SC.ToolItem.design({
        icon: 'add_new',
        target: 'App.itemController',
        action: 'addItem',
        title: "New"
      }),
      edit: SC.ToolItem.design({
        icon: 'edit',
        target: 'App.itemController',
        action: 'editItem',
        title: "Edit"
      })
    }),
    
    centerView: ...,
    rightView: ...,
    
  })

  @extends SC.View
  @since SproutCore 1.0
*/
SC.ToolbarView = SC.View.extend(
  /** @scope SC.ToolbarView.prototype */ {

  classNames: ['sc-toolbar-view'],
  
  /**
    Default anchor location.  This will be applied automatically to the 
    toolbar layout if you set it.
  */
  anchorLocation: null,
  
  /**
    The theme that will be applied to each of the ToolItems
  */
  itemTheme: null,
  
  /**
    The Default Width
  */
  itemMinWidth: null,

  // ..........................................................
  // INTERNAL SUPPORT
  // 
  
  /** @private */
  layout: { left: 0, height: 32, right: 0 },
  
  /** @private */
  init: function() {
    var children = [] ;
    // apply anchor location before setting up the rest of the view.
    if (this.anchorLocation) {
      this.layout = SC.merge(this.layout, this.anchorLocation);
    }
    
    sc_super(); 
    
    var viewLayouts = [
      {name: 'leftView',   layout: {top:0, bottom: 0, left: 0} },
      {name: 'centerView', layout: {top:0, bottom: 0, centerX: 0} },
      {name: 'rightView',  layout: {top:0, bottom: 0, right: 0} }
    ] ;
    console.log(this) ;
    var self = this ;
    // Bonsai.debug['toolbar'] = this ;
    viewLayouts.forEach(function(v) {
      // check to see if this view exists.
      console.log("Adding SubView "+v.name) ;
      var view = self.get(v.name), width ;
      // Bonsai.debug['view'] = view;
      if (view) {
        width = view.prototype.width || 0.3 ;
        view.prototype.layout = SC.merge(v.layout, {width: width}) ;
        children.push( self.createChildView(view) ) ;
      }
    }) ;
    this.set('childViews', children) ;
  }

});

