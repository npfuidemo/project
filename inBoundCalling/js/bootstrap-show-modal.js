/**
 * Author and copyright: Stefan Haack (https://shaack.com)
 * Repository: https://github.com/shaack/bootstrap-show-modal
 * License: MIT, see file 'LICENSE'
 */

(function ($) {
    "use strict"

    var i = 0
    function Modal(props) {
        this.props = {
            title: "", // the dialog title html
            body: "", // the dialog body html
            footer: "", // the dialog footer html (mainly used for buttons)
            content: "", 
            modalClass: "fade", // Additional css for ".modal", "fade" for fade effect
            modalDialogClass: "", // Additional css for ".modal-dialog", like "modal-lg" or "modal-sm" for sizing
            dataBackdrop:'static',            
            dataKeyboard:"false",            
            modalBodyClass: 'modal-response',
            modalBodyId: '',
            modalContentClass: '',
            onCreate: null, // Callback, called after the modal was created
            onDispose: null, // Callback, called after the modal was disposed
            onSubmit: null, // Callback of $.showConfirm(), called after yes or no was pressed

            modalHeader: true,
            crossBtn: true,
            modalFooter: true,

            options: null, // The Bootstrap modal options as described here: https://getbootstrap.com/docs/4.0/components/modal/#options
            
            customAlertContent: false,
            customConfirmContent: false,
        
            modalSkeleton: "",
            modalSkeleton1: '<div id="dom-modal-skeleton" class="bg-white skeleton-filter"><div class="custom-skeleton row align-items-center mb-3"><div class="col-12 col-md-4"><div class="skeleton-loader description"></div></div><div class="col-12 col-md-8"><div class="skeleton-loader description"></div></div></div><div class="custom-skeleton row align-items-center mb-3"><div class="col-12 col-md-4"><div class="skeleton-loader description"></div></div><div class="col-12 col-md-8"><div class="skeleton-loader description"></div></div></div><div class="custom-skeleton row align-items-center mb-3"><div class="col-12 col-md-4"><div class="skeleton-loader description"></div></div><div class="col-12 col-md-8"><div class="skeleton-loader description"></div></div></div><div class="custom-skeleton row align-items-center mb-3"><div class="col-12 col-md-4"><div class="skeleton-loader description"></div></div><div class="col-12 col-md-8"><div class="skeleton-loader description"></div></div></div></div>',
            modalSkeleton2: '<div id="dom-modal-skeleton" class="bg-white dom-modal-skeleton"><div class="custom-skeleton row mb-2"><div class="col-12 col-md-3"><div class="skeleton-loader title mt-3"></div></div><div class="col-12 col-md-8"><div class="d-flex"><div class="skeleton-loader mr-3 radio-btn-blk"></div><div class="skeleton-loader radio-btn-blk"></div></div></div></div><div class="custom-skeleton row align-items-center mb-2"><div class="col-12 col-md-3"><div class="skeleton-loader title"></div></div><div class="col-12 col-md-4"><div class="skeleton-loader description"></div></div></div><div class="row bg-white"><div class="col-md-12"><table class="table border border-light table-hover"><thead class="custom-skeleton"><tr class="grid-table-row"><th><div class="skeleton-loader description my-0"></div></th><th><div class="skeleton-loader description my-0"></div></th><th><div class="skeleton-loader description my-0"></div></th><th><div class="skeleton-loader description my-0"></div></th><th class="d-md-table-cell"><div class="skeleton-loader description my-0 ml-md-auto"></div></th></tr></thead><tbody class="custom-skeleton"><tr class="grid-table-row"><th><div class="skeleton-loader description my-0"></div></th><th><div class="skeleton-loader description my-0"></div></th><th><div class="skeleton-loader description my-0"></div></th><th><div class="skeleton-loader description my-0"></div></th><th class="d-md-table-cell"><div class="skeleton-loader description my-0 ml-md-auto"></div></th></tr><tr class="grid-table-row"><th><div class="skeleton-loader description my-0"></div></th><th><div class="skeleton-loader description my-0"></div></th><th><div class="skeleton-loader description my-0"></div></th><th><div class="skeleton-loader description my-0"></div></th><th class="d-md-table-cell"><div class="skeleton-loader description my-0 ml-md-auto"></div></th></tr><tr class="grid-table-row"><th><div class="skeleton-loader description my-0"></div></th><th><div class="skeleton-loader description my-0"></div></th><th><div class="skeleton-loader description my-0"></div></th><th><div class="skeleton-loader description my-0"></div></th><th class="d-md-table-cell"><div class="skeleton-loader description my-0 ml-md-auto"></div></th></tr><tr class="grid-table-row"><th><div class="skeleton-loader description my-0"></div></th><th><div class="skeleton-loader description my-0"></div></th><th><div class="skeleton-loader description my-0"></div></th><th><div class="skeleton-loader description my-0"></div></th><th class="d-md-table-cell"><div class="skeleton-loader description my-0 ml-md-auto"></div></th></tr><tr class="grid-table-row"><th><div class="skeleton-loader description my-0"></div></th><th><div class="skeleton-loader description my-0"></div></th><th><div class="skeleton-loader description my-0"></div></th><th><div class="skeleton-loader description my-0"></div></th><th class="d-md-table-cell"><div class="skeleton-loader description my-0 ml-md-auto"></div></th></tr></tbody></table></div></div></div>',
            modalSkeleton3: '<div class="leftSideNavbar d-flex"><div class="w-25 tabSideBar"><div class="list-group custom-skeleton p-4" id="myTab" role="tablist"><div class="skeleton-loader title w-100"></div><div class="skeleton-loader title w-100"></div></div></div><div class="w-75 rightInfoTable"><div class="tab-content p-4" id="myTabContent"><div class="tab-pane fade show active pt-0" id="link-details" role="tabpanel" aria-labelledby="link-details"><form><div class="custom-skeleton row align-items-center mb-2"><div class="col-12 col-md-4"><div class="skeleton-loader title w-100"></div></div><div class="col-12 col-md-8"><div class="skeleton-loader description w-100"></div></div></div><div class="custom-skeleton row align-items-center mb-2"><div class="col-12 col-md-4"><div class="skeleton-loader title w-100"></div></div><div class="col-12 col-md-8"><div class="skeleton-loader description w-100"></div></div></div><div class="custom-skeleton row align-items-center mb-2"><div class="col-12 col-md-4"><div class="skeleton-loader title w-100"></div></div><div class="col-12 col-md-8"><div class="skeleton-loader description w-100"></div></div></div><div class="custom-skeleton row align-items-center mb-2"><div class="col-12 col-md-4"><div class="skeleton-loader title w-100"></div></div><div class="col-12 col-md-8"><div class="skeleton-loader description w-100"></div></div></div></form></div></div></div></div>',
        
            modalBackButton: false,
            multiContentDialogClass: "",
        }
        Object.assign(this.props, props)
        this.id = "dynamicmodal-" + i
        i++
        this.show()
    }

    Modal.prototype.createContainerElement = function () {
        var self = this;
        this.element = document.createElement("div");
        this.element.id = this.id;
        this.element.setAttribute("class", "modal fade " + this.props.modalClass);
        //this.element.setAttribute("tabindex", "-1");
        this.element.setAttribute("role", "dialog"); 
        this.element.setAttribute("data-backdrop", this.props.dataBackdrop);
        this.element.setAttribute("data-keyboard", this.props.dataKeyboard);
        this.element.setAttribute("aria-labelledby", this.id);
        this.element.innerHTML = '<div class="modal-dialog ' + this.props.modalDialogClass + '" role="document">' +
            '<div class="modal-content '+ this.props.modalContentClass +'"><div class="loader section-loader" id="sectionLoader" style="display:none" data-src="'+LOADER_URL+'"></div>' +
            (this.props.modalHeader == true ? '<div class="modal-header border-bottom-blue">' +
            (this.props.modalBackButton == true ? '<button type="button" onclick="backToPrevModal(this)" class="backModal">Back</button>' : "" ) +
            '<h5 class="modal-title"></h5>' +
            (this.props.crossBtn == true ? '<button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
            '<span aria-hidden="true">&times;</span>' +
            '</button>' : "" ) +
            '</div>' : "" ) +
            '<div id="'+this.props.modalBodyId+'" class="modal-body ' + this.props.modalBodyClass + '"></div>' +
            (this.props.modalFooter == true ? '<div class="modal-footer"></div>' : "" ) +
            '</div>' +
            '</div>'
        document.body.appendChild(this.element)
        this.titleElement = this.element.querySelector(".modal-title")
        this.bodyElement = this.element.querySelector(".modal-body")
        this.footerElement = this.element.querySelector(".modal-footer")
        //chnage body structure
        this.contentElement = this.element.querySelector(".modal-content")

        $(this.element).on('hidden.bs.modal', function () {
            self.dispose()
        })
        if (this.props.onCreate) {
            this.props.onCreate(this)
        }    
    }

    Modal.prototype.show = function () {
        if (!this.element) {
            this.createContainerElement()
            if (this.props.multiContentDialogClass) {
                $('.modal-dialog').addClass(this.props.multiContentDialogClass)
            }
            if (this.props.options) {
                $(this.element).modal(this.props.options)
            } else {
                $(this.element).modal()
            }
        } else {
            $(this.element).modal('show')
        }
        if (this.props.title) {
            $(this.titleElement).show()
            this.titleElement.innerHTML = this.props.title
        } else {
            $(this.titleElement).hide()
        }


        if (this.props.body) {
            $(this.bodyElement).show() 
            this.bodyElement.innerHTML = this.props.body
        } else if (this.props.modalSkeleton) {
            $(this.bodyElement).show() 
            if (this.props.modalSkeleton == "type1") {
                this.bodyElement.innerHTML = this.props.modalSkeleton1
            } else if (this.props.modalSkeleton == "type2") {
                this.bodyElement.innerHTML = this.props.modalSkeleton2
            } else if (this.props.modalSkeleton == "type3") {
                this.bodyElement.innerHTML = this.props.modalSkeleton3
            } else {
                this.bodyElement.innerHTML = this.props.modalSkeleton
            }
        } else {
            $(this.bodyElement).hide()
        }

        if (this.props.footer) {
            $(this.footerElement).show()
            this.footerElement.innerHTML = this.props.footer
        } else {
            $(this.footerElement).hide()
        }

        if (this.props.content) {
            this.contentElement.innerHTML = this.props.content
        } 
    }

    Modal.prototype.hide = function () {
        $(this.element).modal('hide')
    }

    Modal.prototype.dispose = function () {
        $(this.element).modal('dispose')
        document.body.removeChild(this.element)
        if (this.props.onDispose) {
            this.props.onDispose(this)
        }
    }

    $.extend({
        showModal: function (props) {
            return new Modal(props)
        },
        showAlert: function (props) {
            if(props.customAlertContent == true) {
            props.content =  '<div class="alert-container">' +
                '<div class="alert-badge"><span class="popup_title">' + props.title + '</span>' +
                '<div class="alert-badge-paper"></div></div>' +
                '<div class="alert-content">' +
                '<div class="text-left mb-0 font500 mt-4 px-3 ' + props.modalBodyClass + '">' +
                    props.body +
                '</div>' +
                '</div>' +
                '<div class="alert-btn-group">' +
                    '<button type="button" data-dismiss="modal" class="btn btn-outline alert-btn-outline btn-sm" id="btnOk">Ok</button>' +
                '</div>' +
                '</div>'
            }

            else {
                props.footer = '<button type="button" class="btn btn-primary" data-dismiss="modal">OK</button>'
            }
            return this.showModal(props)
        },
        showConfirm: function (props) {
            if(props.customConfirmContent == true) {
            props.content =  '<div class="alert-container">' +
                '<div class="alert-badge"><span class="popup_title">' + props.title + '</span>' +
                '<div class="alert-badge-paper"></div></div>' +
                '<div class="alert-content">' +
                '<div class="text-left mb-0 font500 mt-4 px-3 ' + props.modalBodyClass + '">' +
                    props.body +
                '</div>' +
                '</div>' +
                '<div class="alert-btn-group">' +
                    '<button type="button" data-dismiss="modal" class="btn btn-outline alert-btn-outline  btn-sm" id='+ (props.idNo ? props.idNo :'alertNo') +'>No</button>' +
                    '<button type="button" class="btn alert-btn-filled btn-sm ml-4" id='+ (props.idYes ? props.idYes :'alertYes') +'>Yes</button>' +
                '</div>' +
                '</div>'
            }
            else {
                props.footer = '<button class="btn btn-secondary btn-false">' + props.textFalse + '</button><button class="btn btn-primary btn-true">' + props.textTrue + '</button>'
                /*props.onCreate = function (modal) {
                    $(modal.element).on("click", ".btn", function (event) {
                        event.preventDefault()
                        modal.hide()
                        modal.props.onSubmit(event.target.getAttribute("class").indexOf("btn-true") !== -1)
                    })
                }*/
            }
            
            return this.showModal(props)
        }
    })

    // polyfill for Object.assign
    if (typeof Object.assign !== 'function') {
        Object.defineProperty(Object, "assign", {
            value: function assign(target, varArgs) {
                if (target == null) {
                    throw new TypeError('Cannot convert undefined or null to object')
                }
                var to = Object(target)
                for (var index = 1; index < arguments.length; index++) {
                    var nextSource = arguments[index]

                    if (nextSource != null) {
                        for (var nextKey in nextSource) {
                            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                                to[nextKey] = nextSource[nextKey]
                            }
                        }
                    }
                }
                return to
            },
            writable: true,
            configurable: true
        })
    }

}(jQuery))

