/**
 * @fileOverview Definition for token plugin dialog.
 *
 */

'use strict';

CKEDITOR.dialog.add( 'token', function( editor ) {
	var lang = editor.lang.token;
	var	generalLabel = editor.lang.common.generalTab;
	var tokens = [["",""]];var allTokens = [["",""]];
	if (typeof editor.config.availableTokens != "undefined") {
		tokens = editor.config.availableTokens;
	}
        if (typeof editor.config.allTokens != "undefined") {
		allTokens = editor.config.allTokens;
	}
	return {
		title: lang.title,
		minWidth: 450,
		minHeight: 200,
		contents: [
			{
				id: 'info',
				label: generalLabel,
				title: generalLabel,
				elements: [
					// Dialog window UI elements.
//                                        {
//                                            id: "category",
//                                            type: "select",
//                                            style: 'width: 300px;',
//                                            label: 'Category',
//                                            //className: 'chosen-select',
//                                            'default': '',
//                                            required: true,
//                                            items: catogory,
//                                            onChange: function() {
//                                                // this = CKEDITOR.ui.dialog.select
//                                                var selectedCategory = this.getValue();
//                                                if(allTokens[selectedCategory] !== 'undefined'){
//                                                    var newTokens = allTokens[selectedCategory];
//                                                    var listHtml = '';
//                                                    jQuery.each(newTokens, function (index, value) {
//                                                        value = $.parseJSON(value);
//                                                        listHtml += '<option value="'+ value[1] +'">'+ value[0] +'</option>';
//
//                                                    });
//                                                    $("#cke_75_select").html(listHtml);
//                                                }
//                                            },
//                                            setup: function( widget ) {
//                                                    this.setValue( widget.data.name );
//                                                    $('.chosen-select').chosen();
//                                                    $('.chosen-select-deselect').chosen({allow_single_deselect: true});
//                                            },
//                                            commit: function( widget ) {
//                                                    widget.setData( 'category', this.getValue() );
//                                                    $('chosen-select').trigger('chosen:updated');
//                                            }
//					},
					{
						id: "name",
						type: "select",
						style: 'width: 450px;',
						//label: lang.name,
                        className: 'tokens-npf',
						'default': '',
						required: true,
						items: tokens,
						setup: function( widget ) {
							this.setValue( widget.data.name );
							var options = '';
                                                       
                                                            jQuery.each(allTokens, function (category, categoryTokens) {
                                                                    if(categoryTokens.length > 0){
                                                                            options += '<optgroup label="'+category+'">';
                                                                            jQuery.each(categoryTokens, function (index, value) {
                                                                                 if(value!=''){
                                                                                    value = $.parseJSON(value);
                                                                                    options += '<option value="'+ value[1] +'">'+ value[0] +'</option>';
                                                                                 }
                                                                            });
                                                                            options += '</optgroup>';
                                                                    }
                                                            });
                                                        
							$("select.tokens-npf").html(options);
							$('.cke_editor_editor_dialog').addClass('tokenModal');
							$('.cke_editor_instructionEditor_dialog').addClass('tokenModal');
							$('.cke_editor_offerEditor_dialog').addClass('tokenModal');
							$("select.tokens-npf").chosen({ placeholder_text_single:"Select token name to be used in Email Content",}); 
							
							/*.on('chosen:showing_dropdown', function(e) {
								var chosenElement = $(e.currentTarget.nextSibling);
								chosenElement.find('li.active-result:contains(Email)').addClass('add-new');
							});*/
							$("select.tokens-npf").val('').trigger("chosen:updated.chosen");
							$('select.tokens-npf').trigger('chosen:open');
                                                        if (typeof(widget) !== 'undefined') {
                                                            widget.stopPropagation();
                                                        }
						},
						commit: function( widget ) {
							widget.setData( 'name', this.getValue() );
						}
					}
				]
			}
		]
	};
} );
