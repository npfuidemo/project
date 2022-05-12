var emptyTemplate = _.template(`
<div style="padding: 15px; border: 2px dashed #CCC; background-color: #EEE; color: #999; text-align: center;">
  Tabs
</div>
`);

var tabTemplate = _.template(`
    <style>
    .tab{
        border:1px solid #ddd;
        display:flex;
        background-color: <%= values.tabbgcolor %>; /*** Map with background color ***/
	}
	
	.vertical_tab .tab{
	  width: <%= values.tabwidth %>%;  /*** Map with tab left width ***/
	}
	
	.horizontal_tab .tab .tablinks<%=(values._meta.htmlID).replace('u_content_custom_tab-','') %>{
	  width: <%= values.tabwidth %>%;
	}
	
	/* Style the buttons inside the tab */
	.tab button{
	  background-color: <%= values.tabbuttonbgcolor %>; /*** Map with button background color ***/
	  color: #000; 
	  padding: 20px 16px;
	  border: none;
	  outline: none;
	  text-align: left;
	  cursor: pointer;
	  transition: 0.3s;
	  font-size: 16px;
    }
    .tab button:hover{
        
    }
	.tab-center{justify-content:center;}
    .tab-left{justify-content: flex-start;}
    .tab-right{justify-content: flex-end;}

    .tabcontent{
        padding: <%= values.tabcontentpadding %>px; /*** Map with tabcontent Padding ***/
        border: 1px solid #ddd;
        border-top: none;
    }
	.tabcontent h3{ margin-top:0}
	
	.vertical_tab .tab button{
	  display: block;
	  width: 100%;
    }
    
    .vertical_tab .tab{
        -ms-flex-direction:column;
        flex-direction:column;
    }

	/* Change background color of buttons on hover */
	.tab button:hover {
	  background-color: <%= values.tabhovercolor %>; /*** Map with button background hover color ***/
	}

	/* Create an active/current "tab button" class */
	.tab button.active {
		background-color: <%= values.tabactivebgcolor %>; /*** Map with button background active color ***/
	}
	
	@media(min-width:769px){
            .vertical_tab{
                display:flex;
            }
            .vertical_tab .tabcontent{
                width: <%= values.contentwidth %>%; /*** Map with tab left width ***/
                border-top: 1px solid #ddd;
                border-left: none;
            }
	}

	/* Style the tab content */
	@media(max-width:768px){
            .vertical_tab .tab {
                    width: 100%;
                    height: unset;
            }
            .vertical_tab .tab button { 
                    width:unset;
                    display: inline-block;
                    padding: 12px 16px;
            }
	}
    </style>
    <div class="tabContainerdiv <%= values.tabplacement %>">
        <div class="tab tab-<%= values.tabAlignment %>">
            <% _.forEach(values.tabs.items, function(tab, index) { %>
                <button class="tablinks<%=(values._meta.htmlID).replace('u_content_custom_tab-','') %> <%= index === 0 ? 'active' : '' %>" data-index="<%=(values._meta.htmlID).replace('u_content_custom_tab-','') %><%= index %>" onclick="openTab(this,'<%= (values._meta.htmlID).replace('u_content_custom_tab-','') %><%= index %>','<%= (values._meta.htmlID).replace('u_content_custom_tab-','') %>')" style="color:<%= values.headingColor %>;text-align:<%= values.headingAlignment %>;font-size:<%= values.headingFontSize %>px"><%= tab.label %></button>
            <% }); %>
        </div>
        <div class="tabcontent">	
                <% _.forEach(values.tabs.items, function(tab, index) { %>
                        <div class="tabdata<%=(values._meta.htmlID).replace('u_content_custom_tab-','') %>" id="<%=(values._meta.htmlID).replace('u_content_custom_tab-','') %><%= index %>" data-index="<%=(values._meta.htmlID).replace('u_content_custom_tab-','') %><%= index %>" style="<%= index === 0 ? 'display:block!important;' : 'display:none!important;' %> color:<%= values.contentColor %>;text-align:<%= values.contentAlignment %>;font-size:<%= values.contentFontSize %>px">
                                <h3 style="display:none;"><%= tab.label %></h3>
                                <div><%= tab.content %></div>
                        </div>
                <% }); %>
        </div>
    </div>
    <div class="tab-common-content" style="color:<%= values.commonContentColor %>;text-align:<%= values.commonContentAlignment %>;
            padding:<%= values.commonTabcontentpadding%>px; width:<%= values.commonContentwidth%>%;font-size:<%= values.commonContentFontSize %>px;">
            <%= values.commonContentText %>
    </div>
`);

