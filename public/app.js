const toCurrency = price => {
    return new Intl.NumberFormat('ru-RU', {
      currency: 'rub',
      style: 'currency'
    }).format(price)
  }
document.querySelectorAll('.price').forEach(node => {
    node.textContent = toCurrency(node.textContent)
  })


  M.Tabs.init(document.querySelectorAll('.tabs'));
  M.Sidenav.init(document.querySelectorAll('.sidenav'));

  M.FormSelect.init(document.querySelectorAll('select'));
  
  $(document).ready(function(){
    $('input.autocomplete').autocomplete({
            max:10,
            minLength:1,
            data: function(req) {ajax({
                type: 'GET',
                url: '/records/searchacpl/',
                data: req,
                success: function(response) {
                  var recordsArray = res;
                  var recordsList = {};
                  for (var i = 0; i < recordsArray.length; i++) {
                    recordsList[recordsArray[i].name] = recordsList[i];
                  }
                  console.log(recordsList)
                }

          })
        }
})
})
    
    // $('input.autocomplete').autocomplete({
    //   // data: {
    //   //   "Apple": null,
    //   //   "Microsoft": null,
    //   //   "Google": 'https://placehold.it/250x250'
    //   // },
    //   data: function(req,res){
    //     $.ajax({
    //       url:'/records/searchacpl/',
    //       type: 'GET',
    //       success: function(response) {
    //         console.log(response)
    //       },
    //       error: function(err){
    //         console.log(err.status)
    //       }
    //     })
    //   },
    //   // minLength:1,
    //   // // select: function(event,ui){
    //   // //   if(ui.item){
    //   // //     $('input.autocomplete').text(ui.item.label)
    //   // //   }
    //   // // }
    // });
  
  //  $(function(){
  //    $('input.autocomplete').autocomplete({
  //     data: function(req,res){
  //       $.ajax({
  //         url:'/records/searchacpl',
  //         dataType: "jsonp",
  //         type: 'GET',
  //         data: req,
  //         success: function(data) {
            
  //         },
  //         error: function(err){
  //           console.log(err.status)
  //         }
  //       })
  //     },
  //     minLength:1,
  //     select: function(event,ui){
  //       if(ui.item){
  //         $('input.autocomplete').text(ui.item.label)
  //       }
  //     }
  //   })
  // })
 
 
 
 
  // $(document).ready(function(){
  //   $('input.search').autocomplete({
  //     $.ajax({
  //       url: "/records/searchacpl",
  //       type: 'get',
  //       dataType: "json",
  //       data: {
  //        search: request.term
  //       },
  //       success: function( data ) {
  //        response( data );
  //       }
  //      })
  // });
  