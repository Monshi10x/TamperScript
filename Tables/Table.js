class Table {
      l_container;
      get container() {return this.l_container;}

      constructor(parentObject, widthPx, minHeightPx = 50, maxHeightPx = 100) {
            this.parentObject = parentObject;

            this.l_container = document.createElement("table");
            this.l_container.style = STYLE.Table;

            this.tableHeading = document.createElement("table");
            this.tableHeading.style = STYLE.Table;
            if(Number.isInteger(widthPx)) widthPx = widthPx + "px";
            console.log("calc(" + widthPx + " - 16px);");
            this.tableHeading.style.width = "calc(" + widthPx + " - 16px)";

            this.rowContainer = document.createElement("div");
            if(Number.isInteger(minHeightPx)) minHeightPx = minHeightPx + "px;";
            if(Number.isInteger(maxHeightPx)) maxHeightPx = maxHeightPx + "px;";
            this.rowContainer.style = "width:" + widthPx + ";min-height:" + minHeightPx + ";max-height:" + maxHeightPx + ";overflow-y:scroll;";

            this.table = document.createElement('table');
            this.table.style = STYLE.Table;

            this.container.appendChild(this.tableHeading);
            this.rowContainer.appendChild(this.table);
            this.container.appendChild(this.rowContainer);

            this.parentObject.appendChild(this.container);
      }

      addTableStyle(overrideCssStyles) {
            this.table.style.cssText += overrideCssStyles;
      }

      /**
       * 
       * @param  {...any} data note: use ...arg if passing array i.e. addRow(...data);
       */
      addRow(...data) {
            var row = document.createElement('tr');
            var columns = this.numColumns;
            for(var c = 0; c < columns; c++) {
                  var cell = document.createElement('td');
                  cell.style = STYLE.TableData;
                  if(typeof (data[c]) == 'string') {
                        cell.innerHTML = data[c] != null ? data[c] : "";
                  } else if(typeof (data[c]) == 'number') {
                        cell.innerHTML = data[c] != null ? "" + data[c] : "";
                  } else {
                        if(data[c] != null) {
                              cell.appendChild(data[c]);
                        } else {
                              cell.innerHTML = "";
                        }
                  }
                  new ResizeObserver(updateHeadingSizes).observe(cell);
                  row.appendChild(cell);
            }

            this.table.appendChild(row);
            var tempThis = this;

            function updateHeadingSizes() {
                  for(var c = 0; c < columns; c++) {
                        tempThis.headingRow.querySelectorAll("th")[c].style.width = row.querySelectorAll("td")[c].offsetWidth + "px";
                  }
            }

            return row;
      }

      getRow(rowNumber) {
            let row = this.table.querySelectorAll("tr")[rowNumber - 1];
            return row;
      }

      getRowsAll() {
            let rows = this.table.querySelectorAll("tr");
            return rows;
      }

      getCell(rowNumber, cellNumber) {
            let row = this.getRow(rowNumber);
            let cell = row.querySelectorAll("td")[cellNumber - 1];
            return cell;
      }

      deleteRow(...rowNumbers) {
            let allRows = this.table.querySelectorAll("tr");
            for(let r = 0; r < allRows.length; r++) {
                  if(rowNumbers.includes(r + 1)) {
                        $(allRows[r]).remove();
                  }
            }
      }

      deleteAllRows() {
            let allRows = this.table.querySelectorAll("tr");
            for(let row of allRows) {
                  $(row).remove();
            }
      }

      /**
       * 
       * @param  {...any} dataArray note: use ...arg if passing array i.e. addHeading(...data);
       */
      setHeading(...data) {
            this.numColumns = data.length;
            this.headingRow = document.createElement('tr');

            for(var c = 0; c < this.numColumns; c++) {
                  var heading = document.createElement('th');
                  heading.style = STYLE.TableHeader;
                  heading.innerHTML = data[c] != null ? data[c] : "";

                  this.headingRow.appendChild(heading);
            }

            this.tableHeading.appendChild(this.headingRow);
      }



      async addRowsFromFile(firstContainsHeading = false, localPathWithinTamperFolder) {
            var file = await getFileContent_Text_SingleFile_NoBlob_LocalPath(localPathWithinTamperFolder);

            var row = file.split("\r\n");
            for(var r = 0; r < row.length; r++) {
                  var data = row[r].split(",");
                  if(r == 0 && firstContainsHeading) {
                        this.setHeading(...data);
                  } else {
                        this.addRow(...data);
                  }
            }
      }
}