var richTabTemplate = _.template(`
    <style>
    .richtab{
        border:1px solid #ddd;
        display:flex;
        background-color: <%= values.tabbgcolor %>; /*** Map with background color ***/
	}
	
	.vertical_tab .richtab{
	  width: <%= values.tabwidth %>%;  /*** Map with tab left width ***/
	}
	
	.horizontal_tab .richtab .richtablinks<%= (values._meta.htmlID).replace('u_content_custom_tab-','') %>{
	  width: <%= values.tabwidth %>%;
	}
	
	/* Style the buttons inside the tab */
	.richtab button{
	  background-color: <%= values.tabbuttonbgcolor %>; /*** Map with button background color ***/
	  color: #000; 
	  padding: 20px 16px;
	  border: none;
	  outline: none;
	  text-align: left;
	  cursor: pointer;
	  transition: 0.3s;
	  font-size: 16px;
    }
    .richtab button:hover{
        
    }
	.richtab-center{justify-content:center;}
    .richtab-left{justify-content: flex-start;}
    .richtab-right{justify-content: flex-end;}

    .richtabcontent{
        padding: <%= values.tabcontentpadding %>px; /*** Map with tabcontent Padding ***/
        border: 1px solid #ddd;
        border-top: none;
    }
	.richtabcontent h3{ margin-top:0}
	
	.vertical_tab .richtab button{
	  display: block;
	  width: 100%;
    }
    
    .vertical_tab .richtab{
        -ms-flex-direction:column;
        flex-direction:column;
    }

	/* Change background color of buttons on hover */
	.richtab button:hover {
	  background-color: <%= values.tabhovercolor %>; /*** Map with button background hover color ***/
	}

	/* Create an active/current "tab button" class */
	.richtab button.active {
		background-color: <%= values.tabactivebgcolor %>; /*** Map with button background active color ***/
	}
	
	@media(min-width:769px){
            .vertical_tab{
                display:flex;
            }
            .vertical_tab .richtabcontent{
                width: <%= values.contentwidth %>%; /*** Map with tab left width ***/
                border-top: 1px solid #ddd;
                border-left: none;
            }
	}

	/* Style the tab content */
	@media(max-width:768px){
            .vertical_tab .richtab {
                    width: 100%;
                    height: unset;
            }
            .vertical_tab .richtab button { 
                    width:unset;
                    display: inline-block;
                    padding: 12px 16px;
            }
	}
    </style>
    <div class="richtabContainerdiv <%= values.tabplacement %>">
        <div class="richtab tab-<%= values.tabAlignment %>">
            <% _.forEach(values.richtabs.items, function(tab, index) { %>
                <button class="richtablinks<%= (values._meta.htmlID).replace('u_content_custom_tab-','') %> <%= index === 0 ? 'active' : '' %>" data-index="<%= (values._meta.htmlID).replace('u_content_custom_tab-','') %>99<%= index %>" onclick="openRichTab(this,'<%= (values._meta.htmlID).replace('u_content_custom_tab-','') %>99<%= index %>','<%= (values._meta.htmlID).replace('u_content_custom_tab-','') %>')" style="color:<%= values.headingColor %>;text-align:<%= values.headingAlignment %>;font-size:<%= values.headingFontSize %>px"><%= tab.label %></button>
            <% }); %>
        </div>
        <div class="richtabcontent">	
                <% _.forEach(values.richtabs.items, function(tab, index) { %>
                        <div class="richtabdata<%= (values._meta.htmlID).replace('u_content_custom_tab-','') %>" id="<%= (values._meta.htmlID).replace('u_content_custom_tab-','') %>99<%= index %>" data-index="<%= (values._meta.htmlID).replace('u_content_custom_tab-','') %>99<%= index %>" style="<%= index === 0 ? 'display:block!important;' : 'display:none!important;' %> color:<%= values.contentColor %>;text-align:<%= values.contentAlignment %>;font-size:<%= values.contentFontSize %>px">
                                <h3 style="display:none;"><%= tab.label %></h3>
                                <div><%= tab.content %></div>
                        </div>
                <% }); %>
        </div>
    </div>
    <div class="tab-common-content" style="color:<%= values.commonContentColor %>;text-align:<%= values.commonContentAlignment %>;
            padding:<%= values.commonTabcontentpadding%>px; width:<%= values.commonContentwidth%>%;font-size:<%= values.commonContentFontSize %>px;">
            <%= values.commonContentText %>
    </div>
`);

var editorTemplate = _.template(`
    <% _.forEach(value.items, function(item, index) { %>
      <div class="menu-item" style="padding: 10px; margin: 10px 0px; background-color: #FFF; border: 1px sodlid #CCC;">
        <div class="blockbuilder-widget-label">
          <label>Tab</label>
        </div>
        <input class="npf-tab-name form-control" data-index="<%= index %>" type="text" value="<%= item.label %>" />
        <div class="blockbuilder-widget-label pt-2">
          <label>Content</label>
        </div>
        <textarea class="npf-tab-content form-control" data-index="<%= index %>"><%= item.content %></textarea>
        <a class="npf-delete-tab-block" data-index="<%= index %>" style="display: inline-block; cursor: pointer; color: red; margin-top: 10px; font-size: 12px;">
          Delete Tab
        </a>
      </div>
    <% }); %>

    <div>
      <a class="npf-add-tab-block" style="display: block; text-align: center; padding: 10px; background-color: #EEE; border: 1px solid #CCC; color: #999; cursor: pointer;">
        Add New Tab
      </a>
    </div>
`);

