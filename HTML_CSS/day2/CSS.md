## 1. CSS란?
CSS(Cascading Style Sheets)는 HTML로 만든 문서의 **시각적 표현과 레이아웃을 꾸미는 스타일 언어**

## 2. CSS 적용 방식 3가지
| 방식 | 작성 위치 | 특징 및 활용도 | 예시 |
| :--- | :--- | :--- | :--- |
| **External CSS** | 별도의 `.css` 파일 작성 후 `<link>`로 연결 | 여러 HTML 페이지에 같은 스타일을 재사용하기 좋고 유지보수가 가장 쉬움 (`resume_style.css` 방식) | `<link rel="stylesheet" href="./resume_style.css">` |
| **Internal CSS** | HTML 파일의 `<head>` 안 `<style>` 태그에 작성 | 한 HTML 문서에만 적용할 스타일을 빠르게 적을 때 사용 | `<style> h1 { color: #111827; } </style>` |
| **Inline CSS** | HTML 태그의 `style` 속성에 직접 작성 | 특정 요소 하나에만 급하게 스타일을 줄 때 쓰지만, 유지보수가 어려워 최소화하는 편 | `<p style="color: gray;">설명</p>` |

## 3. CSS Selector (선택자)
선택자(Selector)는 CSS 규칙을 **어떤 HTML 요소에 적용할지 지정하는 패턴**

**전체 선택자 (`*`)**: 문서의 모든 요소를 선택

**태그 선택자 (`태그명`)**: 특정 HTML 태그 전체를 선택

**클래스 선택자 (`.클래스명`)**: `class` 속성이 같은 요소들을 선택하며, 여러 곳에 재사용

**아이디 선택자 (`#아이디명`)**: 고유한 `id`를 가진 요소를 선택

**자손 선택자 (공백 `A B`)**: `A` 안쪽에 있는 모든 `B`를 선택

**그룹 선택자 (쉼표 `A, B`)**: 여러 선택자에 같은 스타일을 한 번에 적용

## 4. 주요 Style 속성
### 4-1. Text 관련 속성
**`font-size`**: 글자 크기를 지정 (`px`, `rem`, `em` 등 사용)

**`font-size`**: 글자 크기를 지정 (`px`, `rem`, `em` 등 사용)

**`text-align`**: 텍스트의 가로 정렬 방향을 지정합니다. (`left`, `center`, `right`, `justify`)
### 4-2. Box Model 속성
1. **`content`**: 실제 텍스트나 이미지 등 내용이 들어가는 영역입니다.
2. **`padding`**: `content`와 `border` 사이의 **안쪽 여백**입니다. 배경색이 `padding` 영역까지 칠해집니다.
3. **`border`**: `padding` 바깥을 감싸는 **테두리**입니다. 두께, 스타일, 색상을 지정합니다.
4. **`margin`**: `border` 바깥쪽의 **다른 요소와의 간격(바깥 여백)**