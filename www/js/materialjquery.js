 $(document).ready(function() {
 	$('select').material_select();
 	
 	$('select').on('change', function(){
 		// $("#close").show();
 		 
 		$(".send").css('display', 'block');

 		$('#short-des').css('display', 'block');



 	});
 	$('.close').on('click', function() {
 		$('.send').css('display', 'none');
 		
 		$('#short-des').css('display', 'none');
 	});
 	
 	$(".button-collapse").sideNav({
 		draggable: true
 	});
 });
