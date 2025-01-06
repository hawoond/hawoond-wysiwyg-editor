const EditorUtils = {
  getContent: function () {
    return document.getElementById("editor").innerHTML;
  },

  setContent: function (content) {
    document.getElementById("editor").innerHTML = content;
  },

  initWithContent: function (content) {
    this.setContent(content);
    initEditor(); 
  },

  getTitle: function () {
    return document.getElementById("editor-title").value.trim();
  },

  setTitle: function (title) {
    document.getElementById("editor-title").value = title;
  },

  getAllContent: function () {
    return {
      title: this.getTitle(),
      content: this.getContent(),
    };
  },

  setAllContent: function (title, content) {
    this.setTitle(title);
    this.setContent(content);
  },

  
  updateEditorFields: function (
    formId,
    titleFieldName = "editorTitle",
    contentFieldName = "editorContent"
  ) {
    const form = document.getElementById(formId);
    if (!form) {
      console.error("Form not found:", formId);
      return false;
    }

    let titleField = form.querySelector(`input[name="${titleFieldName}"]`);
    if (!titleField) {
      titleField = document.createElement("input");
      titleField.type = "hidden";
      titleField.name = titleFieldName;
      form.appendChild(titleField);
    }
    titleField.value = this.getTitle();


    let contentField = form.querySelector(`input[name="${contentFieldName}"]`);
    if (!contentField) {
      contentField = document.createElement("input");
      contentField.type = "hidden";
      contentField.name = contentFieldName;
      form.appendChild(contentField);
    }
    contentField.value = this.getContent();

    return true;
  },


  handleImageUpload: function (uploadUrl, callback) {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";

    fileInput.onchange = function () {
      const file = fileInput.files[0];
      const formData = new FormData();
      formData.append("image", file);

      const xhr = new XMLHttpRequest();
      xhr.open("POST", uploadUrl, true);

      xhr.onload = function () {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          if (response.success && response.imageUrl) {
            callback(response.imageUrl);
          } else {
            alert(
              "이미지 업로드 실패: " + (response.message || "알 수 없는 오류")
            );
          }
        } else {
          alert("이미지 업로드 중 오류가 발생했습니다.");
        }
      };

      xhr.onerror = function () {
        alert("이미지 업로드 중 네트워크 오류가 발생했습니다.");
      };

      xhr.send(formData);
    };

    fileInput.click();
  },

  setReadOnly: function (readonly) {
    const editor = document.getElementById("editor");
    editor.contentEditable = !readonly;

    const toolbar = document.getElementById("toolbar");
    const buttons = toolbar.getElementsByTagName("button");
    const selects = toolbar.getElementsByTagName("select");

    Array.from(buttons).forEach((button) => {
      button.disabled = readonly;
    });

    Array.from(selects).forEach((select) => {
      select.disabled = readonly;
    });
  },

  validate: function () {
    const title = this.getTitle();
    const content = this.getContent();

    if (!title) {
      alert("제목을 입력해주세요.");
      document.getElementById("editor-title").focus();
      return false;
    }

    if (!content || content === "<p><br></p>") {
      alert("내용을 입력해주세요.");
      document.getElementById("editor").focus();
      return false;
    }

    return true;
  },
};
