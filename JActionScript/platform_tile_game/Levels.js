var levelBuilder =
{
	straightLine: function (x1, y1, x2, y2)
	{
		var result = [];
		
		for(var x = x1; x <= x2; x++)
			for(var y = y1; y <= y2; y++)
				result.push([x, y]);
				
		return result;
	}
};

var level1 =
[
	[0,  3],
	[1,  3],
	[2,  3],
	[3,  3],
	[4,  3],	
	[5,  3],
	[6,  3, 0, 5],
	[7,  3, 5, 10],
	[8,  3, 10, 15],
	[9,  3, 15, 20],
	//[6,  2],
	
	[9,  4],
	[10, 4, 0, 5],
	[11, 4, 5, 10],
	[12, 4, 10, 15],
	[13, 4, 15, 20],
	
	[13, 5],
	[14, 5, 0, 5],
	[15, 5, 5, 10],
	[16, 5, 10, 15],
	[17, 5, 15, 20],
	
	[17, 6],
	[18, 6, 0, 5],
	[19, 6, 5, 10],
	[20, 6, 10, 15],
	[21, 6, 15, 20],
	
	[21, 7],
	[22, 7, 0, 5],
	[23, 7, 5, 10],
	[24, 7, 10, 15],
	[25, 7, 15, 20],

	[25, 8],
	[26, 8, 0, 5],
	[27, 8, 5, 10],
	[28, 8, 10, 15],
	[29, 8, 15, 20],
	
	[29, 9],
	[30, 9, 0, 5],
	[31, 9, 5, 10],
	[32, 9, 10, 15],
	[33, 9, 15, 20],
	
	[33, 10],
	[34, 10, 0, 5],
	[35, 10, 5, 10],
	[36, 10, 10, 15],
	[37, 10, 15, 20]
];

var level2 =
[
	[0,  3],
	[1,  3],
	[2,  3],
	[3,  3],
	[4,  3],	
	[5,  3],
	[6,  3, 0, 5],
	[7,  3, 5, 10],
	[8,  3, 10, 15],
	[9,  3, 15, 20],
	//[6,  2],
	
	[9,  4],
	[10, 4, 0, 5],
	[11, 4, 5, 10],
	[12, 4, 10, 15],
	[13, 4, 15, 20],
	
	[13, 5],
	[14, 5, 0, 5],
	[15, 5, 5, 10],
	[16, 5, 10, 15],
	[17, 5, 15, 20],
	
	[17, 6],
	[18, 6, 0, 5],
	[19, 6, 5, 10],
	[20, 6, 10, 15],
	[21, 6, 15, 20],
	
	[21, 7],
	[22, 7, 0, 5],
	[23, 7, 5, 10],
	[24, 7, 10, 15],
	[25, 7, 15, 20],
	
	[25,  8],
	[26,  8],
	[27,  8],
	
	[27,  7, 20, 15],
	[28,  7, 15, 10],
	[29,  7, 10, 5],
	[30,  7, 5, 0],

	[31,  7],
	[31,  6, 20, 15],
	[32,  6, 15, 10],
	[33,  6, 10, 5],
	[34,  6, 5, 0],

	[35,  6],
	[35,  5, 20, 15],
	[36,  5, 15, 10],
	[37,  5, 10, 5],
	[38,  5, 5, 0],

	[39,  5],
	[39,  4, 20, 15],
	[40,  4, 15, 10],
	[41,  4, 10, 5],
	[42,  4, 5, 0],

	[43,  4],
	[43,  3, 20, 15],
	[44,  3, 15, 10],
	[45,  3, 10, 5],
	[46,  3, 5, 0]
];

var level3 =
[
	[0,  3],
	[1,  3],
	[2,  3],
	[3,  3],
	[4,  3],	
	[5,  3],
	[6,  3, 0, 5],
	[7,  3, 5, 10],
	[8,  3, 10, 15],
	[9,  3, 15, 20],
	//[6,  2],
	
	[9,  4],
	[10, 4, 0, 5],
	[11, 4, 5, 10],
	[12, 4, 10, 15],
	[13, 4, 15, 20],
	
	[13, 5],
	[14, 5, 0, 5],
	[15, 5, 5, 10],
	[16, 5, 10, 15],
	[17, 5, 15, 20],
	
	[17, 6],
	[18, 6, 0, 5],
	[19, 6, 5, 10],
	[20, 6, 10, 15],
	[21, 6, 15, 20],
	
	[21, 7],
	[22, 7, 0, 5],
	[23, 7, 5, 10],
	[24, 7, 10, 15],
	[25, 7, 15, 20],
	
	[25,  8],
	[26,  8],
	[27,  8],
	
	[27,  7, 20, 10],
	[28,  7, 10, 0],
	[29,  7],
	[29,  6, 20, 10],
	[30,  6, 10, 0],
	[31,  6],
	[31,  5, 20, 10],
	[32,  5, 10, 0],
	[33,  5],
	[33,  4, 20, 10],
	[34,  4, 10, 0],
	[35,  4],
	[35,  3, 20, 10],
	[36,  3, 10, 0],
	[37,  3],
	[37,  2, 20, 10],
	[38,  2, 10, 0]
	

];