var editorRichTemplate = _.template(`
    <% _.forEach(value.items, function(item, index) { %>
      <div class="menu-item" style="padding: 10px; margin: 10px 0px; background-color: #FFF; border: 1px sodlid #CCC;">
        <div class="blockbuilder-widget-label">
          <label>Tab</label>
        </div>
        <input class="npf-rich-tab-name form-control" data-index="<%= index %>" type="text" value="<%= item.label %>" />
        <div class="blockbuilder-widget-label pt-2">
          <label>Content</label>
        </div>
        <textarea name="editor1swq<%= index+1 %>" class="npf-rich-tab-content form-control richtextArea" data-index="<%= index %>"><%= item.content %></textarea>
        <a class="npf-delete-rich-tab-block" data-index="<%= index %>" style="display: inline-block; cursor: pointer; color: red; margin-top: 10px; font-size: 12px;">
          Delete Tab
        </a>
      </div>
    <% }); %>

    <div>
      <a class="npf-add-rich-tab-block" style="display: block; text-align: center; padding: 10px; background-color: #EEE; border: 1px solid #CCC; color: #999; cursor: pointer;">
        Add New Tab
      </a>
    </div>
`);

var textOverImageTemplate = _.template(`
    <style>
	.parentPos{
		position:relative;
	}
	.boxBg{
		background-color: <%= values.backgroundColor %>; /*** Map with Background color / RGBA ***/
		height:100%;
		padding-top:<%= values.paddingtop %>px; /*** Bind with Padding ***/
		padding-bottom:<%= values.paddingbottom %>px; /*** Bind with Padding ***/
		padding-right:<%= values.paddingright %>px; /*** Bind with Padding ***/
		padding-left:<%= values.paddingleft %>px; /*** Bind with Padding ***/
		border-top-left-radius:<%= values.borderradiustopleft %>px; /**** Map With Border radius */
		border-top-right-radius:<%= values.borderradiustopright %>px; /**** Map With Border radius */
		border-bottom-left-radius:<%= values.borderradiusbottomleft %>px; /**** Map With Border radius */
		border-bottom-right-radius:<%= values.borderradiusbottomright %>px; /**** Map With Border radius */
	}
	.boxBgInner{
        text-align:<%= values.textalignment %>;
    }
	.boxBg2{
		background-color: <%= values.backgroundColor2 %>; /*** Map with Background color / RGBA ***/
		height:100%;
		padding-top:<%= values.paddingtop2 %>px; /*** Bind with Padding ***/
		padding-bottom:<%= values.paddingbottom2 %>px; /*** Bind with Padding ***/
		padding-right:<%= values.paddingright2 %>px; /*** Bind with Padding ***/
		padding-left:<%= values.paddingleft2 %>px; /*** Bind with Padding ***/
		border-top-left-radius:<%= values.borderradiustopleft2 %>px; /**** Map With Border radius */
		border-top-right-radius:<%= values.borderradiustopright2 %>px; /**** Map With Border radius */
		border-bottom-left-radius:<%= values.borderradiusbottomleft2 %>px; /**** Map With Border radius */
		border-bottom-right-radius:<%= values.borderradiusbottomright2 %>px; /**** Map With Border radius */
	}
	.boxBgInner2{
        text-align:<%= values.textalignment2 %>;
    }
	.withImageTag .boxContent{
		position:<%= values.position %>;  /*** Bind with position ***/
		top:0;
		width:96%;
		height:auto;
		font-size:<%= values.textFontSize %>px; /*** Bind with font size ***/
		margin-top:<%= values.margintop %>px; /*** Bind with margin ***/
		margin-bottom:<%= values.marginbottom %>px; /*** Bind with margin ***/
		margin-right:<%= values.marginright %>px; /*** Bind with margin ***/
		margin-left:<%= values.marginleft %>px; /*** Bind with margin ***/
	}
	.withImageTag .boxContent2{
		position:<%= values.position2 %>;  /*** Bind with position ***/
		top:0;
		width:96%;
		height:auto;
		font-size:<%= values.textFontSize2 %>px; /*** Bind with font size ***/
		margin-top:<%= values.margintop2 %>px; /*** Bind with margin ***/
		margin-bottom:<%= values.marginbottom2 %>px; /*** Bind with margin ***/
		margin-right:<%= values.marginright2 %>px; /*** Bind with margin ***/
		margin-left:<%= values.marginleft2 %>px; /*** Bind with margin ***/
	}
        .withImageTag { text-align:<%= values.imageAlignment %> }
	@media (min-width:768px){
		.withImageTag .boxContent{
                    font-size:<%= values.textFontSize %>px; /*** Bind with font size ***/
                    top:<%= values.top %>px; /*** Bind with top ***/
                    left:<%= values.left %>px; /*** Bind with right ***/
                    width:<%= values.width %>%; /*** Bind with width ***/
                    height:<%= values.height %>px; /*** Bind with height ***/
		}
		.withImageTag .boxContent2{
                    font-size:<%= values.textFontSize2 %>px; /*** Bind with font size ***/
                    top:<%= values.top2 %>px; /*** Bind with top ***/
                    right:<%= values.right2 %>px; /*** Bind with right ***/
                    width:<%= values.width2 %>%; /*** Bind with width ***/
                    height:<%= values.height2 %>px; /*** Bind with height ***/
		}
	}
	@media (max-width:767px){
		.withImageTag .boxContent{
            font-size:<%= values.textFontSize %>px; /*** Bind with font size ***/
            left:auto;
            padding:2%;
		}
		.withImageTag .boxContent2{
            font-size:<%= values.textFontSize2 %>px; /*** Bind with font size ***/
            right:auto;
            padding:0;
            width:100%;
            position:relative;
		}
		.imageTag{
			max-width:100%;
			height:auto;
		}
	}
        @media(min-width:769px){
            .hide-on-desktop{display:none;}
            .hide-on-mobile{display:inline-block;}
	}
        @media(max-width:768px){
            .hide-on-desktop{display:inline-block;}
            .hide-on-mobile{display:none;}
	}
    </style>
    <div class="parentPos withImageTag">
	<img class="imageTag <% if(values.imageHideonDesktop === true) { %> hide-on-desktop <% } %> <% if(values.imageHideonMobile === true) { %> hide-on-mobile <% } %>" src="<%= values.image.url %>" alt="Landing_Page_Counseling"
            <% if(values.image.autoWidth === false) { %>
                style="max-width:<%= values.image.maxWidth %>"
            <% } else { %>
                style="max-width:100%"
            <% } %>
        >
	<div class="boxContent <% if(values.containerOneHideonDesktop === true) { %> hide-on-desktop <% } %> <% if(values.containerOneHideonMobile === true) { %> hide-on-mobile <% } %>">
            <div class="boxBg">
                <div class="boxBgInner">
                    <% if(values.richtextradio === false) { %>
                        <%= values.text %>
                    <% } else { %>
                        <%= values.richtext %>
                    <% } %>
                </div>
            </div>
        </div>
        <% if(values.enableContainer2radio === true) { %>
            <div class="boxContent2 <% if(values.containerTwoHideonDesktop === true) { %> hide-on-desktop <% } %> <% if(values.containerTwoHideonMobile === true) { %> hide-on-mobile <% } %>">
                <div class="boxBg2">
                    <div class="boxBgInner2">
                        <% if(values.richtextradio2 === false) { %>
                            <%= values.text2 %>
                        <% } else { %>
                            <%= values.richtext2 %>
                        <% } %>
                    </div>
                </div>
            </div>
        <% } %>
    </div>`);

