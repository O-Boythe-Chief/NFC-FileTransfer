document.getElementById("writeNfcButton").addEventListener("click", writeNfc);
document.getElementById("readNfcButton").addEventListener("click", readNfc);

async function writeNfc() {
  const messageElement = document.getElementById("message");
  try {
    if (!("NDEFReader" in window)) {
      throw new Error("NFC not supported in this browser.");
    }

    const fileInput = document.getElementById("fileInput");
    if (!fileInput.files.length) {
      alert("Please select a file to write to NFC.");
      return;
    }

    const file = fileInput.files[0];
    const arrayBuffer = await file.arrayBuffer();
    const ndef = new NDEFReader();

    await ndef.write({
      records: [
        { recordType: "mime", mediaType: file.type, data: arrayBuffer },
      ],
    });
    messageElement.innerText = "File written to NFC tag successfully!";
  } catch (error) {
    messageElement.innerText = `Error writing to NFC tag: ${error.message}`;
  }
}

async function readNfc() {
  const messageElement = document.getElementById("message");
  try {
    if (!("NDEFReader" in window)) {
      throw new Error("NFC not supported in this browser.");
    }

    const ndef = new NDEFReader();

    ndef.onreading = (event) => {
      const { message } = event;
      const record = message.records[0];

      if (record.recordType === "mime") {
        const blob = new Blob([record.data], { type: record.mediaType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "received_file";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        messageElement.innerText = "File read from NFC tag successfully!";
      } else {
        messageElement.innerText = "NFC tag does not contain a file.";
      }
    };

    await ndef.scan();
    messageElement.innerText = "Scan an NFC tag to read the file.";
  } catch (error) {
    messageElement.innerText = `Error reading from NFC tag: ${error.message}`;
  }
}