var level4 =
[
	[-1, -1],
	[-1, 0],
	[-1, 1],
	[-1, 2],
	[-1, 3],
	[-1, 4],	
	[-1, 5],
	[-1, 6],
	[-1, 7],
	[-1, 8],
	[-1, 9],


	[0,  3],
	[1,  3],
	[2,  3],
	[3,  3],
	[4,  3],	
	[5,  3],
	[6,  3, 0, 5],
	[7,  3, 5, 10],
	[8,  3, 10, 15],
	[9,  3, 15, 20],
	//[6,  2],
	
	[9,  4],
	[10, 4, 0, 5],
	[11, 4, 5, 10],
	[12, 4, 10, 15],
	[13, 4, 15, 20],
	
	[13, 5],
	[14, 5, 0, 5],
	[15, 5, 5, 10],
	[16, 5, 10, 15],
	[17, 5, 15, 20],
	
	[17, 6],
	[18, 6, 0, 5],
	[19, 6, 5, 10],
	[20, 6, 10, 15],
	[21, 6, 15, 20],
	
	[21, 7],
	[22, 7, 0, 5],
	[23, 7, 5, 10],
	[24, 7, 10, 15],
	[25, 7, 15, 20],
	
	[25,  8],
	[26,  8],
	[27,  8],
	
	[27,  7, 20, 0],
	[28,  7, 0, 0],
	[28,  6, 20, 5],
	[29,  6, 5, 0],
	[30,  6, 0, 0],
	[31,  6, 0, 5],
	[32,  6, 5, 20],
	[32,  7, 0, 0],
	[33,  7, 0, 20],
	[33,  8, 0, 0],
	[34,  8, 0, 0],
	[35,  8, 0, 0],
	[36,  8, 0, 0],
	
	[37,  7, 0, 0],
	[37,  6, 0, 0],
	[37,  5, 0, 0],
	[37,  4, 0, 0],
	[37,  3, 0, 0],
	[37,  2, 0, 0],
	[37,  1, 0, 0],
	[37,  0, 0, 0],
	
	[38,  7, 0, 0],
	[38,  6, 0, 0],
	[38,  5, 0, 0],
	[38,  4, 0, 0],
	[38,  3, 0, 0],
	[38,  2, 0, 0],
	[38,  1, 0, 0],
	[38,  0, 0, 0],
	
	[39,  7, 0, 0],
	[39,  6, 0, 0],
	[39,  5, 0, 0],
	[39,  4, 0, 0],
	[39,  3, 0, 0],
	[39,  2, 0, 0],
	[39,  1, 0, 0],
	[39,  0, 0, 0]
];

var level5 =
[
	[0,  3],
	[1,  3],
	[2,  3],
	[3,  3],
	[4,  3],	
	[5,  3],
	[6,  3, 0, 5],
	[7,  3, 5, 10],
	[8,  3, 10, 15],
	[9,  3, 15, 20],
	//[6,  2],
	
	[8,  4],
	[9,  4],
	[10, 4, 0, 5],
	[11, 4, 5, 10],
	[12, 4, 10, 15],
	[13, 4, 15, 20],
	
	[12, 5],
	[13, 5],
	[14, 5, 0, 5],
	[15, 5, 5, 10],
	[16, 5, 10, 15],
	[17, 5, 15, 20],
	
	[16, 6],
	[17, 6],
	[18, 6, 0, 5],
	[19, 6, 5, 10],
	[20, 6, 10, 15],
	[21, 6, 15, 20],
	
	[21, 7],
	[22, 7, 0, 5],
	[23, 7, 5, 10],
	[24, 7, 10, 15],
	[25, 7, 15, 20],
	
	[25,  8],
	[26,  8],
	[27,  8],
	
	[27,  7, 20, 0],
	[28,  7, 0, 0],
	[28,  6, 20, 5],
	[29,  6, 5, 0],
	[30,  6, 0, 0],
	[31,  6, 0, 5],
	[32,  6, 5, 20],
	[32,  7, 0, 0],
	[33,  7, 0, 20],
	[33,  8, 0, 0],
	[34,  8, 0, 0],
	[35,  8, 0, 0],
	[36,  8, 0, 0],
	
	[39,  7, 0, 0],
	[39,  6, 0, 0],
	[39,  5, 0, 0],
	[39,  4, 0, 0],
	[39,  3, 0, 0],
	[39,  2, 0, 0],
	[39,  1, 0, 0],
	[39,  0, 0, 0]
]
.concat(levelBuilder.straightLine(-1, -1, 50, -1))
.concat(levelBuilder.straightLine(50, -1, 50, 50))
.concat(levelBuilder.straightLine(-1, -1, -1, 100))
.concat(levelBuilder.straightLine(0, 13, 39, 13))
;