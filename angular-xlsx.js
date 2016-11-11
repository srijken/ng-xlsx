angular.module("ngXlsx", [])
    .factory("ngXlsx", ["$interpolate", function ($interpolate) {
        return {
            writeXlsx: writeXlsx,
            getBlob: getBlob
        };

        function Workbook() {
            if (!(this instanceof Workbook)) return new Workbook();
            this.SheetNames = [];
            this.Sheets = {};
        }

        function datenum(v, date1904) {
            if (date1904) v += 1462;
            var epoch = Date.parse(v);
            return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
        }

        function addCols(doc, data, range) {

            // TODO: map columnDefs to fields in data

            for (var C = 0; C < data.length; C++) {
                if (C > range.e.c) range.e.c = C;

                var cell = {
                    v: data[C]
                };
                if (cell.v === null)
                    continue;

                if (typeof cell.v === 'number') cell.t = 'n';
                else if (typeof cell.v === 'boolean') cell.t = 'b';
                else if (cell.v instanceof Function) {
                    cell.v(cell, {
                        datenum: datenum
                    });
                } else if (cell.v instanceof Date) {
                    cell.t = 'n';
                    cell.z = XLSX.SSF._table[14];
                    cell.v = datenum(cell.v);
                } else cell.t = 's';

                var cell_ref = XLSX.utils.encode_cell({
                    c: C,
                    r: range.e.r
                });
                doc[cell_ref] = cell;
            }
            range.e.r++;
        }

        function writeXlsx(data) {
            var wopts = {
                bookType: "xlsx",
                bookSST: false,
                type: "binary"
            };

            var workbook = new Workbook();

            var startSymbol = $interpolate.startSymbol();
            var endSymbol = $interpolate.endSymbol();

            data.forEach(function (sheet) {

                var d = { '!cols': []};
                var columnDefs = sheet.columnDefs;

                var range = {
                    s: {
                        c: 0,
                        r: 0
                    },
                    e: {
                        c: columnDefs.length - 1,
                        r: 0
                    }
                };

                var header = [];
                columnDefs.forEach(function (columnDef) {
                    header.push(columnDef.displayName);

                    if (columnDef.cellFilter) {
                        columnDef.interpolator = $interpolate(startSymbol + columnDef.field + "|" + columnDef.cellFilter + endSymbol);
                    } else {
                        columnDef.interpolator = $interpolate(startSymbol + columnDef.field + endSymbol);
                    }

                    if(columnDef.width) {
                        d['!cols'].push({wpx: columnDef.width});
                    }
                });

                addCols(d, header, range);
                sheet.data.forEach(function (row) {

                    var rowData = [];
                    columnDefs.forEach(function (columnDef) {
                        var cellValue = columnDef.interpolator(row);
                        rowData.push(cellValue);
                    });

                    addCols(d, rowData, range);
                });

                range.e.r--;
                d["!ref"] = XLSX.utils.encode_range(range);


                workbook.SheetNames.push(sheet.sheetName);
                workbook.Sheets[sheet.sheetName] = d;
            });

            //XLSX.writeFile(workbook, 'out.xlsx');
            var wbout = XLSX.write(workbook, wopts);


            return wbout;
        }

        function s2ab(s) {
            var buf = new ArrayBuffer(s.length);
            var view = new Uint8Array(buf);
            for (var i = 0; i != s.length; ++i)
                view[i] = s.charCodeAt(i) & 0xFF;
            return buf;
        }

        function getBlob(data) {
            var result = writeXlsx(data);
            return new Blob([s2ab(result)], {
                type: "application/octet-stream"
            });
        }
    }]);