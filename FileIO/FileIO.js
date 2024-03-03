var tamperPort = "http://127.0.0.1:8080";

/**
 * Use with document.getElementById('_').addEventListener('change', getFileContent_Text_SingleFile, false);
 * @param {*} e event
 * @returns file content as text
 */
async function getFileContent_Text_SingleFile(e) {
      console.log("in getFileContent_Text_SingleFile");
      var fetchedContent = false;
      var content;
      let promise = await new Promise(resolve => {
            if(window.File && window.FileReader && window.FileList && window.Blob) {
                  const files = e.target.files;
                  for(let i = 0; i < files.length; i++) {
                        if(!files[i].type.match("text")) {
                              alert("Not supported format");
                              continue;
                        }
                        const picReader = new FileReader();
                        picReader.addEventListener("load", function(event) {
                              const picFile = event.target;
                              if(i == files.length - 1) {
                                    fetchedContent = true;
                                    resolve("done");
                                    content = picFile.result;
                              }
                        });
                        picReader.readAsText(files[i]);
                  }
            } else {
                  alert("Your browser does not support File API");
            }
      });
      return content;
}

async function downloadFileContent_Text_SingleFile(content) {
      var a = document.createElement("a");
      a.href = window.URL.createObjectURL(new Blob([content], {type: "text/plain"}));
      a.download = "demo.txt";
      a.click();
}

/**
 * 
 * @param {String} urlString i.e 'External Files/LUT/TestLUT'
 * @returns Json object
 */
async function getFileContent_JSON_SingleFile_NoBlob_LocalPath(localPathWithinTamperFolder) {
      var result;
      await fetch(encodeURI(tamperPort + localPathWithinTamperFolder))
            .then(res => res.json())
            .then((data) => {
                  console.log(data);
                  result = data;
            })
            .catch((error) => {
                  console.log(error);
                  alert(error);
            });
      return result;
}

/**
 * 
 * @param {String} urlString i.e 'http://127.0.0.1:8887/External%20Files/LUT/TestLUT'
 * @returns Json object
 */
async function getFileContent_JSON_SingleFile_NoBlob_URL(urlString) {
      var result;
      await fetch(urlString)
            .then(res => res.json())
            .then((data) => {
                  console.log(data);
                  result = data;
            })
            .catch((error) => {
                  console.log(error);
                  alert(error);
            });
      return result;
}

/**
 * 
 * @param {String} urlString i.e 'External Files/LUT/TestLUT'
 * @returns string result
 */
async function getFileContent_Text_SingleFile_NoBlob_LocalPath(localPathWithinTamperFolder) {
      var result;
      await fetch(encodeURI(tamperPort + localPathWithinTamperFolder))
            .then(res => res.text())
            .then((data) => {
                  console.log(data);
                  result = data;
            })
            .catch((error) => {
                  console.log(error);
                  alert(error);
            });
      return result;
}

/**
 * 
 * @param {String} urlString i.e 'http://127.0.0.1:8887/External%20Files/LUT/TestLUT'
 * @returns string result
 */
async function getFileContent_Text_SingleFile_NoBlob_URL(urlString) {
      var result;
      await fetch(urlString)
            .then(res => res.text())
            .then((data) => {
                  console.log(data);
                  result = data;
            })
            .catch((error) => {
                  console.log(error);
                  alert(error);
            });
      return result;
}