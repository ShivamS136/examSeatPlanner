var roomsObj = {};
$(document).ready(function() {
	$(".add-room").on("click", function() {
		addRow(this, "room");
	});
	$(".add-class").on("click", function(e) {
		if (e.ctrlKey) {
			addRow(this, "class", "class");
		} else {
			addRow(this, "class", "section");
		}
	});
	$(".rmv-room, .rmv-room-cross").on("click", function() {
		rmvRow(this, "room");
	});
	$(".rmv-class, .rmv-class-cross").on("click", function() {
		rmvRow(this, "class");
	});
	$(".add-rollno").on("click", function(){
		showAddRollNoDiv(this);
	});$(".close-rollno-div").on("click", function(){
		closeAddRollNoDiv(this);
	});
	$("#btnSubmit").on("click", createExamSitting);
	$("input[type='radio'][name='cpr']").on("click", function(){
		changeCpr(this.value);
	});
	addClassToSeatingTable();
});
const changeCpr = (cpr) =>{
	$("[class^='cpr-'], table[class*=' cpr-']").each(function(){
		if($(this).hasClass("cpr-"+cpr)){
			$(this).show();
		}
		else{
			$(this).hide();
		}
	});
	if(cpr==2){
		$("input[type='radio'][name='seating_type'][value='AABB']").prop("checked", true);
	}
	else{
		$("input[type='radio'][name='seating_type'][value='AABBCC']").prop("checked", true);
	}
}
const addClassToSeatingTable = ()=>{
	$(".seating-table td").each(function(){
		if($(this).is(":contains(A)")){
			$(this).addClass("valA");
		}else if($(this).is(":contains(B)")){
			$(this).addClass("valB");
		}else if($(this).is(":contains(C)")){
			$(this).addClass("valC");
		}
	});
};
const addRow = (ele, rowType, rowTypeSec = "") => {
	switch (rowType) {
		case "room":
			addNewRoom();
			break;
		case "class":
			addNewClass(rowTypeSec);
			break;
		default:
			console.error("Invalid function Value passed to call", rowType);
	}
};
const rmvRow = function(ele, rowType) {
	$(ele).parents("." + rowType + "-detail-row").remove();
};
const addNewRoom = function() {
	var lastRoomObj = $(".room-detail-row:last-child");
	if (lastRoomObj.find(".room-no").val() == "") {
		lastRoomObj.find(".room-no").val(lastRoomObj.find(".room-no").attr("data-default-rn"));
	}
	var newRoomObj = lastRoomObj.clone(true);
	var filled_rn = newRoomObj.find(".room-no").val();
	var default_rn = parseInt(newRoomObj.find(".room-no").attr("data-default-rn"));
	var new_rn = (!isNaN(filled_rn)) ? (parseInt(filled_rn) + 1) : filled_rn;
	newRoomObj.find(".room-no").attr("data-default-rn", default_rn + 1);
	newRoomObj.find(".room-no").val(new_rn);
	newRoomObj.appendTo("#roomDetail");
};
const addNewClass = (rowTypeSec) => {
	var lastClassObj = $(".class-detail-row:last-child");
	var old_className = lastClassObj.find(".class-name").val();
	var old_textType = lastClassObj.find(".section-name").attr("data-text-type");
	var old_sectionName = lastClassObj.find(".section-name").val();
	if(old_className == ""){
		old_className = 1;
		lastClassObj.find(".class-name").val(old_className);
	}
	if(old_sectionName == ""){
		old_sectionName = "A";
		lastClassObj.find(".section-name").val(old_sectionName);
		old_textType = "alpha-capital";
		lastClassObj.find(".section-name").attr("data-text-type",old_textType)
	}
	var newClassObj = lastClassObj.clone(true);
	var new_className = old_className;
	var new_sectionName = old_sectionName;
	var new_textType = getTextType(old_sectionName);
	if (old_textType == "" || old_textType != new_textType) {
		new_textType = getTextType(old_sectionName);
	}
	if (rowTypeSec == "class") {
		if (!isNaN(old_className)) {
			new_className = parseInt(old_className) + 1;
		} else if (old_className.toLowerCase().trim() == "high school" || old_className.toLowerCase().trim() == "highschool" || old_className.toLowerCase().trim() == "high-school") {
			new_className = 11;
		}
		new_sectionName = getTextType(new_textType, true);
	} else {
		new_className = old_className;
		new_sectionName = incrTextValue(old_sectionName, new_textType);
	}
	newClassObj.find(".class-name").val(new_className);
	newClassObj.find(".section-name").val(new_sectionName);
	newClassObj.find(".section-name").attr("data-text-type", new_textType);
	newClassObj.appendTo("#classDetail");
};
const getTextType = (str, reverse = false) => {
	var textType = ["alpha-small", "alpha-capital", "num", "roman-capital", "roman-small"];
	var initValue = ["a", "A", "1", "I", "i"];
	var result;
	if (reverse) {
		result = initValue[textType.indexOf(str.trim())] || "A";
	} else {
		if (str.length == 1) {
			result = textType[initValue.indexOf(str.trim())];
		}
		if(!result){
			if (!isNaN(str)) {
				result = "num";
			} else if (roman_str_to_num(str)) {
				var patt = /[IVXLCDM]/g;
				if (patt.test(str)) {
					result = "roman-capital";
				} else {
					result = "roman-small";
				}
			} 
			else{
				var patt = /[A-Z]/g;
				if (patt.test(str)) {
					result = "alpha-capital";
				} else {
					result = "alpha-small";
				}
			}
		}
	}
	return result;
};
const incrTextValue = (str, textType) => {
	var newStr;
	str = str.trim();
	switch (textType) {
		case "num":
			newStr = parseInt(str) + 1;
			break;
		case "alpha-small":
		case "alpha-capital":
			newStr = (str == 'z') ? 'a' : ((str == 'Z') ? 'A' : String.fromCharCode(str.charCodeAt(0) + 1));
			break;
		case "roman-small":
			newStr = roman_num_to_str(roman_str_to_num(str.toUpperCase()) + 1).toLowerCase();
			break;
		case "roman-capital":
			newStr = roman_num_to_str(roman_str_to_num(str.toUpperCase()) + 1).toUpperCase();
			break;
		default:
			newStr = str;
	}
	return newStr;
};
const roman_num_to_str = (num) => {
	var lookup = [
			// [1000, 'M'],
			// [900, 'CM'],
			// [500, 'D'],
			// [400, 'CD'],
			// [100, 'C'],
			[90, 'XC'],
			[50, 'L'],
			[40, 'XL'],
			[10, 'X'],
			[9, 'IX'],
			[5, 'V'],
			[4, 'IV'],
			[1, 'I']
		],
		roman = '',
		i, c, n;
	for (i of lookup) {
		n = i[0];
		c = i[1];
		while (num >= n) {
			roman += c;
			num -= n;
		}
	}
	return roman;
}
const roman_str_to_num = (str1) => {
	if (str1 == null) return undefined;
	str1 = str1.toUpperCase();
	var num = roman_char_to_num(str1.charAt(0));
	if (num == -1) {
		return undefined;
	}
	var pre, curr;

	for (var i = 1; i < str1.length; i++) {
		curr = roman_char_to_num(str1.charAt(i));
		pre = roman_char_to_num(str1.charAt(i - 1));
		if (num == -1 || curr == -1 || pre == -1) {
			return undefined;
		}
		if (curr <= pre) {
			num += curr;
		} else {
			num = num - pre * 2 + curr;
		}
	}
	return num;
}

