const textArea = document.getElementById("textArea");


function processTextarea(textArea) {
  console.log("processTextarea Started...");
  const textareaValue = textArea.value;
  const lines = textareaValue.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const currentLine = lines[i];
    const previousLine = i > 0 ? lines[i - 1] : "";

    if (currentLine.length === 0) {
      const isPreviousLineValid =
        i > 0 && i < lines.length - 1 && previousLine.includes("R0 FMAX M89");

      if (isPreviousLineValid) {
        lines[i - 1] = previousLine.replace("M89", "M99");
      }

      i++;

      while (
        i < lines.length &&
        lines[i].length !== 0 &&
        lines[i].includes("FMAX M99")
      ) {
        lines[i] = lines[i].replace("FMAX M99", "R0 FMAX M89");
        i++;
      }

      i--;
    }
  }

  textArea.value = lines.join("\n");
}

function dodatLbl() {
  console.log("dodatLbl Started...");
  let textAreaOfLbl = textArea.value;
  let lines = textAreaOfLbl.split("\n");
  let count = 0;
  let sudeLiche = 1;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("END PGM")) {
      break;
    }
    if (lines[i].length === 0) {
      sudeLiche++;
      const isOddLine = sudeLiche % 2 === 0;

      if (isOddLine) {
        count++;
        lines[i] = lines[i] + `1 LBL ${count}`;
      } else {
        lines[i] = lines[i] + "1 LBL 0";
      }
    }
  }

  let modifiedTextAreaValue = lines.join("\n");

  textArea.value = modifiedTextAreaValue;
  return modifiedTextAreaValue;
}
const zkopirovani = (modifiedTextAreaValue) => {
  console.log("zkopirovani Started...");

  const textArea = document.createElement("textarea");
  textArea.value = modifiedTextAreaValue;

  document.body.appendChild(textArea);

  textArea.select();
  document.execCommand("copy");

  document.body.removeChild(textArea);

  showAlert();
};



function showAlertFail(err) {
  $("#myAlert")
    .removeClass("alert-success")
    .addClass("alert-danger")
    .text(err)
    .addClass("show");

  setTimeout(function () {
    $("#myAlert")
    .text("Text byl zkopírován.")
    .addClass("alert-success")
    .removeClass("alert-danger")
    .removeClass("show");      
  }, 4000);
}


function insertFromClipboard(textArea) {
  console.log("insertFromClipboard Started...");
  return new Promise((resolve, reject) => {
    textArea.focus();
    navigator.clipboard
      .readText()
      .then((clipboardText) => {
        textArea.value = clipboardText;
        resolve();
      })
      .catch((err) => {
        showAlertFail(err);
        reject(err);
      });
  });
}

const innit = (id) => {
  insertFromClipboard(id)
    .then(() => processTextarea(id))
    .then(() => dodatLbl())
    .then((modifiedTextAreaValue) => zkopirovani(modifiedTextAreaValue))
    .catch((err) => console.error("Error in initialization", err));
};
