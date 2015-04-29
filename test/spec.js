describe("ng-xslx", function(){
	beforeEach(module('app'));

	beforeEach(inject(function(ngXslx){
		svc = ngXslx;
	}));

	it("single cell creates one sheet", function(){
		
		var result = svc.writeXslx([
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
		var result = svc.writeXslx([
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
});