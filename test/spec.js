describe("ng-xslx", function(){
	beforeEach(module('app'));

	beforeEach(inject(function(ngXslx){
		svc = ngXslx;
	}));

	it("single cell creates one sheet", function(){
		
		var result = svc.writeXlsx([
		{
			sheetName: "testSheet",
			columnDefs: [
				{field: "colA", displayName: "Column A"}
			],
			data: [
				{colA: 1}
			]
		}
		]);
		//console.log(result);

		var workbook = XLSX.read(result, {type:"binary"});

		expect(workbook.SheetNames.length).toEqual(1);
	});

	it("created sheet contains data", function(){
		var result = svc.writeXlsx([
		{
			sheetName: "testSheet",
			columnDefs: [
				{field: "colA", displayName: "Column A"}
			],
			data: [
				{colA: 1}
			]
		}
		]);

		var workbook = XLSX.read(result, {type:"binary"});
		var sheet = workbook.Sheets.testSheet;

		expect(sheet.A1.v).toEqual("Column A");
		expect(sheet.A2.v).toEqual("1");
	});

	it("book with two sheets", function(){
		var result = svc.writeXlsx([
		{
			sheetName: "testSheet",
			columnDefs: [
				{field: "colA", displayName: "Column A"}
			],
			data: [
				{colA: 1}
			]
		},
		{
			sheetName: "testSheet2",
			columnDefs: [
				{field: "colA", displayName: "Column A sheet2"}
			],
			data: [
				{colA: 1}
			]
		}
		]);

		var workbook = XLSX.read(result, {type:"binary"});
		var sheet = workbook.Sheets.testSheet;
		var sheet2 = workbook.Sheets.testSheet2;
		
		expect(sheet.A1.v).toEqual("Column A");
		expect(sheet2.A1.v).toEqual("Column A sheet2");
	});

	it("cells are mapped to columns", function(){
		var result = svc.writeXlsx([
		{
			sheetName: "testSheet",
			columnDefs: [
				{field: "colA", displayName: "Column A"},
				{field: "colB", displayName: "Column B"}
			],
			data: [
				{colB: 1}
			]
		}
		]);

		console.log(result);

		var workbook = XLSX.read(result, {type:"binary"});

		browser().window()

		var testSheet = workbook.Sheets.testSheet;

		//expect(testSheet.A2.v).toEqual("");
		expect(testSheet.B2.v).toEqual("1");
	});
});