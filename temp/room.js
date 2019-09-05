//CSS 
var style = "table.classMap {border: 1px solid black;border-collapse: collapse;}table.classMap td {padding: 10px;border: 1px solid black;}table.classMap td.filled {background-color: grey;}";
document.body.innerHTML += "<style>"+style+"</style>";
class Room {
	constructor(rows, cols, roomName, seatsFilled) {
		this.rows = rows; //Number of rows in room
		this.cols = cols; //Number of Columns in room
		this.roomName = roomName; //Number of Columns in room
		var dt = new Array(rows);
		for (var i = 0; i < dt.length; i++) {
			dt[i] = new Array(cols);
			for (var j = 0; j < cols; j++) {
				if (seatsFilled[i] && seatsFilled[i][j]) {
					dt[i][j] = "X";
				} else {
					dt[i][j] = "";
				}
			}
		}
		this.seatMap = dt; // Seatmap of room showing filled seats and empty seats in the ofrm of 2D array
	}
	createRoomMap() {
		var html = "<table class='classMap'>";
		for (var i = 0; i < this.rows; i++) {
			html += "<tr>";
			for (var j = 0; j < this.cols; j++) {
				if (this.seatMap[i] && this.seatMap[i][j] && this.seatMap[i][j] != "") {
					html += "<td class='filled'></td>";
				} else {
					html += "<td></td>";
				}
			}
			html += "</tr>";
		}
		html += "</table><div><b>Room Number: </b>"+this.roomName+"</div></br>";
		document.body.innerHTML += html;
	}
}

var roomsObj = {}; //Final rooms Object

// This temp array will be replaced by values from input fields
var temp = [{
	"r": 2,
	"c": 3,
	"ar": {
		1: {
			2: 1
		}
	},
	"rn": "1A"
}, {
	"r": 4,
	"c": 7,
	"ar": {
		3: {
			1: 1,
			4: 1
		},
		2: {
			5: 1,
			6: 1
		}
	},
	"rn": "2B"
}];
// Add room objects in parent object 
temp.forEach(function(item, index) {
	roomsObj[item.rn] = new Room(item.r, item.c, item.rn, item.ar);
});
console.log(roomsObj);

// Print Rooms' seatmap
for (var roomName in roomsObj) {
	if (roomsObj.hasOwnProperty(roomName)) {
		var room = roomsObj[roomName];
		room.createRoomMap();
	}
}