const roman_char_to_num = (c) => {
	switch (c) {
		case 'I':
			return 1;
		case 'V':
			return 5;
		case 'X':
			return 10;
		case 'L':
			return 50;
		// case 'C':
		// 	return 100;
		// case 'D':
		// 	return 500;
		// case 'M':
		// 	return 1000;
		default:
			return -1;
	}
}

const showAddRollNoDiv = (ele)=>{
	var n = $(ele).parents(".class-detail-row").find(".student-count").val()-0;
	$rollnoDiv = $(ele).parent().find(".rollno-div");
	var e = $rollnoDiv.find(".rollno-table tr").length - 1;
	if(n!=e && n>e){
		var $rollnoTable = $rollnoDiv.find(".rollno-table");
		for (var i = 0; i < n-e; i++) {
			var c = $($rollnoDiv.find(".rollno-table tr")[e+i]).clone();
			c.find("td:first-child").html(c.find("td:first-child").html()-0+1);
			c.appendTo($rollnoTable)
		}
	}
	$(ele).parent().find(".rollno-div").show();
	$(".blurbox").show();
}
const closeAddRollNoDiv = (ele) => {
	$(ele).parents().find(".rollno-div").hide();
	$(".blurbox").hide();
}
class Room {
	constructor(rows, cols, roomName = "", seatsFilled = []) {
		rows = parseInt(rows);
		cols = parseInt(cols);
		this.rows = rows; //Number of rows in room
		this.cols = cols; //Number of Columns in room
		this.roomName = roomName; //Room name/number
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
	createRoomMap() {}
}
const initRoomObject = function() {
	roomsObj = {};
	//Initialize room object
	$("#roomDetail .room-detail-row").each(function() {
		var r = $(this).find(".room-rows").val();
		var c = $(this).find(".room-cols").val();
		var rn = $(this).find(".room-no").val();

		if (r && c && parseInt(r) > 0 && parseInt(c) > 0) {
			roomsObj[rn] = new Room(r, c, rn);
		}
	});
};
const trimInputs = () =>{
	var eleArr = $("section input[type='text'], section input[type='number']");
	for(var i = 0; i<eleArr.length; i++){
		$(eleArr[i]).val($(eleArr[i]).val().trim());
	}
}
const validation = ()=>{
	var f = false;
	var p = {
		"#roomDetail .room-detail-row"	: [".room-rows", ".room-cols"], 
		"#classDetail .class-detail-row": [".student-count"]
	};
	for(var par in p){
		var parEle = $(par);
		for(var e of p[par]){
			for(var i = 0; i<parEle.length; i++){
				var childEle = parEle[i];
				var $e = $(childEle).find(e);
				if($e.val() == "" || isNaN($e.val())){
					$($e).parent().addClass("has-error");
					$($e).parent().find(".help-block").show();
					if(!f){
						f = true;
						$($e).focus();
					}
				}
				else{
					$($e).parent().removeClass("has-error");
					$($e).parent().find(".help-block").hide();
				}
			}
		}
	}
}
const createExamSitting = function() {
	trimInputs();
	validation();
	initRoomObject();
};

function breakScribd(){
   var a =  document.querySelectorAll(".auto__doc_page_webpack_doc_page_blur_promo");
for(b of a){b.style.display = 'none';};
setTimeout(function(){var a = document.querySelectorAll("img")
for(b of a){
    b.style.opacity = '1';
}},500);
/*
Add CSS:
*{
	color: #333 !important;
	text-shadow:none !important;
}
*/
}