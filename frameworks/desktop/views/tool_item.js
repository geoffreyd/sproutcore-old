// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2009 Sprout Systems, Inc. and contributors.
//            Portions ©2008-2009 Apple, Inc. All rights reserved.
// License:   Licened under MIT license (see license.js)
// ==========================================================================

/** @class

  ToolItem can be used as items in a SC.ToolbarView.
  
  SC.ToolItem.design({
    icon: 'add_new', // the URL or classname of an icon. (see SC.ButtonView)
    target: 'App.itemController',
    action: 'addItem',
    title: "New"
  })

  @extends SC.ButtonView
*/
SC.ToolItemView = SC.ButtonView.extend(
/** @scope SC.ToolItemView.prototype */ {
  
  classNames: ['sc-toolitem-view'],
  useStaticLayout: YES,
  
  width: 'auto',
  hight: 'auto',
  
  theme: 'vertical-icon-text',
  
  
  /** @private */
  init: function() {
    // Apply hight and width
    this.layout = {height: this.get('height'), width: this.get('width')} ;
    
    sc_super(); 
  }

});
