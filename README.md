```markdown
# hawoond WYSIWYG Editor for Classic ASP

Classic ASP 환경에서 사용할 수 있는 WYSIWYG 에디터입니다. 손쉽게 텍스트 편집, 이미지 삽입, 표 삽입 등의 기능을 구현할 수 있습니다.
아직 Classic ASP를 사용하는 프로젝트에 도움이 될 수 있으면 좋겠습니다.

## 📋 기능

- 텍스트 서식 (굵게, 기울임, 밑줄)
- 글꼴 및 크기 변경
- 이미지 업로드 및 크기 조절
- 표 삽입 및 크기 조절
- 링크 삽입
- HTML 소스 보기/편집
- 테마 및 스타일 커스터마이징
- 파일 업로드

## 🚀 시작하기

### CDN으로 사용하기

```html
<!-- CSS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/hawoond/hawoond-wysiwyg-editor@main/dist/editor.min.css">

<!-- JavaScript -->
<script src="https://cdn.jsdelivr.net/gh/hawoond/hawoond-wysiwyg-editor@main/dist/editor.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/hawoond/hawoond-wysiwyg-editor@main/dist/editor_utils.min.js"></script>
```

### 기본 사용법

```html
<!-- 1. HTML에 에디터 컨테이너 추가 -->
<div class="editor-wrapper">
    <div class="title-section">
        <input type="text" id="editor-title" placeholder="제목을 입력하세요">
    </div>
    <div id="editor-container">
        <div id="toolbar"></div>
        <div id="editor" contenteditable="true"></div>
    </div>
</div>

<!-- 2. 에디터 초기화 -->
<script>
    window.onload = function() {
        initEditor();
    };
</script>
```

## 📚 API 레퍼런스

### EditorUtils 객체

```javascript
// 기본 기능
EditorUtils.getContent()          // 에디터 내용 가져오기
EditorUtils.getTitle()           // 제목 가져오기
EditorUtils.setContent(content)   // 에디터 내용 설정
EditorUtils.setTitle(title)      // 제목 설정
EditorUtils.validate()           // 입력값 검증
EditorUtils.setReadOnly(bool)    // 읽기 전용 모드 설정
EditorUtils.clear()              // 에디터 내용 초기화

// 스타일 관련 기능
EditorUtils.styles.applyTheme(themeName)           // 테마 적용
EditorUtils.styles.applyCustomStyles(styles)       // 커스텀 스타일 적용
EditorUtils.styles.resetStyles()                   // 스타일 초기화
EditorUtils.styles.getCurrentStyles()              // 현재 스타일 가져오기

// 툴바 설정
EditorUtils.toolbarConfig.showStyleSettings        // 스타일 설정 버튼 표시 여부
EditorUtils.setStyleSettingsVisible(bool)          // 스타일 설정 버튼 표시/숨김 설정
```

## 🎨 스타일 커스터마이징

### 테마 변경
```javascript
// 기본 제공 테마 적용
EditorUtils.styles.applyTheme('default');  // 기본 테마
EditorUtils.styles.applyTheme('dark');     // 다크 테마
```

### 커스텀 스타일 적용
```javascript
EditorUtils.styles.applyCustomStyles({
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
});
```

## 🔧 이미지 업로드 설정

이미지 업로드를 위해서는 서버 측 처리가 필요합니다. 다음은 ASP에서의 이미지 업로드 처리 예시입니다:

```asp
<!-- upload_image.asp -->
<%@ Language="VBScript" %>
<%
    ' 이미지 업로드 처리
    Dim Upload, File, fileName
    Set Upload = Server.CreateObject("DEXT.FileUpload")
    Upload.DefaultPath = Server.MapPath("./uploads")

    If Upload.TotalBytes > 0 Then
        Set File = Upload("image")
        fileName = "img_" & Year(Now) & Month(Now) & Day(Now) & Hour(Now) & Minute(Now) & Second(Now) & ".jpg"
        File.SaveAs Upload.DefaultPath & "\" & fileName
        
        Response.Write "{""success"": true, ""imageUrl"": ""uploads/" & fileName & """}"
    End If
%>
```

## ⚠️ 주의사항

1. 파일 업로드 시 보안 설정 필수
2. XSS 방지를 위한 내용 필터링 권장
3. DB 저장 시 특수문자 처리 필요
4. CDN 사용 시 캐시 갱신 시간 고려 필요

## 📄 라이센스

이 프로젝트는 Modified MIT License에 따라 라이센스가 부여됩니다.

- 비상업적 사용: 출처 표시 후 자유롭게 사용 가능
- 상업적 사용: 작성자의 명시적 허가 필요
- 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요

상업적 사용 문의: hawoond@gmail.com

## 🤝 기여하기

1. 이 저장소를 Fork 합니다.
2. 새로운 Branch를 만듭니다: `git checkout -b feature/기능명`
3. 변경사항을 Commit 합니다: `git commit -m 'Add 기능명'`
4. Branch를 Push 합니다: `git push origin feature/기능명`
5. Pull Request를 보냅니다.

## 🐛 이슈 보고

버그를 발견하셨다면 GitHub Issues에 보고해 주세요.
[이슈 보고하기](https://github.com/hawoond/wysiwyg-editor/issues)

## 📞 문의하기

추가 문의사항이 있으시다면 다음 연락처로 문의해 주세요:
- Email: hawoond@gmail.com

---

Made by hawoond
```