unlayer.registerPropertyEditor({
    name: 'tab_editor',
    layout: 'bottom',
    Widget: unlayer.createWidget({
        render(value, updateValue, data) {
            return editorTemplate({ value: value});
        },
        mount(node, value, updateValue, data) {
            var addButton = node.querySelector('.npf-add-tab-block');
            addButton.onclick = function () {
            var newItems = value.items.slice(0);
                newItems.push({
                    label: 'Tab Name',
                    content: 'Tab Content',
                });
                updateValue({ items: newItems });
            };
            // Tab Name Change
            // Look for inputs with class tab-name and attach onchange event
            node.querySelectorAll('.npf-tab-name').forEach(function (item) {
                item.onchange = function (e) {
                    // Get index of item being updated
                    var itemIndex = e.target.dataset.index;
                    // Get the item and update its value
                    var updatedItems = value.items.map(function (item, i) {
                        if (i == itemIndex) {
                            return {
                                label: e.target.value,
                                content: item.content,
                            };
                        }

                        return {
                            label: item.label,
                            content: item.content,
                        };
                    });
                    updateValue({ items: updatedItems });
                };
            });
            // Tab Content Change
            // Look for inputs with class tab-content and attach onchange event
            node.querySelectorAll('.npf-tab-content').forEach(function (item) { 
                item.onchange = function (e) {
                    // Get index of item being updated
                    var itemIndex = e.target.dataset.index;
                    // Get the item and update its value
                    
                    var updatedItems = value.items.map(function (item, i) {  
                        //console.log(i);console.log('>>');console.log(itemIndex);
                        if (i == itemIndex) {
                            return {
                                label: item.label,
                                content: e.target.value,
                            };
                        }

                        return {
                            label: item.label,
                            content: item.content,
                        };
                    });
                    updateValue({ items: updatedItems });
                    e.target.focus();
                };
            });
                // Delete
            node.querySelectorAll('.npf-delete-tab-block').forEach(function (item) {
                item.onclick = function (e) {
                // Get index of item being deleted
                    var itemIndex = e.target.dataset.index;
                    var updatedItems = value.items.map(function (item, i) {
                        if (i == itemIndex) {
                            return false;
                        }

                        return {
                            label: item.label,
                            content: item.content,
                        };
                    })
                    .filter(function (item) {
                        return item;
                    });
                    updateValue({ items: updatedItems });
                };
            });
        },
    }),
});

