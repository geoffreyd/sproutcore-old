// ==========================================================================
// SampleControls
// copyright 2008 Sprout Systems, Inc.
// ==========================================================================
/*global TestControls tile Forms */

require("resources/progress_page");
require("resources/buttons_page");
require("resources/checkboxes_page");
require("resources/radio_page");
require("resources/select_page");
require("resources/segmented_page");
require("resources/text_field_page");
require("resources/flow_layout_page");
require("resources/scroll_page");
require("resources/list_page");
require("resources/tab_page");

TestControls.mainPage = SC.Page.create({
  
  mainPane: SC.MainPane.design(SC.Animatable, {
    childViews: "split".w(),
    
    split: SC.MasterDetailView.design ({
      autoHideMaster: YES,
      masterView: SC.WorkspaceView.design({
        topToolbar: SC.ToolbarView.design({
          layout: { top: 0, left: 0, right: 0, height: 32 },
          childViews: "label".w(),
          label: SC.LabelView.design({
            layout: { left: 10, centerY: 0, height: 21, width: 200 },
            value: "Test Controls",
            classNames: "embossed".w()
          })
        }),
        
        contentView: SC.ScrollView.design({
          classNames: ["sc-source-list-background"],
          contentView: SC.SourceListView.design({
            layout: { left: 0, top: 0, right: 0, bottom: 0 },
            contentValueKey: "name",
            contentBinding: "TestControls.categoriesController.arrangedObjects",
            selectionBinding: "TestControls.categoriesController.selection"
          })
        })
      }),
      detailView: SC.WorkspaceView.design({
        topToolbar: SC.ToolbarView.design({
          layout: { top: 0, left: 0, right: 0, height: 32 },
          childViews: "showMaster label".w(),
          showMaster: SC.ButtonView.design({
            layout: { left: 7, centerY: 0, height: 30, width: 100 },
            controlSize: SC.AUTO_CONTROL_SIZE,
            isVisible: NO,
            isVisibleBinding: ".parentView.masterIsHidden",
            title: "Tests",
            action: "toggleMasterPicker"
          }),
          
          label: SC.LabelView.design({
            layout: { left: 120, centerY: 0, height: 21, width: 200 },
            value: "Test Controls",
            classNames: "embossed".w(),
            isVisible: NO,
            isVisibleBinding: SC.Binding.from(".parentView.masterIsHidden")
          })
        }),
        contentView: SC.ContainerView.design({
          nowShowing: "welcome",
          shouldBeShowing: "welcome",
          shouldBeShowingBinding: SC.Binding.notEmpty("TestControls.categoryController.show", "welcome"),
          shouldBeShowingDidChange: function() {
            // delay for performance
            this.invokeLater("set", 10, "nowShowing", this.get("shouldBeShowing"));
          }.observes("shouldBeShowing")
        })
      })
    })
  }),

  welcome: SC.LabelView.design({
    escapeHTML: NO,
    classNames: 'welcome-tab',
    value: "<h1>Test Controls</h1><p>SproutCore comes bundled with a wide array of controls that you can use in your own applications. Most of these controls can be created very easily using the built-in view helper functions. Consult the source code of this application for samples code to use in your own application.</p>"
  }),
  
  progress_page: TestControls.progressPage,
  
  buttons_page: TestControls.buttonsPage,
  
  checkboxes_page: TestControls.checkboxesPage,
  
  radio_page: TestControls.radioPage,
  
  select_page: TestControls.selectPage,
  
  text_field_page: TestControls.textFieldPage,
  
  segmented_page: TestControls.segmentedPage,
  
  flow_layout_page: TestControls.flowLayoutPage,
  
  scroll_page: TestControls.scrollPage,
  
  list_page: TestControls.listPage,
  
  tab_page: TestControls.tabPage
});
