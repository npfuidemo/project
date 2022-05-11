$('#detail-popup').on('shown.bs.modal', function () {
    CKEDITOR.replace('editor1');
 });
 $('.grid-table table .dropdown').on('show.bs.dropdown', function () {
    $('.grid-table [data-sticky=true] table[data-last-col=true] td:last-child').css('position', 'static');
 });
 $('.grid-table table .dropdown').on('hide.bs.dropdown', function () {
    $('.grid-table [data-sticky=true] table[data-last-col=true] td:last-child').css('position', 'sticky');
 });

 if ($(window).width() < 1299) {
    $('.owl-carousel').removeClass('grid-col');
    $('.owl-carousel').owlCarousel({
       // loop: true,
       margin: 15,
       stagePadding: 0,
       nav: true,
       navigation: true,
       autoWidth: false,
       navText: [
          "<i class='fa fa-angle-left'></i>",
          "<i class='fa fa-angle-right'></i>"
       ],
       autoplay: false,
       responsiveClass: true,
       autoplayHoverPause: true,
       dots: false,
       responsive: {
          0: {
             items: 2
          },
          600: {
             items: 4
          },
          1000: {
             items: 5
          },
          1300: {
             items: 7
          }
       },
    });
 }

 $(document).ready(function () {
     if('[data-toggle="popover"]'){
         $('[data-toggle="popover"]').popover();
     }
     if('[data-toggle="tooltip"]'){
         $('[data-toggle="tooltip"]').tooltip();
     }

     $('.grid-table table thead input[type="checkbox"], #mob-table-head').change(function (event) {
        if (event.target.checked) {
           $('.grid-table table tbody input[type="checkbox"]').prop('checked', true);
           $('.grid-table table tbody').find('.grid-table-row').addClass('has-selected');
        } else {
           $('.grid-table table tbody input[type="checkbox"]').prop('checked', false);
           $('.grid-table table tbody').find('.grid-table-row').removeClass('has-selected');
        }
     });
     $('.grid-table table tbody input[type="checkbox"]').change(function (event) {
        if (event.target.checked) {
           $(this).closest('.grid-table-row').addClass('has-selected');
        } else {
           $(this).closest('.grid-table-row').removeClass('has-selected');
           $('.grid-table table thead input[type="checkbox"], #mob-table-head').prop('checked', false);
        }
        const all_checkboxes = $('.grid-table table tbody input[type="checkbox"]');
        if (all_checkboxes.length === all_checkboxes.filter(":checked").length) {
           $('.grid-table table thead input[type="checkbox"], #mob-table-head').prop('checked', true);
        }
     });
     if ($(window).width() > 768) {

         const colLeft = $('[data-sticky="true"] table').data('col-left');
         $('[data-sticky="true"] table[data-colfix="2"] td:nth-child(2), [data-sticky="true"] table[data-colfix="2"] th:nth-child(2)').css('left', colLeft);
         $('[data-sticky="true"] table[data-colfix="2"] th:nth-child(1), [data-sticky="true"] table[data-colfix="2"] td:nth-child(1)').css('width', colLeft);
         $('[data-sticky="true"] table[data-colfix="2"] th:nth-child(1)').css('min-width', colLeft);

     }
 });

 function customFile() {
    $('input[type="file"]').change(function (e) {
       var fileName = e.target.files[0].name;
       $('.chat-file  .file-name').text(fileName);
       $('.chat-file').removeClass('d-none');
    });
 };

 $(".fileBrowseCustom").on("click", customFile);
 $(".chat-area .remove-file").on("click", function () {
    $('.chat-file').addClass('d-none');
    $('.chat-area input[type="file"]').val('');
    $('.file-name').text('');
 });