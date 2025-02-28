const aspIntegration = true;
let savedRange = null;

function execCommand(command, value = null) {
  document.execCommand("styleWithCSS", false, true);
  try {
    document.execCommand(command, false, value);
  } catch (e) {
    console.error("Command execution failed:", e);
  } finally {
    document.getElementById("editor").focus();
  }
}

function changeFontFamily(fontFamily) {
  document.execCommand("styleWithCSS", false, true);
  document.execCommand("fontName", false, fontFamily);
  document.getElementById("editor").focus();
}

function changeFontSize(size) {
  document.execCommand("styleWithCSS", false, true);
  document.execCommand("fontSize", false, size);
  document.getElementById("editor").focus();
}

function toggleSource() {
  const editor = document.getElementById("editor");
  if (editor.getAttribute("contenteditable") === "true") {
    editor.textContent = editor.innerHTML;
    editor.setAttribute("contenteditable", "false");
  } else {
    editor.innerHTML = editor.textContent;
    editor.setAttribute("contenteditable", "true");
  }
}

function insertImage() {
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*";
  fileInput.onchange = function () {
    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
      const imageHtml = `
              <span class="image-container" style="display: inline-block; position: relative;">
                  <img src="${e.target.result}" style="display: block; min-width: 50px;"/>
              </span>
          `;
      document.execCommand("insertHTML", false, imageHtml);

      const images = document
        .getElementById("editor")
        .getElementsByTagName("img");
      const lastImage = images[images.length - 1];
      makeImageResizable(lastImage);
    };
    reader.readAsDataURL(file);
  };
  fileInput.click();
}

function makeImageResizable(img) {
  const container = img.parentElement;

  const directions = ["nw", "ne", "sw", "se"];
  directions.forEach((dir) => {
    const handle = document.createElement("div");
    handle.className = `image-resize-handle resize-handle-${dir}`;
    handle.style.display = "none";
    container.appendChild(handle);
  });

  let isResizing = false;
  let currentHandle = null;
  let startX, startY, startWidth, startHeight;

  container.addEventListener("mouseenter", function () {
    const handles = container.getElementsByClassName("image-resize-handle");
    Array.from(handles).forEach((handle) => (handle.style.display = "block"));
  });

  container.addEventListener("mouseleave", function () {
    if (!isResizing) {
      const handles = container.getElementsByClassName("image-resize-handle");
      Array.from(handles).forEach((handle) => (handle.style.display = "none"));
    }
  });

  const handles = container.getElementsByClassName("image-resize-handle");
  Array.from(handles).forEach((handle) => {
    handle.addEventListener("mousedown", function (e) {
      isResizing = true;
      currentHandle = handle;
      startX = e.pageX;
      startY = e.pageY;
      startWidth = img.offsetWidth;
      startHeight = img.offsetHeight;
      img.classList.add("resizing");
      e.preventDefault();
    });
  });

  document.addEventListener("mousemove", function (e) {
    if (!isResizing) return;

    const deltaX = e.pageX - startX;
    const deltaY = e.pageY - startY;

    let newWidth = startWidth;
    let newHeight = startHeight;

    if (
      currentHandle.classList.contains("resize-handle-se") ||
      currentHandle.classList.contains("resize-handle-ne")
    ) {
      newWidth = startWidth + deltaX;
    }
    if (
      currentHandle.classList.contains("resize-handle-sw") ||
      currentHandle.classList.contains("resize-handle-nw")
    ) {
      newWidth = startWidth - deltaX;
    }
    if (
      currentHandle.classList.contains("resize-handle-se") ||
      currentHandle.classList.contains("resize-handle-sw")
    ) {
      newHeight = startHeight + deltaY;
    }
    if (
      currentHandle.classList.contains("resize-handle-ne") ||
      currentHandle.classList.contains("resize-handle-nw")
    ) {
      newHeight = startHeight - deltaY;
    }

    if (newWidth >= 50 && newHeight >= 50) {
      img.style.width = `${newWidth}px`;
      img.style.height = `${newHeight}px`;
    }
  });

  document.addEventListener("mouseup", function () {
    if (isResizing) {
      isResizing = false;
      img.classList.remove("resizing");

      if (!container.matches(":hover")) {
        const handles = container.getElementsByClassName("image-resize-handle");
        Array.from(handles).forEach(
          (handle) => (handle.style.display = "none")
        );
      }
    }
  });
}

