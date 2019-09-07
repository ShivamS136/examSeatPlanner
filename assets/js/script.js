var roomsObj = {};
$(document).ready(function() {
	$(".add-room").on("click", addNewRoom);
	$(".rmv-room, .rmv-room-cross").on("click",function(){
		$(this).parents(".room-detail-row").remove();
	});
	$("#btnSubmit").on("click",createExamSitting);
});
const addNewRoom = function(){
	var lastRoomObj = $(".room-detail-row:last-child");
	if(lastRoomObj.find(".room-no").val() == ""){
		lastRoomObj.find(".room-no").val(lastRoomObj.find(".room-no").attr("data-default-rn"));
	}
	var newRoomObj = lastRoomObj.clone(true);
	var filled_rn = newRoomObj.find(".room-no").val();
	var default_rn = parseInt(newRoomObj.find(".room-no").attr("data-default-rn"));
	var new_rn = (!isNaN(filled_rn)) ? (parseInt(filled_rn)+1) : filled_rn;
	newRoomObj.find(".room-no").attr("data-default-rn",default_rn+1);
	newRoomObj.find(".room-no").val(new_rn);
	newRoomObj.appendTo("#roomDetail");
};
class Room {
	constructor(rows, cols, roomName="", seatsFilled=[]) {
		rows = parseInt(rows);
		cols = parseInt(cols);
		this.rows = rows; //Number of rows in room
		this.cols = cols; //Number of Columns in room
		this.roomName = roomName; //Number of Columns in room
		var dt = new Array(rows);
		for (var i = 0; i < dt.length; i++) {
			dt[i] = new Array(cols);
			for (var j = 0; j < cols; j++) {
				if (seatsFilled[i] && seatsFilled[i][j]) {
					dt[i][j] = "X-X";
				} else {
					dt[i][j] = "";
				}
			}
		}
		this.seatMap = dt; // Seatmap of room showing filled seats and empty seats in the ofrm of 2D array
	}
	createRoomMap() {
	}
}
const initRoomObject = function(){
	roomsObj = {};
	//Initialize room object
	$("#roomDetail .room-detail-row").each(function(){
		var r 	= $(this).find(".room-rows").val();
		var c 	= $(this).find(".room-cols").val();
		var rn	= $(this).find(".room-no").val();
		
		if(r && c && parseInt(r)>0 && parseInt(c)>0){
			roomsObj[rn] = new Room(r, c, rn);
		}
	});
};
const createExamSitting = function(){
	initRoomObject();	
};
