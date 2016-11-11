# ng-xslx

Installation

    bower install --save angular-xlsx

Usage

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
