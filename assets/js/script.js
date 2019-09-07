var $roomDetail = $("#roomDetail");
$(document).ready(function() {
	$(".add-room").on("click", function(){
		$(".room-detail-row:last-child").clone(true).appendTo($roomDetail);
	});
	$(".rmv-room, .rmv-room-cross").on("click",function(){
		$(this).parents(".room-detail-row").remove();
	});
});