function updateContent() {
  const editorContent = document.getElementById("editor").innerHTML;
  console.log("Content updated:", editorContent);
}

function getEditorContent() {
  return document.getElementById("editor").innerHTML;
}

function setEditorContent(content) {
  document.getElementById("editor").innerHTML = content;
}

function sendToServer(formId = null) {
  const editorContent = getEditorContent();

  if (aspIntegration && formId) {
    const form = document.getElementById(formId);
    if (!form) {
      alert("Form ID not found.");
      return;
    }
    const hiddenField = document.createElement("input");
    hiddenField.type = "hidden";
    hiddenField.name = "content";
    hiddenField.value = editorContent;
    form.appendChild(hiddenField);
    form.submit();
  } else {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "save_content.asp", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send("content=" + encodeURIComponent(editorContent));
    xhr.onload = function () {
      if (xhr.status === 200) {
        alert("Content saved to server successfully!");
      } else {
        alert("Error saving content to server.");
      }
    };
  }
}

function setDefaultFont() {
  execCommand("fontName", "Arial");
  execCommand("fontSize", "12");
  alert("Default font has been set.");
}

function insertDefaultContent() {
  const defaultContent = "<p>이곳에 내용을 입력하세요!</p>";
  setEditorContent(defaultContent);
  alert("Default content inserted.");
}

function showTableDialog() {
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    savedRange = selection.getRangeAt(0).cloneRange();
  }
  document.getElementById("tableDialog").style.display = "block";
}

function closeTableDialog() {
  document.getElementById("tableDialog").style.display = "none";
  savedRange = null;
}

function insertTableFromDialog() {
  const rows = parseInt(document.getElementById("tableRows").value);
  const cols = parseInt(document.getElementById("tableCols").value);

  if (
    isNaN(rows) ||
    isNaN(cols) ||
    rows < 1 ||
    cols < 1 ||
    rows > 20 ||
    cols > 20
  ) {
    alert("행과 열은 1-20 사이의 숫자여야 합니다.");
    return;
  }

  let tableHTML = "<table>";
  for (let i = 0; i < rows; i++) {
    tableHTML += "<tr>";
    for (let j = 0; j < cols; j++) {
      tableHTML += `
                <td style="
                    min-width: 50px;
                    padding: 8px;
                    border: 1px solid #ccc;
                    word-wrap: break-word;
                    word-break: break-all;
                    text-align: left;
                    vertical-align: top;
                "><p><br></p></td>`;
    }
    tableHTML += "</tr>";
  }
  tableHTML += "</table>";

  if (savedRange) {
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(savedRange);

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = tableHTML;

    savedRange.deleteContents();
    savedRange.insertNode(tempDiv.firstElementChild);

    savedRange = null;
  }

  closeTableDialog();

  document.getElementById("editor").focus();
}

function initTableResizing() {
  const editor = document.getElementById("editor");
  let isResizing = false;
  let currentCell = null;
  let startX, startY, startWidth, startHeight;
  let resizeDirection = null;

  function addResizeHandles(cell) {
    if (cell.querySelector(".resize-handle-right")) return;

    const rightHandle = document.createElement("div");
    rightHandle.className = "resize-handle-right";
    cell.appendChild(rightHandle);

    const bottomHandle = document.createElement("div");
    bottomHandle.className = "resize-handle-bottom";
    cell.appendChild(bottomHandle);
  }

  function addResizeHandlesToTable(table) {
    const cells = table.getElementsByTagName("td");
    Array.from(cells).forEach(addResizeHandles);
  }

  const originalInsertTableFromDialog = window.insertTableFromDialog;
  window.insertTableFromDialog = function () {
    originalInsertTableFromDialog();
    const tables = editor.getElementsByTagName("table");
    Array.from(tables).forEach(addResizeHandlesToTable);
  };

  editor.addEventListener("mousedown", function (e) {
    if (e.target.classList.contains("resize-handle-right")) {
      isResizing = true;
      resizeDirection = "horizontal";
      currentCell = e.target.parentElement;
      startX = e.pageX;
      startWidth = currentCell.offsetWidth;
      currentCell.classList.add("resizing");
    } else if (e.target.classList.contains("resize-handle-bottom")) {
      isResizing = true;
      resizeDirection = "vertical";
      currentCell = e.target.parentElement;
      startY = e.pageY;
      startHeight = currentCell.offsetHeight;
      currentCell.classList.add("resizing");
    }
  });

  document.addEventListener("mousemove", function (e) {
    if (!isResizing) return;

    if (resizeDirection === "horizontal") {
      const width = startWidth + (e.pageX - startX);
      if (width > 30) {
        currentCell.style.width = width + "px";
      }
    } else if (resizeDirection === "vertical") {
      const height = startHeight + (e.pageY - startY);
      if (height > 20) {
        currentCell.style.height = height + "px";
      }
    }
  });

  document.addEventListener("mouseup", function () {
    if (isResizing) {
      isResizing = false;
      if (currentCell) {
        currentCell.classList.remove("resizing");
      }
      currentCell = null;
      resizeDirection = null;
    }
  });

  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      mutation.addedNodes.forEach(function (node) {
        if (node.nodeName === "TABLE") {
          addResizeHandlesToTable(node);
        }
      });
    });
  });

  observer.observe(editor, {
    childList: true,
    subtree: true,
  });
}