function onDomModalHide(ele) {
    var popID = $(ele).parents('.modal').attr('id')
    $('#'+popID).modal('hide');
}

function alertPopupNew(msg, type, location, title_message, modalsize) {
    $.showAlert({
        title: title_message,
        modalClass:'alert-modal ' + type ,  
        body: msg, 
        modalDialogClass:'modal-dialog-centered '+modalsize,
        modalBodyClass:'modal-response p-0 overflow-visible',
        customAlertContent:true
    })
    if (typeof location !== 'undefined' && location != "") {
        $(document).one('click', '#confirmYes', function (e) {
            e.preventDefault();
            window.location.href = location;
        });
    }
}

function confirmPopupNew(msg, type, location, title_message, idNoVal, idYesVal, modalsize) {
    $.showConfirm({
        title: title_message,
        modalClass:'alert-modal ' + type ,  
        body: msg, 
        idNo: idNoVal,
        idYes: idYesVal,
        modalDialogClass:'modal-dialog-centered '+modalsize,
        modalBodyClass:'modal-response p-0 overflow-visible',
        customConfirmContent:true
    })
    if (typeof location !== 'undefined' && location != "") {
        $(document).one('click', '#confirmYes', function (e) {
            e.preventDefault();
            window.location.href = location;
        });
    }
}