unlayer.registerPropertyEditor({
    name: 'rich_tab_editor',
    layout: 'bottom',
    Widget: unlayer.createWidget({
        render(value, updateValue, data) {
            return editorRichTemplate({ value: value});
        },
        mount(node, value, updateValue, data) {
            //CKEDITOR.replaceAll();
            var addButton = node.querySelector('.npf-add-rich-tab-block');
            addButton.onclick = function () {
            var newItems = value.items.slice(0);
                newItems.push({
                    label: 'Rich Text Box',
                    content: 'Rich Text Box Content',
                });
                updateValue({ items: newItems });
            };
            // Tab Name Change
            // Look for inputs with class tab-name and attach onchange event
            node.querySelectorAll('.npf-rich-tab-name').forEach(function (item) {
                item.onchange = function (e) {
                    // Get index of item being updated
                    var itemIndex = e.target.dataset.index;
                    // Get the item and update its value
                    var updatedItems = value.items.map(function (item, i) {
                        if (i == itemIndex) {
                            return {
                                label: e.target.value,
                                content: item.content,
                            };
                        }

                        return {
                            label: item.label,
                            content: item.content,
                        };
                    });
                    updateValue({ items: updatedItems });
                };
            });
            // Tab Content Change
            // Look for inputs with class tab-content and attach onchange event for rich text editor           
            tinymce.init({
                selector: 'textarea.richtextArea',
                height: 200,
                menubar: false,
                plugins: [
                    'advlist autolink lists link image charmap print preview anchor',
                    'searchreplace visualblocks code fullscreen',
                    'insertdatetime media table paste code help wordcount'
                ],
                toolbar: 'undo redo | formatselect | ' +
                'bold italic backcolor | alignleft aligncenter ' +
                'alignright alignjustify | bullist numlist outdent indent | ' +
                'removeformat | help',
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                init_instance_callback: function (editor) {
                    editor.on('blur', function (e) {
                        var itemIndex = editor.targetElm.dataset.index;                       
                        var item = editor.targetElm;
                        var updatedItems = value.items.map(function (item, i) {
                            if (i == itemIndex) {  
                                return {
                                    label: item.label,
                                    content: editor.getContent(),
                                };
                            }

                            return {
                                label: item.label,
                                content: item.content,
                            };
                        });
                        updateValue({ items: updatedItems }); 
                    });
                }
            });
            // Delete
            node.querySelectorAll('.npf-delete-rich-tab-block').forEach(function (item) {
                item.onclick = function (e) {
                // Get index of item being deleted
                    var itemIndex = e.target.dataset.index;
                    var updatedItems = value.items.map(function (item, i) {
                        if (i == itemIndex) {
                            return false;
                        }

                        return {
                            label: item.label,
                            content: item.content,
                        };
                    })
                    .filter(function (item) {
                        return item;
                    });
                    updateValue({ items: updatedItems });
                };
            });
        },
    }),
});