const toolbarButtons = [
  {
    command: "fontName",
    type: "select",
    options: [
      { value: "Arial", text: "Arial" },
      { value: "Courier New", text: "Courier New" },
      { value: "Georgia", text: "Georgia" },
      { value: "Tahoma", text: "Tahoma" },
      { value: "Verdana", text: "Verdana" },
    ],
  },
  {
    command: "fontSize",
    type: "select",
    options: [
      { value: "1", text: "8pt" },
      { value: "2", text: "10pt" },
      { value: "3", text: "12pt" },
      { value: "4", text: "14pt" },
      { value: "5", text: "18pt" },
      { value: "6", text: "24pt" },
      { value: "7", text: "36pt" },
    ],
  },
  { command: "bold", icon: "bold.svg", title: "굵게" },
  { command: "italic", icon: "italic.svg", title: "기울임" },
  { command: "underline", icon: "underline.svg", title: "밑줄" },
  { command: "justifyLeft", icon: "justify-left.svg", title: "왼쪽 정렬" },
  {
    command: "justifyCenter",
    icon: "justify-center.svg",
    title: "가운데 정렬",
  },
  { command: "justifyRight", icon: "justify-right.svg", title: "오른쪽 정렬" },
  {
    command: "insertUnorderedList",
    icon: "bullet-list.svg",
    title: "심볼 목록",
  },
  {
    command: "insertOrderedList",
    icon: "number-list.svg",
    title: "숫자 목록",
  },
  { command: "indent", icon: "indent.svg", title: "들여쓰기" },
  { command: "outdent", icon: "outdent.svg", title: "내어쓰기" },
  { command: "createLink", icon: "create-link.svg", title: "링크" },
  { command: "unlink", icon: "unlink.svg", title: "링크 제거" },
  { command: "toggleSource", icon: "html.svg", title: "HTML 보기" },
  { command: "insertTable", icon: "table.svg", title: "표 삽입" },
  { command: "insertImage", icon: "image.svg", title: "이미지 삽입" },
  {
    command: "styleSettings",
    icon: "settings.svg",
    title: "스타일 설정",
    onClick: showStyleDialog,
  },
];

function createToolbar() {
  const toolbar = document.getElementById("toolbar");
  const iconBasePath =
    "https://cdn.jsdelivr.net/gh/hawoond/hawoond-wysiwyg-editor@main/dist/icons/";

  toolbarButtons.forEach((button) => {
    if (button.type === "select") {
      const select = document.createElement("select");
      select.onchange = () => execCommand(button.command, select.value);

      button.options.forEach((option) => {
        const opt = document.createElement("option");
        opt.value = option.value;
        opt.textContent = option.text;
        select.appendChild(opt);
      });

      toolbar.appendChild(select);
    } else if (button.command === "styleSettings") {
      if (EditorUtils.toolbarConfig.showStyleSettings) {
        const btn = document.createElement("button");
        btn.className = "style-settings-btn";
        btn.title = button.title;
        btn.onclick = button.onClick;

        const img = document.createElement("img");
        img.src = iconBasePath + button.icon;
        img.alt = button.title;

        btn.appendChild(img);
        toolbar.appendChild(btn);
      }
    } else {
      const btn = document.createElement("button");
      btn.title = button.title;
      btn.onclick = () => {
        if (button.command === "createLink") {
          const url = prompt("URL을 입력하세요:", "http://");
          if (url) execCommand(button.command, url);
        } else if (button.command === "toggleSource") {
          toggleSource();
        } else if (button.command === "insertImage") {
          insertImage();
        } else if (button.command === "insertTable") {
          showTableDialog();
        } else {
          execCommand(button.command);
        }
      };

      const img = document.createElement("img");
      img.src = iconBasePath + button.icon;
      img.alt = button.title;

      btn.appendChild(img);
      toolbar.appendChild(btn);
    }
  });
}
function showStyleDialog() {
  document.getElementById("styleDialog").style.display = "flex";
}

