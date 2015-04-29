# ng-xslx

Usage

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