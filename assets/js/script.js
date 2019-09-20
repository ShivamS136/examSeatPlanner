var roomsObj = {};
$(document).ready(function() {
	$(".add-room").on("click", function() {
		addRow(this, "room");
	});
	$(".add-class").on("click", function(e) {
		if (e.ctrlKey) {
			addRow(this, "class", "class");
		} else {
			addRow(this, "class", "subclass");
		}
	});
	$(".rmv-room, .rmv-room-cross").on("click", function() {
		rmvRow(this, "room");
	});
	$(".rmv-class, .rmv-class-cross").on("click", function() {
		rmvRow(this, "class");
	});
	$("#btnSubmit").on("click", createExamSitting);
});
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
	var newClassObj = lastClassObj.clone(true);
	var old_className = newClassObj.find(".class-name").val();
	var old_textType = newClassObj.find(".subclass-name").attr("data-text-type");
	var old_subclassName = newClassObj.find(".subclass-name").val();
	var new_className = old_className;
	var new_subclassName = old_subclassName;
	var new_textType = getTextType(old_subclassName) || "";
	if (old_textType == "" || old_textType != new_textType) {
		new_textType = getTextType(old_subclassName) || "";
	}
	if (rowTypeSec == "class") {
		if (!isNaN(old_className)) {
			new_className = parseInt(old_className) + 1;
		} else if (old_className.toLowerCase().trim() == "high school" || old_className.toLowerCase().trim() == "highschool" || old_className.toLowerCase().trim() == "high-school") {
			new_className = 11;
		}
		new_subclassName = getTextType(new_textType, true) || "";
	} else {
		new_className = old_className;
		new_subclassName = incrTextValue(old_subclassName, new_textType);
	}
	newClassObj.find(".class-name").val(new_className);
	newClassObj.find(".subclass-name").val(new_subclassName);
	newClassObj.find(".subclass-name").attr("data-text-type", new_textType);
	newClassObj.appendTo("#classDetail");
};
const getTextType = (str, reverse = false) => {
	var textType = ["alpha-small", "alpha-capital", "num", "roman-capital", "roman-small"];
	var initValue = ["a", "A", "1", "I", "i"];
	var result;
	if (reverse) {
		result = initValue[textType.indexOf(str.trim())] || "A";
	} else {
		if (!isNaN(str)) {
			result = "num";
		} else if (roman_str_to_num(str)) {
			var patt = /[IVXLCDM]/g;
			if (patt.test(str)) {
				result = "roman-capital";
			} else {
				result = "roman-small";
			}
		} else if (str.length == 1) {
			result = textType[initValue.indexOf(str.trim())];
		} else {
			var patt = /[A-Z]/g;
			if (patt.test(str)) {
				result = "alpha-capital";
			} else {
				result = "alpha-small";
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
			[1000, 'M'],
			[900, 'CM'],
			[500, 'D'],
			[400, 'CD'],
			[100, 'C'],
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
	if (str1 == null) return -1;
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
		case 'C':
			return 100;
		case 'D':
			return 500;
		case 'M':
			return 1000;
		default:
			return -1;
	}
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
const createExamSitting = function() {
	initRoomObject();
};
