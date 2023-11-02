    $(document).off("click", "#leftList li").on("click", "#leftList li", function (e) {
        const text = $(this).html();
        const value = $(this).val();
        const dataId = $(this).data('id');
        $('#rightList').append($('<li data-id=' + dataId + ' value=' + value + '>' + text + '</li>'));
        $(this).addClass('deactive d-none');
        listBlockBlank('left');
    });

    $(document).off("click", "#rightList li").on("click", "#rightList li", function (e) {
        var rightDataId = $(this).data("id");
        $("#leftList li").each(function () {
            var listID = $(this).data('id');
            if (rightDataId.includes(listID)) {
                $(this).removeClass('deactive d-none');
            }
            var delete_id = parseInt(rightDataId.split("_")[1]);
            delete final_excluded_users_list[delete_id];
        });
        $(this).remove();
        listBlockBlank('right');
    });

    function listBlockBlank(ele) {
      $('.listBox').each(function () {

        if (ele == 'left') {
          if ($(this).find('li:not(.deactive)').length == 0) {
            $(this).parents('.listParent').addClass('noData');
          }
          else {
            $(this).parents('.listParent').removeClass('noData');
          }
        }
        else {
          if ($(this).find('li').length == 0) {
            $(this).parents('.listParent').addClass('noData');
          }
          else {
            $(this).parents('.listParent').removeClass('noData');
          }
        }


      })
    }
    $(document).ready(function () {
      // $('#rightSearch').on('input', function (event) {
      //   const filterValue = $(this).val().toLowerCase();
      //   $('#rightList').find('li').each(function () {
      //     $(this).toggle($(this).text().toLowerCase().includes(filterValue));
      //   }); 
      // });
      $("#rightSearch").on("keyup", function (event) {
        if(event.keyCode == 13) {
          const filterValue = $(this).val().toLowerCase();
          $('#rightList').find('li').each(function () {
            $(this).toggle($(this).text().toLowerCase().includes(filterValue));
          }); 
          if ($(".listParentRIght li:visible").length === 0 || $(".listParentRIght ul li").length === 0){
            $(this).parents('.listParentRIght').addClass('noData');
          }
          else {
            $(this).parents('.listParentRIght').removeClass('noData');
          }
        }
      });

      $("#leftSearch").on("keyup", function (event) {
            // Get the search query from the input
            if(event.keyCode == 13) {
                $("#rightSearch").val("");
                $("#rightSearch").trigger("keyup");
                var searchQuery = $(this).val();
                var old_left_Search  = $(".old_left_Search").val()
                if(typeof old_left_Search == "undefined"){
                    old_left_Search = ""
                }
                // Perform the AJAX request
                var allocation_method = $('input[name="checkin_checkout_allocation_method"]:checked').val()
                var old_allocation_method = $("#old_allocation_method").val();
                if(searchQuery!=old_left_Search){
                    $('#leftList').html("");
                    get_user_list_permission_or_team_wise(allocation_method,old_allocation_method,final_excluded_users_list,1,"search")
                }
            }
        });
    });

/*
    var dataURL = 'https://jsonplaceholder.typicode.com/users/'
    $(document).ready(function () {
//       var itemsPerPage = 5;
//       var currentPage = 1;
//       var isLoading = false;
//       var totalRecords = 10

//       function loadItems(page) {
//         $.ajax({
//           url: dataURL, // URL to fetch additional items
//           method: 'GET',
//           data: { _page: page, _limit: itemsPerPage },
//           beforeSend: function () {
//             isLoading = true;
//             // Show loading spinner or message within the container
//             $('#leftList').append('<div class="dataLoading py-2">Loading...</div>');
//           },
//           success: function (data) {
//             // Remove loading indicator
//             $('.dataLoading').remove();
//             // Append the new items to the container
//             $.each(data, function (index, item) {
//               const $dataItem = $(`<li data-id="transfer_${item.id}">`);
//               $dataItem.html("<span class='transfer-name font-weight-bold text-dark'>" + item.name + "</span><span class='transfer-email text-muted'>" + item.email + "</span>");
// //              $('#leftList').append($dataItem);

//             });

//             isLoading = false;
//             currentPage++;
//             listBlockBlank()
//           },
//           error: function () {
//             // Handle error
//             isLoading = false;
//             $('.dataLoading').remove(); // Remove loading indicator on error
//           }
//         });
//       }

      // Initial load
      // loadItems(currentPage);

      // Load more on div scroll

//      $('#leftList').scroll(function () {
//        if ($("#leftList li").length < totalRecords) {
//          var container = $(this);
//          if (!isLoading && container.scrollTop() + container.innerHeight() >= container[0].scrollHeight - 100) {
//            loadItems(currentPage);
//          }
//        }
//      });




      // Search functionality
//      $leftSearch.on('input', function () {
//        const filterValue = $(this).val().toLowerCase();
//        $('#leftList').find('li').each(function () {
//          $(this).toggle($(this).text().toLowerCase().includes(filterValue));
//        });
//      });







        // $('#searchInput').keypress(function(event) {
        //   if (event.which === 13) { 
        //     performSearch();
        //   }
        // });

      // function performSearch() {
      //   var searchTerm = $('#searchInput').val();
      //   var apiUrl = 'https://jsonplaceholder.typicode.com/users/search?query=' + searchTerm;

      //   $.ajax({
      //     url: apiUrl,
      //     method: 'GET',
      //     success: function(data) {
      //       console.log('API Response:', response);
      // $.each(data, function(index, item) {
      //     const $dataItem = $(`<li data-id="transfer_${item.id}">`);
      //     $dataItem.html("<span class='transfer-name font-weight-bold text-dark'>" + item.name + "</span><span class='transfer-email text-muted'>" + item.email + "</span>");
      //     $leftList.append($dataItem);                 
      //   });
      //     },
      //     error: function(error) {

      //       console.error('API Error:',  );
      //     }
      //   });
      // }

    });
    */