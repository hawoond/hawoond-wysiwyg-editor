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

  styles: {
    // 기본 스타일 테마
    themes: {
      default: {
        editorWrapper: {
          maxWidth: "900px",
          backgroundColor: "#fff",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        },
        toolbar: {
          backgroundColor: "#f4f4f4",
          borderBottom: "1px solid #ccc",
        },
        editor: {
          minHeight: "400px",
          padding: "15px",
          fontSize: "16px",
        },
        title: {
          fontSize: "18px",
          padding: "8px 10px",
        },
      },
      dark: {
        editorWrapper: {
          maxWidth: "900px",
          backgroundColor: "#2d2d2d",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
        },
        toolbar: {
          backgroundColor: "#363636",
          borderBottom: "1px solid #444",
        },
        editor: {
          minHeight: "400px",
          padding: "15px",
          fontSize: "16px",
          backgroundColor: "#2d2d2d",
          color: "#fff",
        },
        title: {
          fontSize: "18px",
          padding: "8px 10px",
          backgroundColor: "#363636",
          color: "#fff",
        },
      },
    },

    // 현재 적용된 커스텀 스타일
    customStyles: null,

    // 테마 적용
    applyTheme: function (themeName) {
      const theme = this.themes[themeName] || this.themes.default;
      this.applyStyles(theme);
    },

    // 커스텀 스타일 적용
    applyCustomStyles: function (styles) {
      this.customStyles = styles;
      this.applyStyles(styles);
    },

    // 스타일 직접 적용
    applyStyles: function (styles) {
      const wrapper = document.querySelector(".editor-wrapper");
      const toolbar = document.getElementById("toolbar");
      const editor = document.getElementById("editor");
      const title = document.getElementById("editor-title");

      if (styles.editorWrapper && wrapper) {
        Object.assign(wrapper.style, styles.editorWrapper);
      }
      if (styles.toolbar && toolbar) {
        Object.assign(toolbar.style, styles.toolbar);
      }
      if (styles.editor && editor) {
        Object.assign(editor.style, styles.editor);
      }
      if (styles.title && title) {
        Object.assign(title.style, styles.title);
      }
    },

    // 현재 스타일 가져오기
    getCurrentStyles: function () {
      return this.customStyles || this.themes.default;
    },

    // 스타일 초기화
    resetStyles: function () {
      this.customStyles = null;
      this.applyTheme("default");
    },
  },
  // 도구 표시/숨김 관련 설정
  toolbarConfig: {
    showStyleSettings: true, // 스타일 설정 버튼 표시 여부
  },

  // 스타일 설정 버튼 표시/숨김 설정
  setStyleSettingsVisible: function (visible) {
    this.toolbarConfig.showStyleSettings = visible;
    this.updateToolbarButtons();
  },

  // 툴바 버튼 업데이트
  updateToolbarButtons: function () {
    const styleButton = document.querySelector(".style-settings-btn");
    if (styleButton) {
      styleButton.style.display = this.toolbarConfig.showStyleSettings
        ? "block"
        : "none";
    }
  },
};