unlayer.registerTool({
    name: 'tab-tool',
    label: 'Tabs',
    icon: 'fa-th-list',
    supportedDisplayModes: ['web', 'email'],
    options: {
        default: {
            title: null,
        },
        tabing: {
            title: 'Tab Items',
            position: 1,
            options: {
                tabplacement: {
                    label: 'Placement',
                    defaultValue: "horizontal_tab",
                    widget: 'dropdown',
                },
                richtextradio: {
                    label: 'Rich Text Editor',
                    defaultValue: false,
                    widget: 'toggle',
                },
                tabs: {
                    label: 'Tab Items',
                    defaultValue: {
                        items: [],
                    },
                    widget: 'tab_editor', // Custom Property Editor
                },
                richtabs: {
                    label: 'Tab Items',
                    defaultValue: {
                        items: [],
                    },
                    widget: 'rich_tab_editor', // Custom Property Editor
                },
            },
        },
        heading: {
            title: "Heading",
            position: 2,
            options: {
                headingFontSize: {
                    "label": "Font Size",
                    "defaultValue": "14",
                    "widget": "counter"
                },
                headingColor: {
                    "label": "Color",
                    "defaultValue": "#000000",
                    "widget": "color_picker"
                },
                headingAlignment: {
                    "label": "Text Alignment",
                    "defaultValue": "left",
                    "widget": "alignment"
                },
                tabAlignment: {
                    "label": "Tab Alignment",
                    "defaultValue": "left",
                    "widget": "alignment"
                },
                tabwidth: {
                    label: 'Tab Width(%)',
                    defaultValue: "25",
                    widget: 'counter',
                },
                tabbuttonbgcolor: {
                    label: 'Tab Button Background Color',
                    defaultValue: "#F2F2F2",
                    widget: 'color_picker',
                },
                tabbgcolor: {
                    label: 'Tab Background Color',
                    defaultValue: "#F1F1F1",
                    widget: 'color_picker',
                },
                tabactivebgcolor: {
                    label: 'Tab Active Background Color',
                    defaultValue: "#4B7BDD",
                    widget: 'color_picker',
                },
                tabhovercolor: {
                    label: 'Tab Hover Color',
                    defaultValue: "#DDDDDD",
                    widget: 'color_picker',
                },
            },
        },
        content: {
            title: "Content",
            position: 3,
            options: {
                contentFontSize: {
                    "label": "Font Size",
                    "defaultValue": "14",
                    "widget": "counter"
                },
                contentColor: {
                    "label": "Color",
                    "defaultValue": "#000000",
                    "widget": "color_picker"
                },
                contentAlignment: {
                    "label": "Alignment",
                    "defaultValue": "left",
                    "widget": "alignment"
                },
                tabcontentpadding: {
                    "label": "Padding",
                    "defaultValue": "20",
                    "widget": "counter"
                },
                contentwidth: {
                    "label": "Width(%)",
                    "defaultValue": "75",
                    "widget": "counter"
                },
            },
        },
        commonContent: {
            title: "Common Content",
            position: 4,
            options: {
                commonContentText: {
                    "label": "Common Content",
                    "defaultValue": "",
                    "widget": "html"
                },
                commonContentFontSize: {
                    "label": "Font Size",
                    "defaultValue": "14",
                    "widget": "counter"
                },
                commonContentColor: {
                    "label": "Color",
                    "defaultValue": "#000000",
                    "widget": "color_picker"
                },
                commonContentAlignment: {
                    "label": "Alignment",
                    "defaultValue": "left",
                    "widget": "alignment"
                },
                commonTabcontentpadding: {
                    "label": "Padding",
                    "defaultValue": "20",
                    "widget": "counter"
                },
                commonContentwidth: {
                    "label": "Width(%)",
                    "defaultValue": "75",
                    "widget": "counter"
                },
            },
        }
    },
    propertyStates: (values) => {
        var config = {};
        if (values.richtextradio === true) {
            config['richtabs'] = { enabled: true };
            config['tabs'] = { enabled: false };
        } else {
            config['richtabs'] = { enabled: false };
            config['tabs'] = { enabled: true };
        }
        return config;
    },
    values: {},
    renderer: {
        Viewer: unlayer.createViewer({
            render(values) {
                if(typeof values.richtextradio == 'undefined' || values.richtextradio == false){
                    if (typeof values.tabs == 'undefined' || typeof values.tabs.items == 'undefined' || values.tabs.items.length == 0) return emptyTemplate();
                    return tabTemplate({ values: values});
                }else{
                    if (typeof values.richtabs == 'undefined' || typeof values.richtabs.items == 'undefined' || values.richtabs.items.length == 0) return emptyTemplate();
                    return richTabTemplate({ values: values});
                }
            }
        }),
        exporters: {
            web: function (values) {
                if(typeof values.richtextradio == 'undefined' || values.richtextradio == false){
                    return tabTemplate({ values: values});
                }else{
                    return richTabTemplate({ values: values});
                }
            },
            email: function (values) {
                if(typeof values.richtextradio == 'undefined' || values.richtextradio == false){
                    return tabTemplate({ values: values});
                }else{
                    return richTabTemplate({ values: values});
                }
            }
        },
        head: {
            css: function (values) {
            },
            js: function (values) { //console.log(values.richtabs.items.length);
                return `
                    function openTab(item,indexId,tabId) {
                        var i, tabcontent, tablinks;
                        tabcontent = document.getElementsByClassName("tabdata"+tabId);
                        for (i = 0; i < tabcontent.length; i++) {
                            tabcontent[i].style.display = "none";
                        }
                        tablinks = document.getElementsByClassName("tablinks"+tabId);
                        for (i = 0; i < tablinks.length; i++) {
                            tablinks[i].className = tablinks[i].className.replace(" active", "");
                        }
                        document.getElementById(indexId).style.display = "block";
                        item.classList.add("active")
                    }
                
                    function openRichTab(item,indexId,tabId) {
                        var i, richtabcontent, richtablinks;
                        richtabcontent = document.getElementsByClassName("richtabdata"+tabId);
                        for (i = 0; i < richtabcontent.length; i++) {
                            richtabcontent[i].style.display = "none";
                        }
                        richtablinks = document.getElementsByClassName("richtablinks"+tabId);
                        for (i = 0; i < richtablinks.length; i++) {
                            richtablinks[i].className = richtablinks[i].className.replace(" active", "");
                        }
                        document.getElementById(indexId).style.display = "block";
                        item.classList.add("active")
                    }
                `;
            }
        }
    }
});


