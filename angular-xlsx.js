angular.module("ngXslx", [])
	.factory("ngXslx", function(){
		return {
			writeXslx: writeXslx
		};

		function Workbook() {
            if (!(this instanceof Workbook)) return new Workbook();
            this.SheetNames = [];
            this.Sheets = {};
        }

    	function addCols(doc, data, range){

    		// TODO: map columnDefs to fields in data

			for (var C = 0; C < data.length; C++) {
                if (C > range.e.c) range.e.c = C;

                var cell = { v: data[C], t: "s" };
                if (cell.v === null)
                    continue;

                var cell_ref = XLSX.utils.encode_cell({ c: C, r: range.e.r });
                doc[cell_ref] = cell;
            }
            range.e.r++;
    	}

		function writeXslx(data){
			var wopts = {bookType:"xslx", bookSST:false, type:"binary"};
			
			var workbook = new Workbook();

			data.forEach(function(sheet){

				var d = {};
				var columnDefs = sheet.columnDefs;

				var range = { s: { c: 0, r: 0 }, e: { c: columnDefs.length, r: 0 } };

				var header = [];
				columnDefs.forEach(function(columnDef){
					header.push(columnDef.displayName);
				});

				addCols(d, header, range);

				sheet.data.forEach(function(row){

					var rowData = [];
					columnDefs.forEach(function(columnDef){
						rowData.push(row[columnDef.field]);
					});

					addCols(d, rowData, range);
				});


				d["!ref"] = XLSX.utils.encode_range(range);


				workbook.SheetNames.push(sheet.sheetName);
				workbook.Sheets[sheet.sheetName] = d;
			});

			var wbout = XLSX.write(workbook, wopts); 
			return wbout;
		}
	});
