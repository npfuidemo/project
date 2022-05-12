(function ($) {
    $.fn.floatLabels = function (options) {

        // Settings
        var self = this;
        var settings = $.extend({}, options);


        // Event Handlers
        function registerEventHandlers() {
            // self.on('input keyup change focus', 'input, textarea', function () {
            //     actions.swapLabels(this);
            // });
            self.on('focusin', 'input, textarea', function () {
                actions.addFocus(this);
            });

            self.on('focusout', 'input, textarea', function () {
                actions.removeFocus(this);
            });

            self.on('mousedown', '.select-dropdown li a', function(){
                actions.selectValue(this);
            });

            self.on('keyup', 'select + input', function(){
                actions.dropdownFilter(this);
            });
            
        }


        // Actions
        var actions = {
            initialize: function() {
                self.each(function () {
                    var $this = $(this);
                    var $label = $this.children('label');
                    var $field = $this.find('input,textarea').first();

                    if ($this.children().first().is('label')) {
                        $this.children().first().remove();
                        $this.append($label);
                    }

                    var placeholderText = ($field.attr('placeholder') && $field.attr('placeholder') != $label.text()) ? $field.attr('placeholder') : $label.text();

                    $label.data('placeholder-text', placeholderText);
                    $label.data('original-text', $label.text());

                    if ($field.val() == '') {
                        $field.addClass('empty')
                    }
                });
            },

            changeSelectFields: function () {
                self.each(function () {
                    var $this = $(this);
                    // console.log($this);
                    var $selectFields = $this.find('select');
                    //console.log($selectFields.length);
                    if ($selectFields.length){
                        $selectFields.hide();
                        $selectedFieldID = $selectFields.attr('id');
                        $selectFields.after('<input type="text" class="form-control replaced-select-field" id="'+$selectedFieldID+'-styled">');
                        $options = $selectFields.find('option');
                        $styledElements = Array();
                        $options.each(function($i, $option){
                            $icon = $option.getAttribute('data-icon');
                            $icon = ($icon) ? '<i class="'+ $icon +'"></i> '  : '';
                            $html = '<li>'+
                                        '<a href="#" data-option="'+$option.value+'">'+
                                            $icon + $option.text
                                        '</a>'+
                                    '</li> '
                            $styledElements.push($html);
                        });
                        $styledElements ='<ul class="dropdown-menu select-dropdown" id="'+$selectedFieldID+'-dropdown">' + $styledElements.join(' ') + '</ul>' ;
                        $this.append($styledElements)
                    }

                });
            },

            selectValue: function(dropdown_elemet){
                $dropdown_elemet = $(dropdown_elemet);
                $relatedSelectFiled = $dropdown_elemet.parents('.select-dropdown').siblings('select');
                $relatedInputFiled = $dropdown_elemet.parents('.select-dropdown').siblings('input');
                $relatedSelectFiled.val($dropdown_elemet.data('option'));
                $relatedInputFiled.val($.trim($dropdown_elemet.text()));
            },

            dropdownFilter: function(inputField){
                $inputField = $(inputField);
                $relatedDDField  = $inputField.siblings('.select-dropdown');
                $options = $relatedDDField.find('a');
                $options.each(function(i, option){
                    $option = $(option);
                    if($.trim($option.text().toLowerCase()).search($.trim($inputField.val()).toLowerCase()) === -1){
                        $option.addClass('hide');
                    }else{
                        $option.removeClass('hide');
                    }
                });
            },

            swapLabels: function (field) {
                var $field = $(field);
                var $label = $(field).siblings('label').first();
                var isEmpty = Boolean($field.val());
                if (isEmpty) {
                    $field.removeClass('empty');
                    $label.text($label.data('original-text'));
                }
                else {
                    $field.addClass('empty');
                    $label.text($label.data('placeholder-text'));
                }
            },

            addFocus: function (field) {
                var $field = $(field);
                var $label = $(field).siblings('label').first();
                // var isEmpty = Boolean($field.val());
                $field.removeClass('empty');
                $label.text($label.data('original-text'));
                if($field.hasClass('replaced-select-field')){
                    $field.siblings('ul.select-dropdown').addClass('show');
                }
            },

            removeFocus: function (field) {
                var $field = $(field);
                var $label = $(field).siblings('label').first();
                var isEmpty = Boolean($field.val());
                if(isEmpty){
                    $field.removeClass('empty');
                    $label.text($label.data('placeholder-text'));
                }else{
                     $field.addClass('empty');
                    $label.text($label.data('original-text'));
                }
                if($field.hasClass('replaced-select-field')){
                    $field.siblings('ul.select-dropdown').removeClass('show');
                }
            }
        };


        // Initialization
        function init() {
            registerEventHandlers();

            actions.initialize();
            actions.changeSelectFields();
            self.each(function () {
                actions.swapLabels($(this).find('input,textarea').first());
            });
        }
        init();

        return this;
    };
})(jQuery);

$(function () {
    $('.float-label-control').floatLabels();
});