unlayer.registerTool({
    name: 'text_over_image_tool',
    label: 'Image & Text',
    icon: 'fa-id-card',
    supportedDisplayModes: ['web', 'email'],
    options: {
        default: {
            title: null,
        },
        text_over_image: {
            title: 'Image and Text',
            position: 1,
            options: {
                image: {
                    label: 'Image',
                    defaultValue: {
                        url: "http://via.placeholder.com/350x150"
                    },
                    widget: 'image',
                },
                imageHideonDesktop: {
                    "label": "Hide Image on Desktop",
                    "defaultValue": false,
                    "widget": "toggle"
                },
                imageHideonMobile: {
                    "label": "Hide Image on Mobile",
                    "defaultValue": false,
                    "widget": "toggle"
                },
                imageAlignment: {
                    label: 'Image Alignment',
                    defaultValue: 'left',
                    widget: 'alignment',
                },
                richtextradio: {
                    label: 'Rich Text Editor',
                    defaultValue: false,
                    widget: 'toggle',
                },
                text: {
                    label: 'Text',
                    defaultValue: "Text",
                    widget: 'html',
                },
                richtext: {
                    label: 'Text',
                    defaultValue: "Text",
                    widget: 'rich_text',
                },
                enableContainer2radio: {
                    label: 'Enable Text Container 2',
                    defaultValue: false,
                    widget: 'toggle',
                },
                richtextradio2: {
                    label: 'Rich Text Editor',
                    defaultValue: false,
                    widget: 'toggle',
                },
                text2: {
                    label: 'Text',
                    defaultValue: "Text",
                    widget: 'html',
                },
                richtext2: {
                    label: 'Text',
                    defaultValue: "Text",
                    widget: 'rich_text',
                },
            },
        },
        text_container : {
            title : 'Text Container 1 Settings',
            position: 2,
            options: {
                containerOneHideonDesktop: {
                    "label": "Hide on Desktop",
                    "defaultValue": false,
                    "widget": "toggle"
                },
                containerOneHideonMobile: {
                    "label": "Hide on Mobile",
                    "defaultValue": false,
                    "widget": "toggle"
                },
                textFontSize: {
                    "label": "Font Size",
                    "defaultValue": "10",
                    "widget": "counter"
                },
                textalignment: {
                    "label": "Alignment",
                    "defaultValue": "left",
                    "widget": "alignment"
                },
                margintop: {
                    label: 'Margin-Top',
                    defaultValue: "0",
                    widget: 'counter',
                },
                marginbottom: {
                    label: 'Margin-Bottom',
                    defaultValue: "0",
                    widget: 'counter',
                },
                marginleft: {
                    label: 'Margin-Left',
                    defaultValue: "0",
                    widget: 'counter',
                },
                marginright: {
                    label: 'Margin-Right',
                    defaultValue: "0",
                    widget: 'counter',
                },
                paddingtop: {
                    label: 'Padding-Top',
                    defaultValue: "15",
                    widget: 'counter',
                },
                paddingbottom: {
                    label: 'Padding-Bottom',
                    defaultValue: "15",
                    widget: 'counter',
                },
                paddingleft: {
                    label: 'Padding-Left',
                    defaultValue: "15",
                    widget: 'counter',
                },
                paddingright: {
                    label: 'Padding-Right',
                    defaultValue: "15",
                    widget: 'counter',
                },
                borderradiustopleft: {
                    label: 'Border-Radius Top Left',
                    defaultValue: "5",
                    widget: 'counter',
                },
                borderradiustopright: {
                    label: 'Border-Radius Top Right',
                    defaultValue: "5",
                    widget: 'counter',
                },
                borderradiusbottomleft: {
                    label: 'Border-Radius Bottom Left',
                    defaultValue: "5",
                    widget: 'counter',
                },
                borderradiusbottomright: {
                    label: 'Border-Radius Bottom Right',
                    defaultValue: "5",
                    widget: 'counter',
                },
                position: {
                    label: 'Position',
                    defaultValue: "absolute",
                    widget: 'dropdown',
                },
                top: {
                    label: 'Top',
                    defaultValue: "30",
                    widget: 'counter',
                },
                left: {
                    label: 'Left',
                    defaultValue: "10",
                    widget: 'counter',
                },
                backgroundColor: {
                    label: 'Background Color',
                    defaultValue: "#BCBEBE",
                    widget: 'color_picker',
                },
                width: {
                    label: 'Width(%)',
                    defaultValue: "45",
                    widget: 'counter',
                },
                height: {
                    label: 'Height',
                    defaultValue: "100",
                    widget: 'counter',
                }
            }
        },
        text_container2 : {
            title : 'Text Container 2 Settings',
            position: 3,
            options: {
                containerTwoHideonDesktop: {
                    "label": "Hide on Desktop",
                    "defaultValue": false,
                    "widget": "toggle"
                },
                containerTwoHideonMobile: {
                    "label": "Hide on Mobile",
                    "defaultValue": false,
                    "widget": "toggle"
                },
                textFontSize2: {
                    "label": "Font Size",
                    "defaultValue": "10",
                    "widget": "counter"
                },
                textalignment2: {
                    "label": "Alignment",
                    "defaultValue": "left",
                    "widget": "alignment"
                },
                margintop2: {
                    label: 'Margin-Top',
                    defaultValue: "0",
                    widget: 'counter',
                },
                marginbottom2: {
                    label: 'Margin-Bottom',
                    defaultValue: "0",
                    widget: 'counter',
                },
                marginleft2: {
                    label: 'Margin-Left',
                    defaultValue: "0",
                    widget: 'counter',
                },
                marginright2: {
                    label: 'Margin-Right',
                    defaultValue: "0",
                    widget: 'counter',
                },
                paddingtop2: {
                    label: 'Padding-Top',
                    defaultValue: "15",
                    widget: 'counter',
                },
                paddingbottom2: {
                    label: 'Padding-Bottom',
                    defaultValue: "15",
                    widget: 'counter',
                },
                paddingleft2: {
                    label: 'Padding-Left',
                    defaultValue: "15",
                    widget: 'counter',
                },
                paddingright2: {
                    label: 'Padding-Right',
                    defaultValue: "15",
                    widget: 'counter',
                },
                borderradiustopleft2: {
                    label: 'Border-Radius Top Left',
                    defaultValue: "5",
                    widget: 'counter',
                },
                borderradiustopright2: {
                    label: 'Border-Radius Top Right',
                    defaultValue: "5",
                    widget: 'counter',
                },
                borderradiusbottomleft2: {
                    label: 'Border-Radius Bottom Left',
                    defaultValue: "5",
                    widget: 'counter',
                },
                borderradiusbottomright2: {
                    label: 'Border-Radius Bottom Right',
                    defaultValue: "5",
                    widget: 'counter',
                },
                position2: {
                    label: 'Position',
                    defaultValue: "absolute",
                    widget: 'dropdown',
                },
                top2: {
                    label: 'Top',
                    defaultValue: "30",
                    widget: 'counter',
                },
                right2: {
                    label: 'Right',
                    defaultValue: "10",
                    widget: 'counter',
                },
                backgroundColor2: {
                    label: 'Background Color',
                    defaultValue: "#BCBEBE",
                    widget: 'color_picker',
                },
                width2: {
                    label: 'Width(%)',
                    defaultValue: "45",
                    widget: 'counter',
                },
                height2: {
                    label: 'Height',
                    defaultValue: "100",
                    widget: 'counter',
                }
            }
        }
    },
    propertyStates: (values) => {
        var config = {};
        if (values.richtextradio === true) {
            config['richtext'] = { enabled: true };
            config['text'] = { enabled: false };
        } else {
            config['richtext'] = { enabled: false };
            config['text'] = { enabled: true };
        }
        if (values.enableContainer2radio === true) {
            config['richtextradio2'] = { enabled: true };
            if (values.richtextradio2 === true) {
                config['richtext2'] = { enabled: true };
                config['text2'] = { enabled: false };
            } else {
                config['richtext2'] = { enabled: false };
                config['text2'] = { enabled: true };
            }
        } else {
            config['richtextradio2'] = { enabled: false };
            config['richtext2'] = { enabled: false };
            config['text2'] = { enabled: false };
        }
        return config;
    },
    values: {},
    renderer: {
        Viewer: unlayer.createViewer({
            render(values) {
                return textOverImageTemplate({ values: values});
            }
        }),
        exporters: {
            web: function (values) {
                return textOverImageTemplate({ values: values});
            },
            email: function (values) {
                return textOverImageTemplate({ values: values});
            }
        },
        head: {
            css: function (values) {
            },
            js: function (values) {

            }
        }
    }
});