function closeStyleDialog() {
  document.getElementById("styleDialog").style.display = "none";
}

function changeTheme(themeName) {
  EditorUtils.styles.applyTheme(themeName);
}

function applyCustomStyle() {
  try {
    const styleInput = document.getElementById("customStyleInput").value;
    const customStyles = JSON.parse(styleInput);
    EditorUtils.styles.applyCustomStyles(customStyles);
    closeStyleDialog();
  } catch (e) {
    alert("스타일 형식이 올바르지 않습니다. JSON 형식을 확인해주세요.");
  }
}

function resetStyle() {
  EditorUtils.styles.resetStyles();
  document.getElementById("customStyleInput").value = "";
  document.getElementById("themeSelect").value = "default";
}

toolbarButtons.push({
  command: "styleSettings",
  icon: "settings.svg",
  title: "스타일 설정",
  onClick: showStyleDialog,
});

function createDialogs() {
  // 테이블 대화상자 생성
  const tableDialog = document.createElement("div");
  tableDialog.id = "tableDialog";
  tableDialog.className = "dialog";
  tableDialog.innerHTML = `
      <div class="dialog-content">
          <div class="dialog-header">
              <h3>표 생성</h3>
              <button class="close-btn" onclick="closeTableDialog()">&times;</button>
          </div>
          <div class="form-group">
              <label for="tableRows">행:</label>
              <input type="number" id="tableRows" min="1" max="20" value="2">
          </div>
          <div class="form-group">
              <label for="tableCols">열:</label>
              <input type="number" id="tableCols" min="1" max="20" value="2">
          </div>
          <div class="dialog-buttons">
              <button onclick="insertTableFromDialog()">삽입</button>
              <button onclick="closeTableDialog()">취소</button>
          </div>
      </div>
  `;

  // 스타일 설정 대화상자 생성
  const styleDialog = document.createElement("div");
  styleDialog.id = "styleDialog";
  styleDialog.className = "dialog";
  styleDialog.innerHTML = `
      <div class="dialog-content">
          <div class="dialog-header">
              <h3>에디터 스타일 설정</h3>
              <button class="close-btn" onclick="closeStyleDialog()">&times;</button>
          </div>
          <div class="style-settings">
              <div class="form-group">
                  <label>테마 선택:</label>
                  <select id="themeSelect" onchange="changeTheme(this.value)">
                      <option value="default">기본 테마</option>
                      <option value="dark">다크 모드</option>
                  </select>
              </div>
              <div class="form-group">
                  <label>커스텀 스타일:</label>
                  <textarea id="customStyleInput" rows="10" placeholder="{
  editorWrapper: {
      maxWidth: '900px',
      backgroundColor: '#fff'
  },
  toolbar: {
      backgroundColor: '#f4f4f4'
  },
  editor: {
      minHeight: '400px',
      fontSize: '16px'
  }
}"></textarea>
              </div>
              <div class="dialog-buttons">
                  <button onclick="applyCustomStyle()">적용</button>
                  <button onclick="resetStyle()">초기화</button>
                  <button onclick="closeStyleDialog()">취소</button>
              </div>
          </div>
      </div>
  `;

  document.body.appendChild(tableDialog);
  document.body.appendChild(styleDialog);
}

function initEditor() {
  document.execCommand("styleWithCSS", false, true);
  createDialogs();
  createToolbar();
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeTableDialog();
    }
  });

  document
    .getElementById("tableDialog")
    .addEventListener("click", function (e) {
      if (e.target === this) {
        closeTableDialog();
      }
    });

  initTableResizing();

  const images = document.getElementById("editor").getElementsByTagName("img");
  Array.from(images).forEach(makeImageResizable);

  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      mutation.addedNodes.forEach(function (node) {
        if (
          node.nodeName === "IMG" &&
          !node.parentElement.classList.contains("image-container")
        ) {
          makeImageResizable(node);
        }
      });
    });
  });

  observer.observe(document.getElementById("editor"), {
    childList: true,
    subtree: true,
  });

  document.getElementById("editor").focus();
}

window.onload = function () {
  initEditor();
};
