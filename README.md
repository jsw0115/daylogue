# Daylogue - 성장을 위한 커리어 매니지먼트 플랫폼

<p align="center">
  <img src="https://img.shields.io/badge/version-2.0.0-blue?style=for-the-badge" alt="version">
  <img src="https://img.shields.io/badge/build-passing-brightgreen?style=for-the-badge" alt="build">
  <img src="https://img.shields.io/github/license/daylogue/daylogue?style=for-the-badge" alt="license">
</p>

**Daylogue**는 직장인의 일상 업무 기록을 바탕으로 성과를 관리하고, 커리어 자산을 체계적으로 구축하여 성장을 지원하는 올인원 커리어 매니지먼트 플랫폼입니다.

---

## 목차 (Table of Contents)
- [주요 기능 (Features)](#주요-기능-features)
- [시스템 아키텍처 (System-Architecture)](#시스템-아키텍처-system-architecture)
- [기술 스택 (Tech Stack)](#기술-스택-tech-stack)
- [시작하기 (Getting Started)](#시작하기-getting-started)
- [환경 변수 설정 (Environment Variables)](#환경-변수-설정-environment-variables)
- [프로젝트 구조 (Project Structure)](#프로젝트-구조-project-structure)
- [API 명세 (API Reference)](#api-명세-api-reference)
- [기여하기 (Contributing)](#기여하기-contributing)
- [문제 해결 / FAQ (Troubleshooting)](#문제-해결--faq-troubleshooting)
- [라이선스 (License)](#라이선스-license)
- [연락처 (Contact)](#연락처-contact)

---

## 주요 기능 (Features)

### 1. 일상 기록 및 에비던스 관리 (Daily Operations)
*   **데일리 업무 로그 (Quick Log):** 바텀 시트 기반의 빠른 UI로 당일 업무 내용, 소요 시간, 달성도를 기록하고 MBO/OKR 태그와 연결합니다.
*   **에비던스 볼트 (Evidence Vault):** 업무 산출물(URL, 파일 등)을 안전하게 보관합니다.
*   **워라밸 & 번아웃 방지 타이머:** 주간 누적 근로 시간을 시각화하고 휴가/야근을 관리합니다.

### 2. 목표 및 성과 얼라인먼트 (Goal & Performance)
*   **트리 구조 MBO / OKR 설정:** 상위 목표(Objective)와 하위 핵심 결과(Key Result)를 계층적으로 설정하고 관리합니다.
*   **실시간 성과 대시보드:** 데일리 로그와 연동된 MBO 달성률을 실시간으로 시각화합니다.
*   **주간/월간 스마트 회고:** AI가 일일 기록을 주간/월간 성과 문장으로 자동 요약 및 정제합니다.
*   **연봉 협상 패키지 뷰:** MBO 달성률과 핵심 증빙 자료를 한 페이지의 리포트로 컴파일합니다.

### 3. 커리어 자산화 (Career Asset)
*   **블록 조립형 이력서 생성:** 정제된 성과 텍스트를 '경력 기술 블록'으로 변환하여 드래그 앤 드롭으로 이력서를 구성합니다.
*   **자동 스택 & 키워드 추출기:** 업무 기록을 텍스트 마이닝하여 핵심 역량과 기술 스택을 자동 추출합니다.
*   **퍼블릭 포트폴리오 배포:** 완성된 이력서를 PDF로 내보내거나 외부 공유용 Web URL로 생성합니다.

### 4. 데이터 기반 인사이트 (AI Insights)
*   **스킬 갭(Skill Gap) 매핑:** 현재 역량과 목표 직무의 요구 스택을 비교하여 성장 가이드를 제시합니다.
*   **시장 가치 시뮬레이터:** 연차, 직무, 보유 스택 기반으로 예상 연봉 밴드를 시각화합니다.

> **Note:** 주요 화면의 스크린샷이나 시연 GIF는 `/docs/images` 폴더를 참조하십시오.
>
>

---

## 시스템 아키텍처 (System Architecture)

```mermaid
graph TD
    subgraph User
        A[Client: React Web App]
    end

    subgraph "Backend"
        B[Backend: Spring Boot]
        D[Database: MySQL]
    end

    subgraph "Cloud Services"
        S3[AWS S3 Storage]
        AI[AI Service (Python/LLM)]
    end

    A -- REST API Request --> B
    B -- CRUD --> D
    B -- API Call --> AI
    B -- Generate Presigned URL --> A
    A -- Direct File Upload --> S3
```

---

## 기술 스택 (Tech Stack)

### Backend
- ![Java](https://img.shields.io/badge/Java%2017-ED8B00?style=flat-square&logo=openjdk&logoColor=white)
- ![Spring Boot](https://img.shields.io/badge/Spring%20Boot%203.x-6DB33F?style=flat-square&logo=springboot&logoColor=white)
- ![Spring Security](https://img.shields.io/badge/Spring%20Security-6DB33F?style=flat-square&logo=springsecurity&logoColor=white)
- ![JPA/Hibernate](https://img.shields.io/badge/JPA%2FHibernate-59666C?style=flat-square)

### Frontend
- ![React](https://img.shields.io/badge/React%2018-20232A?style=flat-square&logo=react&logoColor=61DAFB)
- ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
- ![Recoil](https://img.shields.io/badge/Recoil-3578E5?style=flat-square)

### Database
- ![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white)

### Frontend (별도 Repository에서 관리)
- ![React](https://img.shields.io/badge/React%2018-20232A?style=flat-square&logo=react&logoColor=61DAFB)
- ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)

---

## 시작하기 (Getting Started)

### 1. Prerequisites
* Java 17+
* MySQL 8.0+

### 2. Installation & Run

```bash
# 1. Repository 클론
git clone https://github.com/daylogue/daylogue.git
cd daylogue

# 2. Backend 실행
cd backend
./gradlew build
java -jar build/libs/daylogue-0.0.1-SNAPSHOT.jar

# 3. Frontend 실행
cd ../frontend
npm install
npm start

# 주요 의존성 설치
npm install axios react-router-dom http-proxy-middleware @stomp/stompjs sockjs-client
npm install antd @ant-design/icons @fullcalendar/react @fullcalendar/daygrid @fullcalendar/timegrid @fullcalendar/interaction
npm install moment date-fns date-fns-tz react-grid-layout react-resizable
npm install recharts lucide-react clsx tailwind-merge react-error-boundary styled-components react-tooltip sweetalert

# UI 프레임워크 및 스타일링 설정 (Tailwind & Shadcn)
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npx shadcn@latest init
npx shadcn@latest add checkbox select button input card dialog toast form message

# 개발 도구 설치
npm install --save-dev eslint @eslint/js globals eslint-plugin-react prettier vite-plugin-dts @types/node

# Github Pages 배포 가능 라이브러리
npm install gh-pages --save-dev

```

---

## 환경 변수 설정 (Environment Variables)

프로젝트를 실행하기 전에 `application.yml` 파일에서 데이터베이스 설정을 수정해야 합니다.

- **Backend (`/src/main/resources/application.yml`):**
  ```yaml
  spring:
    datasource:
      url: jdbc:mysql://localhost:3306/daylogue_db
      username: your_db_username
      password: your_db_password
  ```

---

## 프로젝트 구조 (Project Structure)

```
.. 다시 수정 예정 
```

---

## API 명세 (API Reference)

API 명세는 Swagger를 통해 제공됩니다. 백엔드 서버 실행 후 아래 주소로 접속하여 확인할 수 있습니다.

- **Swagger UI:** [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)

---

## 기여하기 (Contributing)

이 프로젝트에 기여하고 싶으시다면, 언제든지 환영합니다!

1.  이슈를 생성하여 개선점을 제안해주세요.
2.  Repository를 Fork하여 자신만의 브랜치를 생성합니다. (`git checkout -b feature/AmazingFeature`)
3.  변경 사항을 커밋합니다. (`git commit -m 'Add some AmazingFeature'`)
4.  브랜치에 Push합니다. (`git push origin feature/AmazingFeature`)
5.  Pull Request를 생성해주세요.

---

## 문제 해결 / FAQ (Troubleshooting)

- **Q: Backend 실행 시 `Connection refused` 오류가 발생합니다.**
  - **A:** `application.yml`의 데이터베이스 접속 정보(URL, username, password)가 올바른지, 로컬 MySQL 서버가 정상적으로 실행 중인지 확인해주세요.

- **Q: API 호출 시 403 Forbidden 오류가 발생합니다.**
  - **A:** JWT 토큰이 요청 헤더에 올바르게 포함되었는지 확인해주세요. 로그인이 필요한 API는 인증된 토큰이 필요합니다.

---

## 라이선스 (License)

이 프로젝트는 MIT 라이선스를 따릅니다. 자세한 내용은 `LICENSE` 파일을 참고하십시오.

---

## 연락처 (Contact)

- **Project Maintainer:** [정성원]
- **Email:** [jsw0115@github.com]
- **GitHub:** [https://github.com/daylogue]
