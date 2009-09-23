// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2009 Sprout Systems, Inc. and contributors.
//            portions copyright @2009 Apple Inc.
// License:   Licened under MIT license (see license.js)
// ==========================================================================

/*global module test htmlbody ok equals same stop start */

var pane, view , view1, view2, view3 ;

module("SC.DropDownMenu",{

  //setup
  setup: function() {
    SC.RunLoop.begin();
    var isDue = NO ;

    //pane
    pane = SC.MainPane.create({
      objs : ["Around","The","World"],
      selectedValue: "World",
      isDue: YES,
      childViews: [

        //view1
        SC.DropDownMenu.extend({
          objects: ["To","Back", "You"],
          disableSort: NO
        }),

        //view2
        SC.DropDownMenu.extend({
          objects: ["Drop","Down", "Menu"]
        }),

        //view3
        SC.DropDownMenu.extend({
          objectsBinding: '*owner.objs',
          valueBinding: '*owner.selectedValue',
          isVisibleBinding: '*owner.isDue'
        }),

        //view4
        SC.DropDownMenu.extend({
          objectsBinding: '*owner.objs',
          valueBinding: '*owner.selectedValue',
          valueKey: 'title',
          nameKey: 'title',
          sortKey: 'pos'
        })
      ]
    });

    view1 = pane.childViews[0] ;
    view2 = pane.childViews[1] ;
    view3 = pane.childViews[2] ;
    view4 = pane.childViews[3] ;

    pane.append(); // make sure there is a layer...
    SC.RunLoop.end();
  },

  //teardown
  teardown: function() {
    pane.remove() ;
    pane = view = null ;
  }
});

//test1
test("Check if objectBinding works", function() {
  var obj = view3.objects ;
  equals('Around',obj.get(0),'First item should be') ;
  equals('The',obj.get(1),'Second item should be') ;
  equals('World',obj.get(2),'Last item should be') ;
});

//test2
test("Check if valueBinding works", function() {
  equals('World',view4.get('value'),'Value should be') ;
});

//test3
test("Check if isVisibleBinding works", function() {
  var isDue = pane.isDue ;
  SC.RunLoop.begin() ;
  pane.set('isDue', NO) ;
  SC.RunLoop.end() ;
  ok(!view3.get('isVisibleInWindow'), 'view2.isVisibleInWindow should be NO') ;
});

//test4
test("DropDownMenu with objects", function() {
  equals(3,view1.objects.length,'The number of options in dropDown Menu should be') ;
  equals(null,view1.nameKey,'the dropDownMenu should not have any name key') ;
  equals(null,view1.valueKey,'the dropDownMenu should not have any value key') ;
});

//test5
test("sortObjects() sorts the items of the Drop Down component", function() {
  var obj = view1.objects;
  view1.objects = view1.sortObjects(obj);

  equals("Back",obj.get(0),'First item should be') ;
  equals("To",obj.get(1),'Second item should be') ;
  equals("You",obj.get(2),'Third item should be') ;
});

//test6
test("rebuildMenu() populates the Drop Down Menu with new data", function() {
  var newObj = ['Rebuild', 'Drop', 'Down', 'Menu'] ;
  view2.objects = newObj;
  var obj = view2.objects;
  equals('Rebuild',obj.get(0),'First item should be') ;
  equals('Drop',obj.get(1),'Second item should be') ;
  equals('Down',obj.get(2),'Third item should be') ;
  equals('Menu',obj.get(3),'Fourth item should be') ;
});

//test7
test("isEnabled=NO should add disabled class", function() {
  SC.RunLoop.begin() ;
    view1.set('isEnabled', NO) ;
  SC.RunLoop.end() ;
  ok(view1.$().hasClass('disabled'), 'should have disabled class') ;
});

//test8
test("objects should change on changing the binding", function() {
  SC.RunLoop.begin();
    var newObjects = ['Bound','Objects'] ;
    pane.set('objs', newObjects) ;
  SC.RunLoop.end() ;

  var objects = view3.objects ;
  newObjects = pane.objs ;
  ok(objects===newObjects, 'Objects should be bound') ;
});

//test9
test("Check if setting a value actually changes the selection value", function() {
  SC.RunLoop.begin() ;
    view2.set('value','Menu') ;
  SC.RunLoop.end() ;

  equals(view2.get('value'), 'Menu', 'value of Drop down should change to') ;
}) ;

//test10
test("objects should change on changing the binding", function() {
  SC.RunLoop.begin() ;
    var newObjects = ['Bound','Objects'] ;
    pane.set('objs', newObjects) ;
  SC.RunLoop.end() ;

  var objects = view3.objects ;
  newObjects = pane.objs ;
  ok(objects===newObjects, 'Objects should be bound') ;
});

